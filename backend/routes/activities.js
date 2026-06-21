import express from 'express';
import { getSupabase } from '../config/supabase.js';
import { authenticateToken } from './auth.js';

const router = express.Router();
const CLIMATIQ_API_KEY = process.env.CLIMATIQ_API_KEY;

// Estimate emissions using Climatiq API or fallback coefficients
const estimateCarbon = async (type, parameters) => {
  const hasClimatiqKey = CLIMATIQ_API_KEY && CLIMATIQ_API_KEY !== 'your_climatiq_api_token';

  if (hasClimatiqKey) {
    try {
      console.log(`Climatiq API call initiated for: ${type}`);
      let activityId = "";
      let payloadParams = {};

      if (type === 'flight') {
        const isIntl = parameters.distance > 1000;
        activityId = `passenger_flight-route_type_${isIntl ? 'international' : 'domestic'}-line_class_economy`;
        payloadParams = {
          passengers: parseInt(parameters.passengers || 1),
          distance: parseFloat(parameters.distance || 100),
          distance_unit: "km"
        };
      } else if (type === 'vehicle') {
        const fuel = parameters.fuelType === 'diesel' ? 'diesel' : 'petrol';
        activityId = `passenger_vehicle-vehicle_type_car-fuel_source_${fuel}-engine_size_medium-vehicle_age_na-vehicle_weight_na`;
        payloadParams = {
          distance: parseFloat(parameters.distance || 10),
          distance_unit: "km"
        };
      } else if (type === 'transit') {
        // Public transport trains
        activityId = "passenger_train-route_type_local-fuel_source_electricity-traction_na";
        payloadParams = {
          passengers: 1,
          distance: parseFloat(parameters.distance || 10),
          distance_unit: "km"
        };
      } else if (type === 'electricity' || type === 'ac') {
        activityId = "electricity-carbon_intensity_grid_mix";
        payloadParams = {
          energy: parseFloat(parameters.kwh || 1),
          energy_unit: "kWh"
        };
      }

      if (activityId) {
        const response = await fetch("https://api.climatiq.io/data/v1/estimate", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${CLIMATIQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            emission_factor: { activity_id: activityId },
            parameters: payloadParams
          })
        });

        if (response.ok) {
          const data = await response.json();
          return parseFloat(data.co2e.toFixed(2));
        } else {
          const errMsg = await response.text();
          console.error("Climatiq API error response, using local model:", errMsg);
        }
      }
    } catch (err) {
      console.error("Climatiq connection error, using local fallback math:", err.message);
    }
  }

  // Local coefficient model fallbacks
  if (type === 'flight') {
    const passengers = parseInt(parameters.passengers || 1);
    const distance = parseFloat(parameters.distance || 100);
    return parseFloat((distance * 0.15 * passengers).toFixed(2));
  } else if (type === 'vehicle') {
    const distance = parseFloat(parameters.distance || 10);
    let factor = 0.18; // petrol
    if (parameters.fuelType === 'diesel') factor = 0.16;
    if (parameters.fuelType === 'hybrid') factor = 0.10;
    if (parameters.fuelType === 'electric') factor = 0.06;
    return parseFloat((distance * factor).toFixed(2));
  } else if (type === 'transit') {
    const distance = parseFloat(parameters.distance || 10);
    // Metro/train footprint: 0.06 kg/km, Bus: 0.08 kg/km
    const factor = parameters.transitType === 'bus' ? 0.08 : 0.06;
    return parseFloat((distance * factor).toFixed(2));
  } else if (type === 'electricity' || type === 'ac') {
    const kwh = parseFloat(parameters.kwh || 1);
    return parseFloat((kwh * 0.85).toFixed(2));
  }

  return 1.0;
};

