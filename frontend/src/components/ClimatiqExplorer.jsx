import React, { useState, useEffect } from 'react';
import { Search, Globe, HelpCircle, ShieldAlert, RefreshCw, Smartphone, Trees, Fuel, Award, Compass, Zap } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { API_BASE } from '../config';

const ClimatiqExplorer = ({ token }) => {
  // Database search states
  const [query, setQuery] = useState('grid mix');
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Simulator states
  const [simFactor, setSimFactor] = useState('grid_in');
  const [simValue, setSimValue] = useState(100);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'fuel', label: 'Fuel' },
    { value: 'transport', label: 'Transport' },
    { value: 'waste', label: 'Waste' },
    { value: 'water', label: 'Water' },
    { value: 'materials', label: 'Materials' }
  ];

  const regions = [
    { value: '', label: 'All Regions' },
    { value: 'US', label: 'United States (US)' },
    { value: 'GB', label: 'United Kingdom (GB)' },
    { value: 'CA', label: 'Canada (CA)' },
    { value: 'IN', label: 'India (IN)' },
    { value: 'DE', label: 'Germany (DE)' },
    { value: 'FR', label: 'France (FR)' },
    { value: 'AU', label: 'Australia (AU)' }
  ];

  // Benchmark stats for charts
  const gridBenchmarks = [
    { country: 'France (FR)', intensity: 0.05, desc: 'Nuclear & Hydro dominant', color: '#0F766E' },
    { country: 'Germany (DE)', intensity: 0.35, desc: 'Mixed Renewables & Gas', color: '#10B981' },
    { country: 'United States (US)', intensity: 0.37, desc: 'Gas, Coal & Renewables', color: '#3B82F6' },
    { country: 'India (IN)', intensity: 0.82, desc: 'High Coal dependency', color: '#BE123C' }
  ];

  const travelBenchmarks = [
    { mode: 'Metro/Subway', intensity: 0.04, desc: 'Electric rail transit', color: '#0F766E' },
    { mode: 'Electric EV', intensity: 0.06, desc: 'Battery electric car', color: '#10B981' },
    { mode: 'Short-haul Flight', intensity: 0.15, desc: 'Economy aviation route', color: '#F59E0B' },
    { mode: 'Petrol Sedan', intensity: 0.18, desc: 'Unleaded fuel car', color: '#BE123C' }
  ];

  // Simulator preset factors details
  const simulatorPresets = {
    grid_in: { name: 'Indian Electricity Grid Mix', intensity: 0.82, unit: 'kWh', type: 'energy' },
    grid_us: { name: 'United States Grid Mix', intensity: 0.37, unit: 'kWh', type: 'energy' },
    grid_fr: { name: 'French Grid Mix (Clean Grid)', intensity: 0.05, unit: 'kWh', type: 'energy' },
    flight_short: { name: 'Economy Short-haul Flight', intensity: 0.15, unit: 'passenger-km', type: 'distance' },
    car_petrol: { name: 'Petrol Passenger Sedan', intensity: 0.18, unit: 'km', type: 'distance' },
    car_electric: { name: 'Electric EV (Grid average)', intensity: 0.06, unit: 'km', type: 'distance' },
    transit_subway: { name: 'Metro Subway Transit', intensity: 0.04, unit: 'passenger-km', type: 'distance' }
  };

  const currentPreset = simulatorPresets[simFactor];
  const simEmitted = parseFloat((currentPreset.intensity * simValue).toFixed(2));
  
  // Real world equivalents calculations
  const treeEquiv = parseFloat((simEmitted / 22).toFixed(1)); // 1 tree absorbs ~22kg CO2/year
  const phoneEquiv = Math.round(simEmitted / 0.008); // 1 charge is ~0.008kg CO2
  const gasolineEquiv = parseFloat((simEmitted / 8.887).toFixed(1)); // 1 gallon is ~8.887kg CO2

  const fetchFactors = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (category) params.append('category', category);
      if (region) params.append('region', region);

      const res = await fetch(`${API_BASE}/api/activities/climatiq/search?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data.results || []);
      } else {
        setError(data.message || 'Failed to fetch emission factors.');
      }
    } catch (err) {
      console.error('Error fetching Climatiq data:', err);
      setError('Connection to server failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactors();
  }, [category, region, token]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFactors();
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="title-gradient" style={{ fontSize: '2.6rem', marginBottom: '12px' }}>Climatiq Analytics Hub</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
          Demystifying carbon auditing through interactive analytics, live simulators, and audited factors directly sourced from the Climatiq API.
        </p>
      </div>

      {!token ? (
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '40px 20px' }}>
          <ShieldAlert size={48} color="var(--accent-red)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Please sign in to unlock direct queries to the live Climatiq Carbon Auditing database.
          </p>
        </div>
      ) : (
        <>
          {/* SECTION 1: VISUAL COMPARATIVE ANALYTICS */}
          <div className="grid-2" style={{ marginBottom: '30px' }}>
            {/* Grid Mix Benchmark Chart */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} /> Global Grid Electricity Benchmarks
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '20px' }}>
                  Carbon intensity comparison of electricity grids (kg CO₂e per kWh). Sources audited by Climatiq.
                </p>
                <div style={{ height: '180px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gridBenchmarks} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="country" type="category" tick={{ fill: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600 }} width={120} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(value) => [`${value} kg CO₂e / kWh`, 'Carbon Intensity']} contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }} />
                      <Bar dataKey="intensity" radius={[0, 4, 4, 0]} barSize={16}>
                        {gridBenchmarks.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                💡 France's heavy nuclear/hydro base makes its electricity <strong>16x cleaner</strong> than India's coal-dependent power grid.
              </div>
            </div>

            {/* Travel Mode Benchmark Chart */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Compass size={18} /> Transit Carbon Intensities
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '20px' }}>
                  Emissions comparisons per passenger-kilometer (kg CO₂e per km).
                </p>
                <div style={{ height: '180px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={travelBenchmarks} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="mode" type="category" tick={{ fill: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600 }} width={120} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(value) => [`${value} kg CO₂e / km`, 'Carbon Intensity']} contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }} />
                      <Bar dataKey="intensity" radius={[0, 4, 4, 0]} barSize={16}>
                        {travelBenchmarks.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                💡 Commuting via Subway/Metro instead of a Petrol car reduces transit emissions by <strong>over 77%</strong>.
              </div>
            </div>
          </div>

          {/* SECTION 2: INTERACTIVE FOOTPRINT SIMULATOR */}
          <div className="glass-panel" style={{ marginBottom: '30px', borderLeft: '4px solid var(--accent-cyan)' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '6px', color: 'var(--accent-cyan)' }}>
              Real-World Impact Simulator
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
              Select a carbon emission factor below and adjust the scale. Instantly visualize the emissions footprint in relatable equivalents.
            </p>

            <div className="grid-2" style={{ gap: '30px' }}>
              {/* Controls */}
              <div>
                <div className="form-group">
                  <label className="form-label">Choose Emission Activity</label>
                  <select
                    className="form-select"
                    value={simFactor}
                    onChange={(e) => {
                      setSimFactor(e.target.value);
                      // Set logical defaults based on type
                      const type = simulatorPresets[e.target.value].type;
                      setSimValue(type === 'energy' ? 100 : 200);
                    }}
                  >
                    <option value="grid_in">⚡ India Grid Electricity (0.82 kg/kWh)</option>
                    <option value="grid_us">⚡ United States Grid Electricity (0.37 kg/kWh)</option>
                    <option value="grid_fr">⚡ France Grid Electricity (0.05 kg/kWh)</option>
                    <option value="flight_short">✈️ economy Short-haul Flight (0.15 kg/km)</option>
                    <option value="car_petrol">🚗 Petrol Passenger Sedan (0.18 kg/km)</option>
                    <option value="car_electric">🚗 Electric EV (Grid average) (0.06 kg/km)</option>
                    <option value="transit_subway">🚇 Subway / Metro Transit (0.04 kg/km)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label className="form-label">
                    Scale Quantity: <strong style={{ color: 'var(--accent-cyan)' }}>{simValue} {currentPreset.unit}</strong>
                  </label>
                  <input
                    type="range"
                    min={currentPreset.type === 'energy' ? 10 : 50}
                    max={currentPreset.type === 'energy' ? 1500 : 5000}
                    step={currentPreset.type === 'energy' ? 10 : 50}
                    value={simValue}
                    onChange={(e) => setSimValue(parseInt(e.target.value))}
                    className="form-input"
                    style={{ padding: 0 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{currentPreset.type === 'energy' ? '10 kWh' : '50 km'}</span>
                    <span>{currentPreset.type === 'energy' ? '1,500 kWh' : '5,000 km'}</span>
                  </div>
                </div>
              </div>

              {/* Outputs */}
              <div style={{ background: 'rgba(15, 118, 110, 0.03)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(15, 118, 110, 0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Simulated Emissions Footprint</span>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {simEmitted.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 600 }}>kg CO₂e</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '16px' }}>
                  {/* Tree equivalent */}
                  <div style={{ textAlign: 'center', background: '#fff', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <Trees size={22} color="#10B981" style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10B981' }}>{treeEquiv}</div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', lineHeight: 1.2 }}>Yearly Tree Offsets</span>
                  </div>
                  {/* Phone charging equivalent */}
                  <div style={{ textAlign: 'center', background: '#fff', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <Smartphone size={22} color="#3B82F6" style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3B82F6' }}>{phoneEquiv.toLocaleString()}</div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', lineHeight: 1.2 }}>Phones Charged</span>
                  </div>
                  {/* Gasoline equivalent */}
                  <div style={{ textAlign: 'center', background: '#fff', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <Fuel size={22} color="#BE123C" style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#BE123C' }}>{gasolineEquiv}</div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block', lineHeight: 1.2 }}>Gals of Gasoline</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: CLIMATIQ FACTOR REGISTRY */}
          <div className="glass-panel" style={{ borderTop: '2px solid var(--accent-green)' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '6px', color: 'var(--accent-green)' }}>
              Deep-Dive Audited Factors Registry
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '24px' }}>
              Search the Climatiq database to find exact audit coefficient factors for specific activities.
            </p>

            <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '16px', alignItems: 'end', marginBottom: '24px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Search Query</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. passenger vehicle, grid mix..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                  <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Region</label>
                <select className="form-select" value={region} onChange={(e) => setRegion(e.target.value)}>
                  {regions.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: '46px', padding: '0 24px' }}>
                Search
              </button>
            </form>

            {loading && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <RefreshCw className="pulse-circle" size={32} color="var(--accent-green)" />
                <p style={{ marginTop: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Querying Climatiq Registry...</p>
              </div>
            )}

            {error && (
              <div style={{ borderLeft: '4px solid var(--accent-red)', padding: '12px', marginBottom: '24px', background: 'rgba(190, 18, 60, 0.02)', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ color: 'var(--accent-red)', marginBottom: '4px', fontSize: '0.9rem' }}>API Configuration Info</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{error}</p>
              </div>
            )}

            {!loading && !error && results.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(0,0,0,0.01)', borderRadius: 'var(--radius-sm)' }}>
                <HelpCircle size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                <h4 style={{ marginBottom: '4px' }}>No factors matched your query</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Try broadening your search terms or selecting a different category/region.</p>
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Showing {results.length} active emission factors
                  </span>
                </div>

                <div className="grid-2" style={{ gap: '16px' }}>
                  {results.map((factor) => (
                    <div key={factor.id} style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                          <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-green)', fontWeight: 700, lineHeight: 1.3 }}>
                            {factor.name}
                          </h4>
                          <span style={{
                            fontSize: '0.7rem',
                            background: factor.region === 'Global' ? 'rgba(6,95,70,0.08)' : 'rgba(15,118,110,0.08)',
                            color: factor.region === 'Global' ? 'var(--accent-green)' : 'var(--accent-cyan)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {factor.region}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                          {factor.description || 'No description provided.'}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.03)', padding: '2px 4px', borderRadius: '3px' }}>
                            <strong>Category:</strong> {factor.category}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.03)', padding: '2px 4px', borderRadius: '3px' }}>
                            <strong>Source:</strong> {factor.source} ({factor.year})
                          </span>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.02)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Allowed Units:</span>
                        <strong style={{ color: 'var(--accent-green)' }}>
                          {Array.isArray(factor.unit_type)
                            ? factor.unit_type.join(', ')
                            : (typeof factor.unit_type === 'string' ? factor.unit_type : 'N/A')}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ClimatiqExplorer;
