import React from 'react';
import { NavLink } from 'react-router-dom';
import { Target, LayoutDashboard, Search, Bookmark, Plus, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onResetSeed: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal, onResetSeed }) => {
  return (
    <header className="glass-panel" style={{ margin: '1rem', padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50 }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          padding: '0.55rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
        }}>
          <Target style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            LeadIQ
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '500' }}>
            Smart Lead Generation & Qualification
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.3rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: isActive ? '#fff' : '#94a3b8',
            background: isActive ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
            border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
            transition: 'all 0.2s ease'
          })}
        >
          <LayoutDashboard style={{ width: '16px', height: '16px' }} />
          Dashboard
        </NavLink>

        <NavLink
          to="/leads"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: isActive ? '#fff' : '#94a3b8',
            background: isActive ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
            border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
            transition: 'all 0.2s ease'
          })}
        >
          <Search style={{ width: '16px', height: '16px' }} />
          Leads Explorer
        </NavLink>

        <NavLink
          to="/saved"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: isActive ? '#fff' : '#94a3b8',
            background: isActive ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
            border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
            transition: 'all 0.2s ease'
          })}
        >
          <Bookmark style={{ width: '16px', height: '16px' }} />
          Saved Leads
        </NavLink>
      </nav>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={onResetSeed}
          className="btn-secondary"
          title="Reset database with seed dataset"
          style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
        >
          <RotateCcw style={{ width: '14px', height: '14px' }} />
          Reset Seed
        </button>

        <button
          onClick={onOpenAddModal}
          className="btn-primary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          Add Company
        </button>
      </div>
    </header>
  );
};
