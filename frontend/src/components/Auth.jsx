import React, { useState, useEffect } from 'react';
import { X, LogIn, UserPlus, AlertCircle, Eye, EyeOff, KeyRound, HelpCircle, CheckCircle2, Car, Truck, Bike, Zap } from 'lucide-react';
import Modal from './Modal';

const Auth = ({ isOpen, onClose, onSuccess }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Modes: 'login', 'register', 'forgot'
  const [authMode, setAuthMode] = useState('login');
  
  // Password show/hide states
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    securityQuestion: 'What is the name of your first pet?',
    securityAnswer: '',
    // Recovery fields
    recoveryAnswer: '',
    newPassword: '',
    // Profile details JSON
    city: '',
    vehicleType: 'petrol',
    hasAC: 'yes'
  });

  const [recoveryQuestion, setRecoveryQuestion] = useState('');
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: get question, 2: answer and reset
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);

  if (!isOpen) return null;

  const securityQuestionsList = [
    'What is the name of your first pet?',
    'What was the model of your first car?',
    'In what city were you born?',
    'What is the name of your childhood best friend?'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccessMsg('');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    if (authMode === 'login') {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        
        onSuccess(data);
        onClose();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } 
    
    else if (authMode === 'register') {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer,
        profileDetails: {
          city: formData.city,
          vehicleType: formData.vehicleType,
          hasAC: formData.hasAC
        }
      };

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');

        onSuccess(data);
        onClose();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRecoveryStep1 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/forgot-password/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error fetching question');

      setRecoveryQuestion(data.securityQuestion);
      setRecoveryStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryStep2 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          securityAnswer: formData.recoveryAnswer,
          newPassword: formData.newPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');

      setSuccessMsg('Password reset successfully! You can login now.');
      setAuthMode('login');
      setRecoveryStep(1);
      setFormData(prev => ({ ...prev, password: '', newPassword: '', recoveryAnswer: '' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(6, 95, 70, 0.25)', /* Warm green backdrop tint */
      backdropFilter: 'blur(8px)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 1000,
      padding: '40px 20px',
      overflowY: 'auto'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '520px',
        width: '100%',
        position: 'relative',
        animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        border: '2px solid var(--accent-green)',
        background: '#FAF7F2', /* Match warm theme */
        boxShadow: '0 20px 25px -5px rgba(6, 95, 70, 0.1), 0 10px 10px -5px rgba(6, 95, 70, 0.04)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20, right: 20,
            background: 'none', border: 'none',
            color: 'var(--text-secondary)', cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '6px' }}>
            {authMode === 'login' && 'Welcome Back'}
            {authMode === 'register' && 'Create Profile'}
            {authMode === 'forgot' && 'Password Recovery'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {authMode === 'login' && 'Enter credentials to access carbon records'}
            {authMode === 'register' && 'Fill your details to calculate and save carbon metrics'}
            {authMode === 'forgot' && 'Reset your password using your security question'}
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)',
            padding: '12px', borderRadius: 'var(--radius-sm)', color: 'var(--accent-red)',
            marginBottom: '20px', fontSize: '0.85rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--accent-green-glow)', border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '12px', borderRadius: 'var(--radius-sm)', color: 'var(--accent-green)',
            marginBottom: '20px', fontSize: '0.85rem'
          }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login / Register Forms */}
        {(authMode === 'login' || authMode === 'register') && (
          <form onSubmit={handleAuthSubmit}>
            {authMode === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text" name="name" className="form-input" placeholder="John Doe"
                  value={formData.name} onChange={handleInputChange} required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email" name="email" className="form-input" placeholder="name@domain.com"
                value={formData.email} onChange={handleInputChange} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" className="form-input" placeholder="••••••••"
                  value={formData.password} onChange={handleInputChange} required
                  style={{ paddingRight: '45px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {authMode === 'register' && (
              <>
                {/* Security details (Requested feature 5) */}
                <div style={{ borderTop: '1px solid var(--border-color)', margin: '20px 0', paddingTop: '15px' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HelpCircle size={14} color="var(--accent-cyan)" /> Security Recovery Question
                  </h4>
                  
                  <div className="form-group">
                    <label className="form-label">Question</label>
                    <select
                      name="securityQuestion" className="form-select"
                      value={formData.securityQuestion} onChange={handleInputChange}
                    >
                      {securityQuestionsList.map((q, idx) => (
                        <option key={idx} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Answer (Answer is case-insensitive)</label>
                    <input
                      type="text" name="securityAnswer" className="form-input" placeholder="Your recovery answer"
                      value={formData.securityAnswer} onChange={handleInputChange} required
                    />
                  </div>
                </div>

                {/* Profile Details details (Requested feature 6) */}
                <div style={{ borderTop: '1px solid var(--border-color)', margin: '20px 0', paddingTop: '15px' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <LogIn size={14} color="var(--accent-green)" /> Profile Details
                  </h4>

                  <div className="form-group">
                    <label className="form-label">Current City</label>
                    <input
                      type="text" name="city" className="form-input" placeholder="e.g. Seattle"
                      value={formData.city} onChange={handleInputChange} required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ marginBottom: '10px' }}>Primary Transit Vehicle</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {[
                        { value: 'petrol', label: 'Petrol Sedan', icon: Car },
                        { value: 'diesel', label: 'Diesel SUV', icon: Truck },
                        { value: 'electric', label: 'Electric EV', icon: Zap },
                        { value: 'none', label: 'Walk / Cycle', icon: Bike }
                      ].map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = formData.vehicleType === opt.value;
                        return (
                          <div
                            key={opt.value}
                            onClick={() => setFormData({ ...formData, vehicleType: opt.value })}
                            style={{
                              padding: '10px',
                              borderRadius: 'var(--radius-sm)',
                              border: isSelected ? '2px solid var(--accent-green)' : '1px solid var(--border-color)',
                              background: isSelected ? 'rgba(6, 95, 70, 0.05)' : 'rgba(255, 255, 255, 0.6)',
                              cursor: 'pointer',
                              transition: 'var(--transition)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <Icon size={16} color={isSelected ? 'var(--accent-green)' : 'var(--text-secondary)'} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isSelected ? 'var(--accent-green)' : 'var(--text-primary)' }}>{opt.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Has AC at Home?</label>
                    <select
                      name="hasAC" className="form-select"
                      value={formData.hasAC} onChange={handleInputChange}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
                {/* Terms and Privacy Checkbox */}
                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '16px' }}>
                  <input
                    type="checkbox"
                    id="termsAgreement"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    style={{ marginTop: '4px', cursor: 'pointer', width: '16px', height: '16px' }}
                    required
                  />
                  <label htmlFor="termsAgreement" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, cursor: 'pointer' }}>
                    I agree to the <span style={{ color: 'var(--accent-green)', fontWeight: 600, textDecoration: 'underline' }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenTerms(true); }}>Terms & Conditions</span> and <span style={{ color: 'var(--accent-green)', fontWeight: 600, textDecoration: 'underline' }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenPrivacy(true); }}>Privacy Policy</span>.
                  </label>
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '46px', marginTop: '10px' }} disabled={loading || (authMode === 'register' && !agreed)}>
              {loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Register Account'}
            </button>
          </form>
        )}

        {/* Forgot password recovering wizard (Requested feature 5) */}
        {authMode === 'forgot' && (
          <div>
            {recoveryStep === 1 ? (
              <form onSubmit={handleRecoveryStep1}>
                <div className="form-group">
                  <label className="form-label">Account Email Address</label>
                  <input
                    type="email" name="email" className="form-input" placeholder="name@domain.com"
                    value={formData.email} onChange={handleInputChange} required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '46px' }} disabled={loading}>
                  {loading ? 'Searching...' : 'Retrieve Security Question'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRecoveryStep2}>
                <div className="glass-card" style={{ marginBottom: '20px', background: 'rgba(6,182,212,0.05)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Security Question:</span>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{recoveryQuestion}</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Security Answer</label>
                  <input
                    type="text" name="recoveryAnswer" className="form-input" placeholder="Answer to the question"
                    value={formData.recoveryAnswer} onChange={handleInputChange} required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword" className="form-input" placeholder="••••••••"
                      value={formData.newPassword} onChange={handleInputChange} required
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer'
                      }}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-success" style={{ width: '100%', height: '46px' }} disabled={loading}>
                  {loading ? 'Resetting...' : 'Verify Answer & Reset Password'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer toggles */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem' }}>
          {authMode === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>New to GreenPrint? </span>
                <a onClick={() => setAuthMode('register')} style={{ color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline' }}>Sign Up</a>
              </div>
              <a onClick={() => { setAuthMode('forgot'); setRecoveryStep(1); setError(''); }} style={{ color: 'var(--accent-red)', cursor: 'pointer', textDecoration: 'underline' }}>Forgot Password?</a>
            </div>
          )}
          
          {authMode === 'register' && (
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Already have an profile? </span>
              <a onClick={() => setAuthMode('login')} style={{ color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline' }}>Sign In</a>
            </div>
          )}

          {authMode === 'forgot' && (
            <div>
              <a onClick={() => { setAuthMode('login'); setError(''); }} style={{ color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline' }}>Back to Login</a>
            </div>
          )}
        </div>
      </div>

      {/* Accept-terms Sub-modals */}
      <Modal isOpen={openTerms} onClose={() => setOpenTerms(false)} type="terms" />
      <Modal isOpen={openPrivacy} onClose={() => setOpenPrivacy(false)} type="privacy" />
    </div>
  );
};

export default Auth;
