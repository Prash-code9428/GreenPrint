import React, { useState } from 'react';
import { Leaf, ArrowRight, ShieldAlert, Sparkles, BookOpen, AlertCircle, Zap, Globe, Plane, Navigation, Heart, Mail } from 'lucide-react';
import Modal from './Modal';

const Home = ({ setActiveTab, openAuthModal, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('education');

  const triggerModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Hero Header */}
      <section style={{
        textAlign: 'center',
        padding: '50px 20px 70px',
        background: 'radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.12) 0%, rgba(250, 247, 242, 0) 70%)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '40px',
        position: 'relative'
      }}>
        {/* Floating background leaf accents */}
        <div style={{ position: 'absolute', top: '15%', left: '10%' }} className="leaf-deco">
          <Leaf size={32} color="rgba(16, 185, 129, 0.25)" />
        </div>
        <div style={{ position: 'absolute', top: '25%', right: '12%' }} className="leaf-deco">
          <Leaf size={40} color="rgba(6, 95, 70, 0.18)" style={{ transform: 'rotate(45deg)' }} />
        </div>
        <div style={{ position: 'absolute', bottom: '15%', left: '15%' }} className="leaf-deco">
          <Leaf size={28} color="rgba(16, 185, 129, 0.2)" style={{ transform: 'rotate(-30deg)' }} />
        </div>

        <div className="user-badge" style={{ display: 'inline-flex', margin: '0 auto 18px', gap: '6px', background: 'rgba(6, 95, 70, 0.08)' }}>
          <Sparkles size={14} color="var(--accent-green)" />
          <span>Carbon Footprint Ledger & Geopolitical Impact Tracker</span>
        </div>

        <h1 className="title-gradient" style={{
          fontSize: '3.3rem',
          fontWeight: 800,
          lineHeight: 1.15,
          maxWidth: '850px',
          margin: '0 auto 16px',
          letterSpacing: '-0.02em'
        }}>
          Personal Actions. <span className="green-gradient">Organic Preventions.</span> Global Realities.
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.15rem',
          maxWidth: '680px',
          margin: '0 auto 28px',
          lineHeight: 1.6
        }}>
          GreenPrint provides dynamic carbon estimation algorithms to contextualize daily choices alongside massive geopolitical carbon footprints.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('calculator')}>
            Calculate Your Emissions <ArrowRight size={16} />
          </button>
          <button className="btn btn-secondary" onClick={() => {
            const el = document.getElementById('emissions-ledger');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Explore Carbon Ledger
          </button>
        </div>
      </section>

      {/* Section 1: Carbon Footprint Overview & Effects */}
      <section style={{ marginBottom: '56px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="cyan-gradient" style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <BookOpen size={22} /> Carbon Footprint Overview
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
            What is a carbon footprint and how does it drive global warming?
          </p>
        </div>

        <div className="grid-3" style={{ gap: '20px' }}>
          <div className="glass-panel" style={{ borderLeft: '3px solid var(--accent-green)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-green)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Leaf size={16} /> What is a Footprint?
            </h3>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              A carbon footprint represents the total greenhouse gas (GHG) emissions caused directly and indirectly by an entity (person, organization, or process). It is measured in carbon dioxide equivalents (CO₂e) to standardize the combined warming effect.
            </p>
          </div>

          <div className="glass-panel" style={{ borderLeft: '3px solid var(--accent-cyan)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} /> The Greenhouse Effect
            </h3>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              Gases like CO₂ and methane trap heat radiating from the Earth's surface, acting like a greenhouse. Industrial activities, combustion transit, and deforestations have thickened this blanket, raising average global temperatures by 1.1°C.
            </p>
          </div>

          <div className="glass-panel" style={{ borderLeft: '3px solid var(--accent-red)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-red)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> Climate Consequences
            </h3>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              The trapping of heat changes weather patterns, leading to melting glaciers, rising sea levels, and agricultural stress. Extreme heatwaves, prolonged droughts, and severe storm events have tripled in frequency since the mid-20th century.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Comparative Ledger */}
      <section id="emissions-ledger" style={{ marginBottom: '56px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="title-gradient" style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Globe size={22} color="var(--accent-cyan)" /> Comparative Emissions Ledger
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
            Explore the raw carbon footprints generated by home air conditioning, passenger flights, driving, and global wars.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {/* Card 1: AC usage */}
          <div className="glass-card" style={{ borderLeft: '3px solid var(--accent-cyan)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Home Appliance</span>
              <Zap size={16} color="var(--accent-cyan)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Air Conditioner (AC)</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', margin: '10px 0' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>1.20</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>kg CO₂ / hour</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Running a standard 1.5 kW compressor AC unit for 8 hours daily generates approx. <strong>288 kg CO₂</strong> per month.
            </p>
          </div>

          {/* Card 2: Personal Vehicle */}
          <div className="glass-card" style={{ borderLeft: '3px solid var(--accent-green)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Personal Transport</span>
              <Navigation size={16} color="var(--accent-green)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Combustion Vehicle</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', margin: '10px 0' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-green)' }}>0.18</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>kg CO₂ / km</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Driving an average gasoline car 10,000 km annually releases roughly <strong>1,800 kg CO₂</strong> into the atmosphere.
            </p>
          </div>

          {/* Card 3: Flight */}
          <div className="glass-card" style={{ borderLeft: '3px solid #8B5CF6', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Commercial Flight</span>
              <Plane size={16} color="#8B5CF6" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Passenger Flight</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', margin: '10px 0' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8B5CF6' }}>0.15</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>kg CO₂ / passenger-km</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              A single passenger taking a round-trip flight from London to New York (11,000 km) emits approx. <strong>1,650 kg CO₂</strong>.
            </p>
          </div>

          {/* Card 4: War Conflict */}
          <div className="glass-card" style={{ borderLeft: '3px solid var(--accent-red)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Military Conflicts</span>
              <ShieldAlert size={16} color="var(--accent-red)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Geopolitical Conflicts</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', margin: '10px 0' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-red)' }}>150M</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>Tonnes CO₂eq</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              The <strong>Russia-Ukraine War</strong> emissions (combat fuel, Nord Stream sabotage, concrete rebuilding) exceed the annual output of Belgium.
            </p>
          </div>
        </div>

        {/* Visual Equivalency Grid */}
        <div className="glass-panel" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(244, 63, 94, 0.02) 100%)',
          borderLeft: '4px solid var(--accent-red)'
        }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="var(--accent-red)" />
            Personal vs Geopolitical Scale Comparison
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.5 }}>
            To contextualize, a single combat jet (like an F-16) consumes about 3,500 liters of jet fuel per hour, emitting <strong>8.7 tonnes of CO₂</strong>. This is equivalent to:
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.4)', borderRadius: 'var(--radius-sm)' }}>
              <span>Running a home Air Conditioner unit continuously</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>7,250 Hours</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.4)', borderRadius: 'var(--radius-sm)' }}>
              <span>Commuting in an average petrol vehicle</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-green)' }}>48,300 Kilometers</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.4)', borderRadius: 'var(--radius-sm)' }}>
              <span>Individual London to New York round-trip flight segments</span>
              <span style={{ fontWeight: 600, color: '#8B5CF6' }}>5.3 Passengers</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
