import React, { useState, useEffect } from 'react';
import { Plane, Navigation, Zap, HelpCircle, ShieldAlert, CheckCircle2, RefreshCw, Trash2, ShieldCheck, Heart } from 'lucide-react';
import { API_BASE } from '../config';

const SavingsCalculator = ({ user, token, onActivityLogged }) => {
  const [activeCategory, setActiveCategory] = useState('travel');
  const [activeSubOption, setActiveSubOption] = useState('flight');

  // Input states
  const [distance, setDistance] = useState(100);
  const [passengers, setPassengers] = useState(1);
  const [fuelType, setFuelType] = useState('petrol');
  const [transitType, setTransitType] = useState('metro');
  
  const [hours, setHours] = useState(4);
  const [count, setCount] = useState(5);
  const [kwh, setKwh] = useState(20);

  const [kg, setKg] = useState(5);
  const [liters, setLiters] = useState(40);
  const [isActionPrevented, setIsActionPrevented] = useState(false);

  // Projections preview
  const [emittedPrev, setEmittedPrev] = useState(0);
  const [savedPrev, setSavedPrev] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Math previews
  useEffect(() => {
    let rawEmitted = 0;
    let rawSaved = 0;

    if (activeCategory === 'travel') {
      const dist = parseFloat(distance) || 0;
      if (activeSubOption === 'flight') {
        const pass = parseInt(passengers || 1);
        rawEmitted = dist * 0.15 * pass;
        if (isActionPrevented) {
          rawSaved = rawEmitted;
          rawEmitted = 0;
        }
      } else if (activeSubOption === 'vehicle') {
        let factor = 0.18;
        if (fuelType === 'diesel') factor = 0.16;
        if (fuelType === 'hybrid') factor = 0.10;
        if (fuelType === 'electric') factor = 0.06;
        rawEmitted = dist * factor;

        const petrolBaseline = dist * 0.18;
        if (isActionPrevented) {
          rawSaved = petrolBaseline;
          rawEmitted = 0;
        } else {
          rawSaved = Math.max(0, petrolBaseline - rawEmitted);
        }
      } else if (activeSubOption === 'transit') {
        const factor = transitType === 'bus' ? 0.08 : 0.06;
        rawEmitted = dist * factor;
        const petrolBaseline = dist * 0.18;
        // Saved is the offset against driving alone in petrol car
        rawSaved = Math.max(0, petrolBaseline - rawEmitted);
      }
    } 
    
    else if (activeCategory === 'energy') {
      if (activeSubOption === 'ac') {
        const acKwh = parseFloat(hours) * 1.5;
        rawSaved = acKwh * 0.85;
        rawEmitted = 0;
      } else if (activeSubOption === 'led') {
        const bulbCount = parseFloat(count) || 1;
        rawSaved = bulbCount * 0.22;
        rawEmitted = 0;
      } else if (activeSubOption === 'appliance') {
        const appCount = parseFloat(count) || 1;
        rawSaved = appCount * 0.80;
        rawEmitted = 0;
      } else if (activeSubOption === 'electricity') {
        const electricityKwh = parseFloat(kwh) || 0;
        rawSaved = electricityKwh * 0.85;
        rawEmitted = 0;
      }
    } 
    
    else if (activeCategory === 'lifestyle') {
      if (activeSubOption === 'plastic') {
        const weight = parseFloat(kg) || 0;
        rawSaved = weight * 1.50;
        rawEmitted = 0;
      } else if (activeSubOption === 'food') {
        const weight = parseFloat(kg) || 0;
        rawSaved = weight * 2.50;
        rawEmitted = 0;
      } else if (activeSubOption === 'water') {
        const waterVolume = parseFloat(liters) || 0;
        rawSaved = waterVolume * 0.001;
        rawEmitted = 0;
      }
    }

    setEmittedPrev(parseFloat(rawEmitted.toFixed(2)));
    setSavedPrev(parseFloat(rawSaved.toFixed(2)));
  }, [
    activeCategory, activeSubOption, distance, passengers, fuelType, transitType,
    hours, count, kwh, kg, liters, isActionPrevented
  ]);

  const handleSubOptionSwitch = (cat, sub) => {
    setActiveCategory(cat);
    setActiveSubOption(sub);
    setIsActionPrevented(false);
    setSuccess('');
    
    // Reset defaults based on selection
    if (sub === 'flight') setDistance(500);
    else if (sub === 'vehicle') setDistance(50);
    else if (sub === 'transit') setDistance(15);
    else if (sub === 'ac') setHours(4);
    else if (sub === 'led') setCount(5);
    else if (sub === 'appliance') setCount(1);
    else if (sub === 'electricity') setKwh(20);
    else if (sub === 'plastic' || sub === 'food') setKg(5);
    else if (sub === 'water') setLiters(40);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to log your carbon prevention score.');
      return;
    }

    setLoading(true);
    setSuccess('');

    const payload = {
      type: activeSubOption,
      isActionPrevented,
      distance: (activeSubOption === 'flight' || activeSubOption === 'vehicle' || activeSubOption === 'transit') ? parseFloat(distance) : undefined,
      passengers: activeSubOption === 'flight' ? parseInt(passengers) : undefined,
      fuelType: activeSubOption === 'vehicle' ? fuelType : undefined,
      transitType: activeSubOption === 'transit' ? transitType : undefined,
      hours: activeSubOption === 'ac' ? parseFloat(hours) : undefined,
      count: (activeSubOption === 'led' || activeSubOption === 'appliance') ? parseFloat(count) : undefined,
      kwh: activeSubOption === 'electricity' ? parseFloat(kwh) : undefined,
      kg: (activeSubOption === 'plastic' || activeSubOption === 'food') ? parseFloat(kg) : undefined,
      liters: activeSubOption === 'water' ? parseFloat(liters) : undefined
    };

    try {
      const res = await fetch(`${API_BASE}/api/activities/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(`Activity saved successfully! Carbon Saved: ${data.co2Saved} kg.`);
        if (onActivityLogged) {
          onActivityLogged();
        }
        setTimeout(() => setSuccess(''), 4500);
      } else {
        alert(data.message || 'Error processing request');
      }
    } catch (err) {
      console.error('Error logging details:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Emissions Prevention Calculator</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
          Compute prevented emissions across transit choices, home energy upgrades, and lifestyle water or packaging preventions.
        </p>
      </div>

      {/* Main Categories Navigation Bar */}
      <div style={{ display: 'flex', gap: '8px', background: 'rgba(6,95,70,0.05)', padding: '6px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
        <button
          className={`btn ${activeCategory === 'travel' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleSubOptionSwitch('travel', 'flight')}
          style={{ flex: 1, border: 'none', padding: '8px 12px', fontSize: '0.85rem' }}
        >
          Travel & Transit
        </button>
        <button
          className={`btn ${activeCategory === 'energy' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleSubOptionSwitch('energy', 'ac')}
          style={{ flex: 1, border: 'none', padding: '8px 12px', fontSize: '0.85rem' }}
        >
          Home Energy
        </button>
        <button
          className={`btn ${activeCategory === 'lifestyle' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleSubOptionSwitch('lifestyle', 'plastic')}
          style={{ flex: 1, border: 'none', padding: '8px 12px', fontSize: '0.85rem' }}
        >
          Lifestyle Prevention
        </button>
      </div>

      {/* Suboptions select row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {activeCategory === 'travel' && (
          <>
            <button className={`btn btn-sm ${activeSubOption === 'flight' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleSubOptionSwitch('travel', 'flight')} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Flight</button>
            <button className={`btn btn-sm ${activeSubOption === 'vehicle' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleSubOptionSwitch('travel', 'vehicle')} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Personal Vehicle</button>
            <button className={`btn btn-sm ${activeSubOption === 'transit' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleSubOptionSwitch('travel', 'transit')} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Public Transit Swap</button>
          </>
        )}
        {activeCategory === 'energy' && (
          <>
            <button className={`btn btn-sm ${activeSubOption === 'ac' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleSubOptionSwitch('energy', 'ac')} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>AC runtime</button>
            <button className={`btn btn-sm ${activeSubOption === 'led' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleSubOptionSwitch('energy', 'led')} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>LED Bulbs</button>
            <button className={`btn btn-sm ${activeSubOption === 'appliance' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleSubOptionSwitch('energy', 'appliance')} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Appliances</button>
            <button className={`btn btn-sm ${activeSubOption === 'electricity' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleSubOptionSwitch('energy', 'electricity')} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Grid kWh</button>
          </>
        )}
        {activeCategory === 'lifestyle' && (
          <>
            <button className={`btn btn-sm ${activeSubOption === 'plastic' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleSubOptionSwitch('lifestyle', 'plastic')} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Plastics</button>
            <button className={`btn btn-sm ${activeSubOption === 'food' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleSubOptionSwitch('lifestyle', 'food')} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Food Composting</button>
            <button className={`btn btn-sm ${activeSubOption === 'water' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleSubOptionSwitch('lifestyle', 'water')} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Water Conservation</button>
          </>
        )}
      </div>

      <div className="grid-2">
        {/* Form parameters */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} /> Parameters Configuration
          </h3>

          <form onSubmit={handleSubmit}>
            {/* 1. Travel inputs */}
            {activeSubOption === 'flight' && (
              <>
                <div className="form-group">
                  <label className="form-label">Total Flight Distance: {distance} km</label>
                  <input
                    type="range" min="100" max="10000" step="100" className="form-input" style={{ padding: 0 }}
                    value={distance} onChange={(e) => setDistance(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Passengers Sourced</label>
                  <select className="form-select" value={passengers} onChange={(e) => setPassengers(e.target.value)}>
                    <option value={1}>1 Passenger</option>
                    <option value={2}>2 Passengers</option>
                    <option value={3}>3 Passengers</option>
                    <option value={4}>4 Passengers</option>
                  </select>
                </div>
              </>
            )}

            {activeSubOption === 'vehicle' && (
              <>
                <div className="form-group">
                  <label className="form-label">Travel Distance Sourced: {distance} km</label>
                  <input
                    type="range" min="5" max="400" step="5" className="form-input" style={{ padding: 0 }}
                    value={distance} onChange={(e) => setDistance(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Engine Fuel Sourced</label>
                  <select className="form-select" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                    <option value="petrol">Unleaded Petrol</option>
                    <option value="diesel">Diesel Fuel</option>
                    <option value="hybrid">Hybrid Engine</option>
                    <option value="electric">Electric vehicle (EV)</option>
                  </select>
                </div>
              </>
            )}

            {activeSubOption === 'transit' && (
              <>
                <div className="form-group">
                  <label className="form-label">Swapped Transit Distance: {distance} km</label>
                  <input
                    type="range" min="5" max="100" step="1" className="form-input" style={{ padding: 0 }}
                    value={distance} onChange={(e) => setDistance(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Public Transport Mode</label>
                  <select className="form-select" value={transitType} onChange={(e) => setTransitType(e.target.value)}>
                    <option value="metro">Metro/Subway rail system</option>
                    <option value="bus">Standard City Transit Bus</option>
                  </select>
                </div>
              </>
            )}

            {/* 2. Energy inputs */}
            {activeSubOption === 'ac' && (
              <div className="form-group">
                <label className="form-label">AC Reduction Hours: {hours} hours</label>
                <input
                  type="range" min="1" max="24" className="form-input" style={{ padding: 0 }}
                  value={hours} onChange={(e) => setHours(e.target.value)}
                />
              </div>
            )}

            {activeSubOption === 'led' && (
              <div className="form-group">
                <label className="form-label">LED Bulbs Upgraded: {count} bulbs</label>
                <input
                  type="range" min="1" max="30" className="form-input" style={{ padding: 0 }}
                  value={count} onChange={(e) => setCount(e.target.value)}
                />
              </div>
            )}

            {activeSubOption === 'appliance' && (
              <div className="form-group">
                <label className="form-label">Energy-Star Upgrades: {count} units</label>
                <input
                  type="range" min="1" max="10" className="form-input" style={{ padding: 0 }}
                  value={count} onChange={(e) => setCount(e.target.value)}
                />
              </div>
            )}

            {activeSubOption === 'electricity' && (
              <div className="form-group">
                <label className="form-label">Household Electric Preventions: {kwh} kWh</label>
                <input
                  type="range" min="1" max="300" className="form-input" style={{ padding: 0 }}
                  value={kwh} onChange={(e) => setKwh(e.target.value)}
                />
              </div>
            )}

            {/* 3. Lifestyle inputs */}
            {activeSubOption === 'plastic' && (
              <div className="form-group">
                <label className="form-label">Plastics Recycled: {kg} kg</label>
                <input
                  type="range" min="1" max="50" className="form-input" style={{ padding: 0 }}
                  value={kg} onChange={(e) => setKg(e.target.value)}
                />
              </div>
            )}

            {activeSubOption === 'food' && (
              <div className="form-group">
                <label className="form-label">Food Waste Composted: {kg} kg</label>
                <input
                  type="range" min="1" max="50" className="form-input" style={{ padding: 0 }}
                  value={kg} onChange={(e) => setKg(e.target.value)}
                />
              </div>
            )}

            {activeSubOption === 'water' && (
              <div className="form-group">
                <label className="form-label">Water Prevented (Shorter Shower): {liters} liters</label>
                <input
                  type="range" min="5" max="300" step="5" className="form-input" style={{ padding: 0 }}
                  value={liters} onChange={(e) => setLiters(e.target.value)}
                />
              </div>
            )}

            {/* Action prevention check trigger */}
            {(activeSubOption === 'flight' || activeSubOption === 'vehicle') && (
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.4)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', margin: '20px 0' }}>
                <input
                  type="checkbox" id="prevCheck" checked={isActionPrevented} onChange={(e) => setIsActionPrevented(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="prevCheck" style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                  Action Prevented (Swap / skipped action completely)
                </label>
              </div>
            )}

            {/* Force action swap context warning for transit swaps */}
            {activeSubOption === 'transit' && (
              <div className="form-group" style={{ background: 'var(--accent-green-glow)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 500 }}>
                ℹ️ Swapping driving for public transit saves carbon equivalent to: baseline petrol car emissions ({distance * 0.18} kg) minus public transit emissions ({distance * (transitType === 'bus' ? 0.08 : 0.06)} kg).
              </div>
            )}

            {success && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--accent-green-glow)', border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '12px', borderRadius: 'var(--radius-sm)', color: 'var(--accent-green)',
                marginBottom: '20px', fontSize: '0.85rem'
              }}>
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            {user ? (
              <button type="submit" className="btn btn-success" style={{ width: '100%', height: '46px' }} disabled={loading}>
                {loading ? <RefreshCw className="pulse-circle" size={16} /> : 'Log activity preventions'}
              </button>
            ) : (
              <div style={{
                background: 'rgba(190, 18, 60, 0.05)', border: '1px solid rgba(190, 18, 60, 0.15)',
                padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', gap: '10px'
              }}>
                <ShieldAlert size={20} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  You are in preview mode. To log this activity and climb the leaderboard, please sign in.
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Projections preview */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '3px solid var(--accent-cyan)' }}>
          <div>
            <h2 className="cyan-gradient" style={{ fontSize: '1.3rem', marginBottom: '6px' }}>Impact Previews</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '24px' }}>
              Carbon calculated dynamically for this log parameters.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '24px 0' }}>
              <div style={{ padding: '16px', background: 'rgba(190, 18, 60, 0.04)', border: '1px solid rgba(190, 18, 60, 0.1)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>CO₂ Emitted</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-red)', marginTop: '6px' }}>{emittedPrev} kg</div>
              </div>

              <div style={{ padding: '16px', background: 'var(--accent-green-glow)', border: '1px solid rgba(6, 95, 70, 0.15)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>CO₂ Saved</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-green)', marginTop: '6px' }}>{savedPrev} kg</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 118, 110, 0.05)', border: '1px solid rgba(15, 118, 110, 0.12)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HelpCircle size={15} /> Climatiq API Sourced
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Calculations are queried via Climatiq endpoints using live factors, ensuring international auditing compliance. Green commuters climbing the scoreboard prevent carbon from entering the grid.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculator;
