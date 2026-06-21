import React, { useState, useEffect } from 'react';
import { Leaf, Heart, Mail } from 'lucide-react';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Home from './components/Home';
import SavingsCalculator from './components/SavingsCalculator';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import Modal from './components/Modal';
import ClimatiqExplorer from './components/ClimatiqExplorer';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [footerModalOpen, setFooterModalOpen] = useState(false);
  const [footerModalType, setFooterModalType] = useState('education');

  const triggerFooterModal = (type) => {
    setFooterModalType(type);
    setFooterModalOpen(true);
  };

  // Load user session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('greenprint_token');
    const savedUser = localStorage.getItem('greenprint_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      syncUserProfile(savedToken);
    }
  }, []);

  const syncUserProfile = async (authToken) => {
    const activeToken = authToken || token;
    if (!activeToken) return;

    try {
      const res = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('greenprint_user', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error syncing user profile:', err);
    }
  };

  const handleLoginSuccess = (data) => {
    localStorage.setItem('greenprint_token', data.token);
    localStorage.setItem('greenprint_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setActiveTab('profile'); // Route directly to profile on login
  };

  const handleLogout = () => {
    localStorage.removeItem('greenprint_token');
    localStorage.removeItem('greenprint_user');
    setToken(null);
    setUser(null);
    setActiveTab('home');
  };

  return (
    <div className="app-container">
      {/* Sleek sticky header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        openAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main content area */}
      <main className="main-content">
        {activeTab === 'home' && (
          <Home
            setActiveTab={setActiveTab}
            openAuthModal={() => setAuthModalOpen(true)}
            user={user}
          />
        )}
        
        {activeTab === 'calculator' && (
          <SavingsCalculator
            user={user}
            token={token}
            onActivityLogged={() => syncUserProfile(token)}
          />
        )}
        
        {activeTab === 'leaderboard' && (
          <Leaderboard />
        )}
        
        {activeTab === 'profile' && (
          <Profile
            user={user}
            token={token}
            onProfileUpdated={(updatedUser) => setUser(updatedUser)}
          />
        )}

        {activeTab === 'climatiq' && (
          <ClimatiqExplorer token={token} />
        )}
      </main>

      {/* Global Footer */}
      <footer className="global-footer">
        <div className="global-footer-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            marginBottom: '30px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Leaf size={20} color="var(--accent-green)" />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--accent-green)' }}>
                  Green<span style={{ color: 'var(--accent-cyan)' }}>Print</span>
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Exposing the metrics of global carbon outputs while promoting conscious lifestyle offsets and data transparency.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-green)', marginBottom: '12px' }}>Navigation</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                <li><a onClick={() => setActiveTab('home')} style={{ color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Home / Overview</a></li>
                <li><a onClick={() => setActiveTab('calculator')} style={{ color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Carbon Calculator</a></li>
                <li><a onClick={() => setActiveTab('leaderboard')} style={{ color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Advocates Leaderboard</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-green)', marginBottom: '12px' }}>Resources</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                <li><a onClick={() => triggerFooterModal('education')} style={{ color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Education Guidelines</a></li>
                <li><a onClick={() => triggerFooterModal('methodology')} style={{ color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Carbon Methodologies</a></li>
                <li><a onClick={() => triggerFooterModal('privacy')} style={{ color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policies</a></li>
                <li><a onClick={() => triggerFooterModal('terms')} style={{ color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Terms & Conditions</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-green)', marginBottom: '12px' }}>Contact Developer</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                <a href="mailto:dev.prashisalive@gmail.com" style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'underline', fontWeight: 600 }}>
                  <Mail size={14} /> dev.prashisalive@gmail.com
                </a>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Send suggestions or feedback directly to developer inbox.</span>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(6, 95, 70, 0.08)',
            paddingTop: '20px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <span>&copy; {new Date().getFullYear()} GreenPrint Platform. All rights reserved.</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--accent-green)' }}>
              Designed and developed by Prashant
            </span>
          </div>
        </div>
      </footer>

      {/* Authentication form overlay modal */}
      <Auth
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Global Resource Modals */}
      <Modal
        isOpen={footerModalOpen}
        onClose={() => setFooterModalOpen(false)}
        type={footerModalType}
      />
    </div>
  );
}

export default App;
