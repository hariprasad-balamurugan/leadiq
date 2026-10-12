import React from 'react';
import { Link } from 'react-router-dom';
import { ILeadStats, ILead } from '../../types/lead';
import { Target, Flame, Bookmark, BarChart3, Building2, Cpu, ArrowRight, Download, Plus, CheckCircle2 } from 'lucide-react';
import { LeadCard } from '../LeadCard/LeadCard';

interface DashboardComponentProps {
  stats: ILeadStats | null;
  topLeads: ILead[];
  onToggleSave: (id: string) => void;
  onExportCSV: () => void;
  onOpenAddModal: () => void;
}

export const DashboardComponent: React.FC<DashboardComponentProps> = ({
  stats,
  topLeads,
  onToggleSave,
  onExportCSV,
  onOpenAddModal
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Banner / Header */}
      <div className="glass-panel" style={{ padding: '1.75rem 2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.1) 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Lead Generation & Qualification Dashboard
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Find, score, and prioritize your highest-converting B2B prospects instantly.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onExportCSV} className="btn-secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
            <Download style={{ width: '15px', height: '15px' }} />
            Export CSV
          </button>
          <button onClick={onOpenAddModal} className="btn-primary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>
            <Plus style={{ width: '16px', height: '16px' }} />
            Add Prospect
          </button>
        </div>
      </div>

      {/* KPI Stats Widgets (4 Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        
        {/* Card 1: Total Leads */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.75rem', borderRadius: '14px' }}>
            <Building2 style={{ width: '26px', height: '26px', color: '#6366f1' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: '700' }}>
              Total Leads
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#f8fafc' }}>
              {stats?.totalLeads ?? 0}
            </div>
          </div>
        </div>

        {/* Card 2: High Score Leads */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.75rem', borderRadius: '14px' }}>
            <Flame style={{ width: '26px', height: '26px', color: '#34d399' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: '700' }}>
              High Priority 🔥
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
              {stats?.highScoreLeads ?? 0}
            </div>
          </div>
        </div>

        {/* Card 3: Saved Leads */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.75rem', borderRadius: '14px' }}>
            <Bookmark style={{ width: '26px', height: '26px', color: '#fbbf24' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: '700' }}>
              Saved Leads ⭐
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
              {stats?.savedLeads ?? 0}
            </div>
          </div>
        </div>

        {/* Card 4: Avg Lead Score */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '0.75rem', borderRadius: '14px' }}>
            <Target style={{ width: '26px', height: '26px', color: '#38bdf8' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: '700' }}>
              Avg Qualification Score
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
              {stats?.avgScore ?? 0}
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>/100</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Content Layout: Top Prospects & Market Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem' }}>
        
        {/* Left Column: Top Priority Leads */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame style={{ width: '20px', height: '20px', color: '#34d399' }} />
              Top Priority Prospects to Contact First
            </h2>
            <Link to="/leads" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#6366f1', fontWeight: '600' }}>
              View All Leads
              <ArrowRight style={{ width: '15px', height: '15px' }} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topLeads.length > 0 ? (
              topLeads.slice(0, 4).map((lead) => (
                <LeadCard key={lead._id} lead={lead} onToggleSave={onToggleSave} />
              ))
            ) : (
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                No high-priority leads found. Try resetting the seed dataset.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Analytics & Sector Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Industry Distribution Widget */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
              <BarChart3 style={{ width: '18px', height: '18px', color: '#6366f1' }} />
              Industry Sector Distribution
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats?.industryDistribution && stats.industryDistribution.map((item) => {
                const percentage = Math.round((item.count / (stats.totalLeads || 1)) * 100);
                return (
                  <div key={item.industry} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: '#cbd5e1', fontWeight: '600' }}>{item.industry}</span>
                      <span style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>{item.count} leads ({percentage}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: '3px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Technologies Widget */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
              <Cpu style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
              Most Common Tech Stacks
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {stats?.techDistribution && stats.techDistribution.map((t) => (
                <div key={t.tech} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255, 255, 255, 0.06)', padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ color: '#f8fafc', fontWeight: '600' }}>{t.tech}</span>
                  <span style={{ color: '#38bdf8', fontWeight: '800' }}>({t.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Value Proposition Card */}
          <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#34d399', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 style={{ width: '16px', height: '16px' }} />
              Why LeadIQ Lead Scoring Works
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
              Instead of guessing which of 500+ contacts to call, LeadIQ checks tech matches, decision makers, location hubs, and active hiring signals to surface the top 20 leads ready for immediate sales outreach.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
