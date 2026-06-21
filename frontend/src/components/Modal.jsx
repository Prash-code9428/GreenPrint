import React from 'react';
import { X, HelpCircle, BookOpen, Lock, FileText } from 'lucide-react';

const Modal = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(5, 7, 13, 0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '650px',
        width: '100%',
        position: 'relative',
        animation: 'slideUp 0.25s ease-out',
        maxHeight: '85vh',
        overflowY: 'auto',
        background: '#FAF7F2', /* Matches warm theme background */
        border: '2px solid var(--accent-green)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20, right: 20,
            background: 'none', border: 'none',
            color: 'var(--accent-green)', cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Content */}
        {type === 'education' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={24} /> Climate Education Guidelines
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <div>
                <h4 style={{ fontWeight: 700, color: 'var(--accent-green)', marginBottom: '4px' }}>1. What is a Carbon Footprint?</h4>
                <p>A carbon footprint measures the total greenhouse gas emissions (including carbon dioxide and methane) emitted directly and indirectly by individual choices, manufacturing operations, or geopolitical events. It is standardized under carbon dioxide equivalents (CO₂e).</p>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: 'var(--accent-green)', marginBottom: '4px' }}>2. The Greenhouse blanket effect</h4>
                <p>Gases like CO₂ and methane trap heat radiating from the Earth's surface, acting like a greenhouse. Industrial activities, combustion transit, and deforestations have thickened this blanket, raising average global temperatures by 1.1°C since 1880.</p>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: 'var(--accent-green)', marginBottom: '4px' }}>3. Soil and Agricultural degradation</h4>
                <p>Ecosystem damages from artillery bombings and chemical runoffs destroy valuable soil biology. Contaminated farmlands lose their capability to retain nutrients and act as carbon sinks, accelerating global warming.</p>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: 'var(--accent-green)', marginBottom: '4px' }}>4. Sustainable Remediation Steps</h4>
                <p>Adopting active transport (cycling/walking), swapping private travel for electrified transits, reducing AC run-times, upgrading to LED bulbs, and composting food waste are critical to lowering cumulative footprints.</p>
              </div>
            </div>
          </div>
        )}

        {type === 'methodology' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={24} /> Carbon Estimation Methodology
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <p>GreenPrint utilizes a dual-mode calculation engine. When connected to a live environment, the calculator proxies parameters to the <strong>Climatiq API</strong> (an international carbon database). Otherwise, it applies offline local default coefficients.</p>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginTop: '10px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--accent-green)', textAlign: 'left' }}>
                    <th style={{ padding: '8px 0' }}>Activity Category</th>
                    <th style={{ padding: '8px 0' }}>Emission Factor Sourced</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0', fontWeight: 600 }}>Commercial Flights</td>
                    <td style={{ padding: '8px 0' }}>0.15 kg CO₂ per kilometer per passenger</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0', fontWeight: 600 }}>Petrol Vehicle</td>
                    <td style={{ padding: '8px 0' }}>0.18 kg CO₂ per driven kilometer</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0', fontWeight: 600 }}>Electric Vehicle (EV)</td>
                    <td style={{ padding: '8px 0' }}>0.06 kg CO₂ per driven kilometer (grid blend)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0', fontWeight: 600 }}>Air Conditioner (AC)</td>
                    <td style={{ padding: '8px 0' }}>1.20 kg CO₂ per active operational hour</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0', fontWeight: 600 }}>Grid Electricity</td>
                    <td style={{ padding: '8px 0' }}>0.85 kg CO₂ per consumed kWh</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0', fontWeight: 600 }}>Food Composting</td>
                    <td style={{ padding: '8px 0' }}>Prevents 2.50 kg CO₂ equivalent per kg</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0', fontWeight: 600 }}>Plastic Recycled</td>
                    <td style={{ padding: '8px 0' }}>Prevents 1.50 kg CO₂ equivalent per kg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {type === 'privacy' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={24} /> Platform Privacy Policy
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <p>GreenPrint values your data privacy. Below is an overview of how your information is securely managed:</p>
              <ul>
                <li style={{ marginBottom: '8px' }}><strong>Hashed Credentials:</strong> Your passwords and security recovery answers are hashed using the industry-standard `bcryptjs` algorithm prior to database storage. We never store plain-text secrets.</li>
                <li style={{ marginBottom: '8px' }}><strong>Supabase Security:</strong> All user records, prevented carbon metrics, and profile details reside in a secure Postgres database instance hosted on Supabase. We utilize standard SSL connections.</li>
                <li style={{ marginBottom: '8px' }}><strong>Local Fallback Engine:</strong> In mock mode, your details persist locally on your computer inside a private JSON file database (`data/db_store/`), and are never shared or sent to any external server.</li>
              </ul>
            </div>
          </div>
        )}

        {type === 'terms' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={24} /> Terms and Conditions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <p>Welcome to GreenPrint. By utilizing this platform, you agree to comply with and be bound by the following Terms and Conditions:</p>
              <ul>
                <li style={{ marginBottom: '8px' }}><strong>Educational Estimates:</strong> All carbon output figures, comparisons, and offsets displayed on the platform are simulated estimates. They are sourced using a combination of the Climatiq API database and local math coefficients and should not be used as audited legal or corporate carbon accounts.</li>
                <li style={{ marginBottom: '8px' }}><strong>Leaderboard and Fair Use:</strong> Advocate scores on the leaderboard represent the net difference between your logged carbon preventions and logged carbon emissions. Fabricating or spamming false logs is discouraged to preserve community integrity.</li>
                <li style={{ marginBottom: '8px' }}><strong>Account Security:</strong> You are solely responsible for protecting your account credentials. Passwords and security answers are stored securely via bcrypt encryption, but you must ensure you utilize a unique password.</li>
                <li style={{ marginBottom: '8px' }}><strong>Third-Party Integrations:</strong> Grid mix metrics and transit estimates query the Climatiq API. GreenPrint is not liable for service downtime, calculation discrepancies, or changes made by external API providers.</li>
              </ul>
            </div>
          </div>
        )}

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
