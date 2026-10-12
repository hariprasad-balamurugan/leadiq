import React from 'react';
import { FilterState } from '../../types/lead';
import { Search, Filter, RotateCcw, Building2, MapPin, Users, Cpu, Award } from 'lucide-react';

interface FiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

const INDUSTRY_OPTIONS = [
  'SaaS',
  'FinTech',
  'Healthcare',
  'E-commerce',
  'Cybersecurity',
  'Manufacturing',
  'Logistics',
  'AgriTech'
];

const TECH_OPTIONS = [
  'React',
  'Node.js',
  'Python',
  'AWS',
  'MongoDB',
  'TypeScript',
  'Docker',
  'PostgreSQL'
];

const LOCATION_OPTIONS = [
  'All Locations',
  'Chennai, India',
  'Bengaluru, India',
  'Mumbai, India',
  'Delhi, India',
  'Hyderabad, India',
  'Pune, India'
];

export const Filters: React.FC<FiltersProps> = ({ filters, onChange, onReset, totalResults }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleIndustryToggle = (ind: string) => {
    const exists = filters.industries.includes(ind);
    const updated = exists
      ? filters.industries.filter((i) => i !== ind)
      : [...filters.industries, ind];
    onChange({ ...filters, industries: updated });
  };

  const handleTechToggle = (tech: string) => {
    const exists = filters.technologies.includes(tech);
    const updated = exists
      ? filters.technologies.filter((t) => t !== tech)
      : [...filters.technologies, tech];
    onChange({ ...filters, technologies: updated });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const loc = e.target.value === 'All Locations' ? '' : e.target.value;
    onChange({ ...filters, location: loc });
  };

  const handlePriorityChange = (priority: string) => {
    onChange({ ...filters, priority });
  };

  return (
    <aside className="glass-panel filters-sidebar">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem', color: '#f8fafc' }}>
          <Filter style={{ width: '18px', height: '18px', color: '#6366f1' }} />
          Prospect Filters
        </div>
        <button
          onClick={onReset}
          className="btn-icon"
          title="Reset all filters"
          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#94a3b8' }}
        >
          <RotateCcw style={{ width: '13px', height: '13px' }} />
          Reset
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', display: 'block' }}>
          Search Keyword
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="input-control"
            placeholder="Search company, tech, contact..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Priority Selector */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Award style={{ width: '14px', height: '14px', color: '#38bdf8' }} />
          Priority Tier
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.25rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.2rem', borderRadius: '8px' }}>
          {['All', 'High', 'Medium', 'Low'].map((p) => {
            const isSelected = filters.priority === p;
            return (
              <button
                key={p}
                onClick={() => handlePriorityChange(p)}
                style={{
                  padding: '0.35rem 0.2rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: isSelected ? '#fff' : '#64748b',
                  background: isSelected
                    ? p === 'High'
                      ? 'rgba(16, 185, 129, 0.3)'
                      : p === 'Medium'
                      ? 'rgba(245, 158, 11, 0.3)'
                      : p === 'Low'
                      ? 'rgba(100, 116, 139, 0.3)'
                      : 'rgba(99, 102, 241, 0.3)'
                    : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {p === 'High' ? '🔥 High' : p === 'Medium' ? '⚡ Med' : p === 'Low' ? '💧 Low' : 'All'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Score Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Min Lead Score
          </label>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
            {filters.minScore}+
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="95"
          step="5"
          value={filters.minScore}
          onChange={(e) => onChange({ ...filters, minScore: Number(e.target.value) })}
          style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
        />
      </div>

      {/* Location Selector */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin style={{ width: '14px', height: '14px', color: '#f43f5e' }} />
          Target Location
        </label>
        <select
          className="input-control"
          value={filters.location || 'All Locations'}
          onChange={handleLocationChange}
          style={{ cursor: 'pointer' }}
        >
          {LOCATION_OPTIONS.map((loc) => (
            <option key={loc} value={loc} style={{ background: '#0f172a', color: '#fff' }}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Company Size Range */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users style={{ width: '14px', height: '14px', color: '#a855f7' }} />
            Company Size
          </label>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>
            {filters.minEmployees} - {filters.maxEmployees} emp
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="number"
            className="input-control"
            style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
            placeholder="Min"
            value={filters.minEmployees}
            onChange={(e) => onChange({ ...filters, minEmployees: Math.max(1, Number(e.target.value)) })}
          />
          <span style={{ color: '#64748b' }}>-</span>
          <input
            type="number"
            className="input-control"
            style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
            placeholder="Max"
            value={filters.maxEmployees}
            onChange={(e) => onChange({ ...filters, maxEmployees: Math.max(1, Number(e.target.value)) })}
          />
        </div>
      </div>

      {/* Industry Multi-select */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Building2 style={{ width: '14px', height: '14px', color: '#10b981' }} />
          Industry
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '150px', overflowY: 'auto', paddingRight: '0.3rem' }}>
          {INDUSTRY_OPTIONS.map((ind) => {
            const isChecked = filters.industries.includes(ind);
            return (
              <label
                key={ind}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: isChecked ? '#fff' : '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.2rem 0.3rem',
                  borderRadius: '4px',
                  background: isChecked ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleIndustryToggle(ind)}
                  style={{ accentColor: '#6366f1', cursor: 'pointer' }}
                />
                {ind}
              </label>
            );
          })}
        </div>
      </div>

      {/* Technology Stack Multi-select */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Cpu style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
          Technologies Required
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {TECH_OPTIONS.map((tech) => {
            const isChecked = filters.technologies.includes(tech);
            return (
              <button
                key={tech}
                onClick={() => handleTechToggle(tech)}
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '600',
                  color: isChecked ? '#6366f1' : '#94a3b8',
                  background: isChecked ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: isChecked ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                  transition: 'all 0.15s ease'
                }}
              >
                {tech}
              </button>
            );
          })}
        </div>
      </div>

      {/* Matching Count */}
      <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Active Filter Count</span>
        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981' }}>
          {totalResults} Prospects
        </span>
      </div>
    </aside>
  );
};