// Log a Carbon Calculation
router.post('/log', authenticateToken, async (req, res) => {
  const { 
    type, 
    distance, fuelType, passengers, transitType, 
    hours, count, kwh, 
    kg, liters, 
    isActionPrevented 
  } = req.body;
  const userId = req.user.id;
  const supabase = getSupabase();

  try {
    let emitted = 0;
    let saved = 0;
    let details = { ...req.body };

    // 1. Transportation Category
    if (type === 'flight') {
      const flightParams = { distance: parseFloat(distance || 100), passengers: parseInt(passengers || 1) };
      emitted = await estimateCarbon('flight', flightParams);
      if (isActionPrevented) {
        saved = emitted;
        emitted = 0;
      }
    } 
    
    else if (type === 'vehicle') {
      const vehicleParams = { distance: parseFloat(distance || 10), fuelType };
      emitted = await estimateCarbon('vehicle', vehicleParams);
      
      const petrolBaseline = parseFloat(distance || 10) * 0.18;
      if (isActionPrevented) {
        saved = petrolBaseline;
        emitted = 0;
      } else {
        saved = Math.max(0, petrolBaseline - emitted);
      }
    } 
    
    else if (type === 'transit') {
      // Swapped driving a car for public transit
      const transitParams = { distance: parseFloat(distance || 10), transitType };
      emitted = await estimateCarbon('transit', transitParams);
      
      const petrolBaseline = parseFloat(distance || 10) * 0.18;
      // Saved is baseline car emissions minus actual public transit emissions
      saved = Math.max(0, petrolBaseline - emitted);
    }

    // 2. Household Energy Category
    else if (type === 'ac') {
      const acKwh = parseFloat(hours || 1) * 1.5;
      saved = await estimateCarbon('ac', { kwh: acKwh });
      emitted = 0;
    } 
    
    else if (type === 'led') {
      // Swapped incandescent (60W) to LED (9W). Saves 51W (0.051 kWh) per hour.
      // If we assume a standard 5 hours daily usage, it saves 0.255 kWh per day per bulb.
      // 0.255 kWh * 0.85 kg/kWh = 0.22 kg CO2 saved per bulb/day.
      const bulbCount = parseFloat(count || 1);
      saved = parseFloat((bulbCount * 0.22).toFixed(2));
      emitted = 0;
    } 
    
    else if (type === 'appliance') {
      // Energy star upgrades prevent average 0.80 kg CO2 per day
      const applianceCount = parseFloat(count || 1);
      saved = parseFloat((applianceCount * 0.80).toFixed(2));
      emitted = 0;
    } 
    
    else if (type === 'electricity') {
      saved = await estimateCarbon('electricity', { kwh: parseFloat(kwh || 1) });
      emitted = 0;
    }

    // 3. Lifestyle & Waste Category
    else if (type === 'plastic') {
      // Plastic recycling prevents ~1.50 kg CO2 per kg
      const weight = parseFloat(kg || 1);
      saved = parseFloat((weight * 1.50).toFixed(2));
      emitted = 0;
    } 
    
    else if (type === 'food') {
      // Composting / reducing food waste prevents ~2.50 kg CO2 per kg
      const weight = parseFloat(kg || 1);
      saved = parseFloat((weight * 2.50).toFixed(2));
      emitted = 0;
    } 
    
    else if (type === 'water') {
      // Saving hot water (e.g. shorter showers) saves energy.
      // Approx 0.001 kg CO2 saved per liter of hot water prevented.
      const waterVolume = parseFloat(liters || 10);
      saved = parseFloat((waterVolume * 0.001).toFixed(2));
      emitted = 0;
    }

    emitted = parseFloat(emitted.toFixed(2));
    saved = parseFloat(saved.toFixed(2));

    // Save activity
    await supabase
      .from('activities')
      .insert([{
        user_id: userId,
        activity_type: type,
        details: { ...details, emitted, saved },
        co2_saved: saved,
        co2_emitted: emitted
      }]);

    // Update user's aggregate ledger
    if (saved > 0 || emitted > 0) {
      const { data: userRecord } = await supabase
        .from('users')
        .select('carbon_saved')
        .eq('id', userId)
        .single();
        
      const newTotal = parseFloat(userRecord.carbon_saved || 0) + saved - emitted;
      await supabase
        .from('users')
        .update({ carbon_saved: parseFloat(newTotal.toFixed(2)) })
        .eq('id', userId);
    }

    res.status(201).json({
      message: 'Emission logged successfully',
      co2Emitted: emitted,
      co2Saved: saved
    });

  } catch (err) {
    console.error('Error logging activity:', err);
    res.status(500).json({ message: 'Server error processing carbon calculation' });
  }
});

// Get user history
router.get('/history', authenticateToken, async (req, res) => {
  const supabase = getSupabase();
  try {
    const { data: list } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    res.json(list || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error retrieving history' });
  }
});

// Clear history
router.delete('/clear', authenticateToken, async (req, res) => {
  const supabase = getSupabase();
  try {
    await supabase
      .from('activities')
      .delete()
      .eq('user_id', req.user.id);

    await supabase
      .from('users')
      .update({ carbon_saved: 0 })
      .eq('id', req.user.id);

    res.json({ message: 'History cleared successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error clearing history' });
  }
});

// Search Climatiq Emission Factors
router.get('/climatiq/search', authenticateToken, async (req, res) => {
  const query = req.query.query || '';
  const category = req.query.category || '';
  const region = req.query.region || '';

  if (!CLIMATIQ_API_KEY || CLIMATIQ_API_KEY === 'your_climatiq_api_token') {
    return res.status(400).json({ message: 'Climatiq API Key is not configured on the server.' });
  }

  try {
    const searchParams = new URLSearchParams({
      data_version: '^3'
    });
    if (query) searchParams.append('query', query);
    if (category) searchParams.append('category', category);
    if (region) searchParams.append('region', region);

    const response = await fetch(`https://api.climatiq.io/data/v1/search?${searchParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${CLIMATIQ_API_KEY}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      const errorText = await response.text();
      res.status(response.status).json({ message: errorText });
    }
  } catch (err) {
    console.error('Error querying Climatiq Search API:', err);
    res.status(500).json({ message: 'Server error querying Climatiq Search API' });
  }
});

export default router;
