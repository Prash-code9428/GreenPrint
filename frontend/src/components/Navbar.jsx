import React from 'react';
import { Leaf, Home, Calculator, Award, User, LogOut, Globe } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, user, onLogout, openAuthModal }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'climatiq', label: 'Climatiq Explorer', icon: Globe },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => setActiveTab('home')}>
          <Leaf size={24} color="#10B981" />
          <span>GreenPrint</span>
        </div>

        <ul className="navbar-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <a
                  className={`navbar-link ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={16} />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="navbar-auth">
          {user ? (
            <>
              <div className="user-badge">
                <User size={14} />
                <span>{user.name}</span>
                <span style={{ margin: '0 4px', opacity: 0.5 }}>|</span>
                <span>{parseFloat(user.carbon_saved || 0).toFixed(1)} kg</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={onLogout} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={openAuthModal} style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
