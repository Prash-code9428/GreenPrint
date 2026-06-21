import React, { useState, useEffect } from 'react';
import { Award, RefreshCw, Trophy, ShieldAlert, Sparkles } from 'lucide-react';
import { API_BASE } from '../config';

const Leaderboard = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/leaderboard`);
      const data = await res.json();
      if (res.ok) {
        setRankings(data);
      }
    } catch (err) {
      console.error('Error fetching leaderboard rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="title-gradient" style={{ fontSize: '2.5rem' }}>Prevention Leaderboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Advocates ranked by the total volume of carbon emissions prevented.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchRankings}>
          <RefreshCw size={16} /> Sync Rankings
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <RefreshCw className="pulse-circle" size={24} color="var(--accent-cyan)" />
          <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>Retrieving rankings...</p>
        </div>
      ) : (
        <div className="glass-panel">
          {rankings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <ShieldAlert size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
              <p>No logged activities found in the network yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {rankings.map((userRecord, index) => {
                const city = userRecord.profile_details?.city || 'Global Advocate';
                const vehicle = userRecord.profile_details?.vehicleType || 'None';
                
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: index === 0 ? '4px solid #F59E0B' : index === 1 ? '4px solid #94A3B8' : index === 2 ? '4px solid #B45309' : '1px solid var(--border-color)',
                      transition: 'transform 0.2s',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {/* Badge / Rank Index */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: index === 0 ? 'rgba(245,158,11,0.15)' : index === 1 ? 'rgba(148,163,184,0.15)' : index === 2 ? 'rgba(180,83,9,0.15)' : 'rgba(255,255,255,0.03)',
                        color: index === 0 ? '#F59E0B' : index === 1 ? '#94A3B8' : index === 2 ? '#B45309' : 'var(--text-muted)',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}>
                        {index === 0 ? <Trophy size={16} /> : index + 1}
                      </div>

                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {userRecord.name}
                          {index === 0 && <span style={{ fontSize: '0.7rem', background: 'rgba(245,158,11,0.1)', color: '#F59E0B', padding: '1px 6px', borderRadius: '4px' }}>Champion</span>}
                        </h4>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          <span>Location: {city}</span>
                          <span>|</span>
                          <span style={{ textTransform: 'capitalize' }}>Transit: {vehicle}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textRight: 'right' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-green)' }}>
                        {parseFloat(userRecord.carbon_saved || 0).toFixed(1)}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '4px', fontWeight: 500 }}>kg CO₂ Saved</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
