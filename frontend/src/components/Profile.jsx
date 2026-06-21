import React, { useState, useEffect } from 'react';
import { User, Check, RefreshCw, MapPin, Navigation, Plane, ShieldAlert, Car, Truck, Bike, Zap, HelpCircle, Apple, Trash2, KeyRound } from 'lucide-react';
import { API_BASE } from '../config';

const Profile = ({ user, token, onProfileUpdated }) => {
  const securityQuestionsList = [
    'What is the name of your first pet?',
    'What was the model of your first car?',
    'In what city were you born?',
    'What is the name of your childhood best friend?'
  ];

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    vehicleType: 'petrol',
    hasAC: 'yes',
    averageACUsage: 4,
    yearlyFlights: 2,
    diet: 'vegetarian',
    renewableEnergy: 0,
    weeklyWaste: 3,
    securityQuestion: 'What is the name of your first pet?',
    securityAnswer: ''
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync state with user prop
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        city: user.profile_details?.city || '',
        vehicleType: user.profile_details?.vehicleType || 'petrol',
        hasAC: user.profile_details?.hasAC || 'yes',
        averageACUsage: user.profile_details?.averageACUsage || 4,
        yearlyFlights: user.profile_details?.yearlyFlights || 2,
        diet: user.profile_details?.diet || 'vegetarian',
        renewableEnergy: user.profile_details?.renewableEnergy || 0,
        weeklyWaste: user.profile_details?.weeklyWaste || 3,
        securityQuestion: user.securityQuestion || 'What is the name of your first pet?',
        securityAnswer: ''
      });
    }
  }, [user]);

  if (!token) {
    return (
      <div style={{ animation: 'fadeIn 0.5s ease-out', textAlign: 'center', padding: '60px 20px' }}>
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <ShieldAlert size={48} color="var(--accent-red)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Profile Locked</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
            Please sign in or create an account to view and update your personal climate profile details.
          </p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const payload = {
      name: formData.name,
      profileDetails: {
        city: formData.city,
        vehicleType: formData.vehicleType,
        hasAC: formData.hasAC,
        averageACUsage: parseFloat(formData.averageACUsage),
        yearlyFlights: parseInt(formData.yearlyFlights),
        diet: formData.diet,
        renewableEnergy: parseInt(formData.renewableEnergy),
        weeklyWaste: parseInt(formData.weeklyWaste)
      },
      securityQuestion: formData.securityQuestion,
      securityAnswer: formData.securityAnswer ? formData.securityAnswer : undefined
    };

    try {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        if (onProfileUpdated) {
          onProfileUpdated(data.user);
        }
        setFormData(prev => ({ ...prev, securityAnswer: '' }));
      } else {
        alert(data.message || 'Profile update failed');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Advocate Profile</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
          Calibrate baseline metrics, review your carbon indicators, and manage security settings.
        </p>
      </div>

      <div className="grid-2">
        {/* Profile Card & Stats */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'space-between', borderLeft: '3px solid var(--accent-green)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'var(--accent-green-glow)', color: 'var(--accent-green)',
                display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center'
              }}>
                <User size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem' }}>{formData.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered Climate Advocate</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '20px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.85rem' }}>Location: <strong style={{ color: 'var(--text-primary)' }}>{formData.city || 'Not Specified'}</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Navigation size={16} color="var(--accent-green)" />
                <span style={{ fontSize: '0.85rem' }}>Regular Transit Mode: <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{formData.vehicleType} vehicle</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plane size={16} color="#8B5CF6" />
                <span style={{ fontSize: '0.85rem' }}>Annual Flight Count: <strong style={{ color: 'var(--text-primary)' }}>{formData.yearlyFlights} flights / year</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Apple size={16} color="#F59E0B" />
                <span style={{ fontSize: '0.85rem' }}>Dietary Footprint: <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{formData.diet}</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={16} color="#10B981" />
                <span style={{ fontSize: '0.85rem' }}>Renewable Energy Share: <strong style={{ color: 'var(--text-primary)' }}>{formData.renewableEnergy}%</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Trash2 size={16} color="var(--accent-red)" />
                <span style={{ fontSize: '0.85rem' }}>Weekly Trash Volume: <strong style={{ color: 'var(--text-primary)' }}>{formData.weeklyWaste} bags / week</strong></span>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center', marginTop: '20px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Cumulative Net Prevented Carbon</span>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', marginTop: '8px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-green)' }}>{parseFloat(user?.carbon_saved || 0).toFixed(1)}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginLeft: '6px', fontWeight: 600 }}>kg CO₂</span>
            </div>
          </div>
        </div>

        {/* Editing form */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Complete Account Details
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text" name="name" className="form-input"
                value={formData.name} onChange={handleInputChange} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location (City)</label>
              <input
                type="text" name="city" className="form-input" placeholder="e.g. Seattle"
                value={formData.city} onChange={handleInputChange} required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '12px' }}>Primary Transit Vehicle</label>
              <div className="profile-vehicle-grid">
                {[
                  { value: 'petrol', label: 'Petrol Sedan', icon: Car, desc: 'Unleaded petrol vehicle' },
                  { value: 'diesel', label: 'Diesel SUV', icon: Truck, desc: 'Heavier diesel vehicle' },
                  { value: 'electric', label: 'Electric EV', icon: Zap, desc: 'Eco-friendly battery EV' },
                  { value: 'none', label: 'Eco Commute', icon: Bike, desc: 'Bicycle, walk, or transit' }
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = formData.vehicleType === opt.value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => setFormData({ ...formData, vehicleType: opt.value })}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '2px solid var(--accent-green)' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(6, 95, 70, 0.05)' : 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: '6px'
                      }}
                    >
                      <Icon size={20} color={isSelected ? 'var(--accent-green)' : 'var(--text-secondary)'} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? 'var(--accent-green)' : 'var(--text-primary)' }}>{opt.label}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{opt.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Dietary Carbon Preference</label>
              <select name="diet" className="form-select" value={formData.diet} onChange={handleInputChange}>
                <option value="plant-based">Plant-Based / Vegan (Low carbon)</option>
                <option value="vegetarian">Vegetarian (Moderate carbon)</option>
                <option value="low-meat">Flexitarian / Low-Meat (Medium carbon)</option>
                <option value="meat-heavy">Meat-Heavy (High carbon)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Renewable Energy percentage: {formData.renewableEnergy}%</label>
              <input
                type="range" min="0" max="100" step="5" name="renewableEnergy" className="form-input" style={{ padding: 0 }}
                value={formData.renewableEnergy} onChange={handleInputChange}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>0% (Grid Mix)</span>
                <span>100% (Clean Power)</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Weekly Trash Bags: {formData.weeklyWaste} bags</label>
              <input
                type="range" min="1" max="10" step="1" name="weeklyWaste" className="form-input" style={{ padding: 0 }}
                value={formData.weeklyWaste} onChange={handleInputChange}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>1 bag / week</span>
                <span>10 bags / week</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Yearly Flights: {formData.yearlyFlights} flights</label>
              <input
                type="range" min="0" max="25" step="1" name="yearlyFlights" className="form-input" style={{ padding: 0 }}
                value={formData.yearlyFlights} onChange={handleInputChange}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>0 flights</span>
                <span>25 flights</span>
              </div>
            </div>

            {/* SECURITY QUESTION CONFIGURATION */}
            <div style={{ borderTop: '1px solid var(--border-color)', margin: '24px 0 16px', paddingTop: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={16} /> Security Password Recovery Question
              </h3>
              
              <div className="form-group">
                <label className="form-label">Recovery Question</label>
                <select name="securityQuestion" className="form-select" value={formData.securityQuestion} onChange={handleInputChange}>
                  {securityQuestionsList.map((q, idx) => (
                    <option key={idx} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">New Recovery Answer (Leave blank to keep unchanged)</label>
                <input
                  type="text" name="securityAnswer" className="form-input" placeholder="Type new answer if you wish to update it"
                  value={formData.securityAnswer} onChange={handleInputChange}
                />
              </div>
            </div>

            {success && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--accent-green-glow)', border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '12px', borderRadius: 'var(--radius-sm)', color: 'var(--accent-green)',
                marginBottom: '20px', fontSize: '0.85rem'
              }}>
                <Check size={16} />
                <span>Account and security details saved successfully!</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '46px' }} disabled={loading}>
              {loading ? <RefreshCw className="pulse-circle" size={16} /> : 'Save Profile Details'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
