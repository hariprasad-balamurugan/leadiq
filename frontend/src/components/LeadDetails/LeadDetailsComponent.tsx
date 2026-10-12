import React from 'react';
import { Link } from 'react-router-dom';
import { ILead } from '../../types/lead';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  DollarSign,
  Globe,
  CheckCircle2,
  XCircle,
  Bookmark,
  Download,
  Mail,
  Phone,
  Linkedin,
  Cpu,
  TrendingUp,
  Award,
  Sparkles,
  Flame,
  Zap
} from 'lucide-react';

interface LeadDetailsComponentProps {
  lead: ILead;
  onToggleSave: (id: string) => void;
  onExportSingle: (lead: ILead) => void;
}

export const LeadDetailsComponent: React.FC<LeadDetailsComponentProps> = ({
  lead,
  onToggleSave,
  onExportSingle
}) => {
  const isHigh = lead.priority === 'High';
  const isMedium = lead.priority === 'Medium';

  const formatRevenue = (rev: number) => {
    if (!rev) return '$0';
    if (rev >= 1000000) return `$${(rev / 1000000).toFixed(1)}M`;
    if (rev >= 1000) return `$${(rev / 1000).toFixed(0)}K`;
    return `$${rev}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/leads" className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Back to Leads
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => onToggleSave(lead._id)}
            className="btn-secondary"
            style={{
              color: lead.isSaved ? '#fbbf24' : '#94a3b8',
              borderColor: lead.isSaved ? 'rgba(245, 158, 11, 0.4)' : undefined,
              background: lead.isSaved ? 'rgba(245, 158, 11, 0.1)' : undefined
            }}
          >
            <Bookmark style={{ width: '16px', height: '16px', fill: lead.isSaved ? '#fbbf24' : 'none' }} />
            {lead.isSaved ? 'Saved Prospect' : 'Save Prospect'}
          </button>

          <button onClick={() => onExportSingle(lead)} className="btn-primary">
            <Download style={{ width: '16px', height: '16px' }} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Main Prospect Hero Banner */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#f8fafc' }}>
              {lead.name}
            </h1>
            {lead.verified && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                Verified Business
              </span>
            )}
          </div>

          <a
            href={lead.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#6366f1', fontWeight: '600', fontSize: '0.95rem' }}
          >
            <Globe style={{ width: '16px', height: '16px' }} />
            {lead.website}
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap', color: '#94a3b8', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Building2 style={{ width: '16px', height: '16px', color: '#6366f1' }} />
              Industry: <strong style={{ color: '#fff' }}>{lead.industry}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin style={{ width: '16px', height: '16px', color: '#f43f5e' }} />
              Location: <strong style={{ color: '#fff' }}>{lead.location}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users style={{ width: '16px', height: '16px', color: '#a855f7' }} />
              Employees: <strong style={{ color: '#fff' }}>{lead.employeeCount}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <DollarSign style={{ width: '16px', height: '16px', color: '#10b981' }} />
              Est. Revenue: <strong style={{ color: '#fff' }}>{formatRevenue(lead.revenueEstimate)}</strong>
            </span>
          </div>
        </div>

        {/* Lead Score Big Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem 2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', fontWeight: '700', marginBottom: '0.3rem' }}>
            Lead Qualification Score
          </div>
          <div style={{ fontSize: '3rem', fontWeight: '900', fontFamily: 'var(--font-mono)', lineHeight: '1', color: isHigh ? '#34d399' : isMedium ? '#fbbf24' : '#94a3b8' }}>
            {lead.leadScore}
            <span style={{ fontSize: '1.25rem', color: '#64748b' }}>/100</span>
          </div>
          <div className={isHigh ? 'badge-priority-high' : isMedium ? 'badge-priority-medium' : 'badge-priority-low'} style={{ marginTop: '0.75rem', padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}>
            {isHigh ? <Flame style={{ width: '14px', height: '14px' }} /> : isMedium ? <Zap style={{ width: '14px', height: '14px' }} /> : null}
            {lead.priority} Priority Tier
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns (Left: Decision Maker + Growth + Tech; Right: Why This Lead / Breakdown) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.5rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Decision Maker Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
              <Users style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
              Key Decision Maker
            </h3>
            {lead.contact ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
                    {lead.contact.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>
                    {lead.contact.title}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
                  <a
                    href={`mailto:${lead.contact.email}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}
                  >
                    <Mail style={{ width: '14px', height: '14px' }} />
                    {lead.contact.email}
                  </a>

                  {lead.contact.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>
                      <Phone style={{ width: '14px', height: '14px', color: '#10b981' }} />
                      {lead.contact.phone}
                    </div>
                  )}

                  {lead.contact.linkedin && (
                    <a
                      href={lead.contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#6366f1' }}
                    >
                      <Linkedin style={{ width: '14px', height: '14px' }} />
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No direct contact info registered.</div>
            )}
          </div>

          {/* Growth Signals */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
              <TrendingUp style={{ width: '18px', height: '18px', color: '#10b981' }} />
              Growth Signals & Buying Triggers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {lead.growthSignals && lead.growthSignals.length > 0 ? (
                lead.growthSignals.map((sig) => (
                  <div key={sig} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.85rem', fontWeight: '600', color: '#34d399' }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px', color: '#34d399' }} />
                    {sig}
                  </div>
                ))
              ) : (
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No recent hiring or funding signals detected.</div>
              )}
            </div>
          </div>

          {/* Technology Stack */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
              <Cpu style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
              Detected Technology Stack
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {lead.technologies && lead.technologies.map((t) => (
                <span key={t} className="tech-tag" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Why This Lead? / Score Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Why This Lead Summary Box */}
          <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
              Why You Should Contact This Lead First
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem' }}>
              LeadIQ automated intelligence analyzed this prospect against your target Ideal Customer Profile (ICP):
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none' }}>
              {lead.whySummary && lead.whySummary.length > 0 ? (
                lead.whySummary.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#f8fafc', fontWeight: '600' }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px', color: '#34d399', flexShrink: 0, marginTop: '2px' }} />
                    {item}
                  </li>
                ))
              ) : (
                <li style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Standard match criteria fulfilled.</li>
              )}
            </ul>
          </div>

          {/* Detailed Score Matrix Table */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
              <Award style={{ width: '18px', height: '18px', color: '#6366f1' }} />
              Score Calculation Breakdown Matrix
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '0.6rem 0.5rem' }}>Qualification Signal</th>
                    <th style={{ padding: '0.6rem 0.5rem' }}>Points</th>
                    <th style={{ padding: '0.6rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '0.6rem 0.5rem' }}>Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {lead.scoreBreakdown && lead.scoreBreakdown.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.65rem 0.5rem', fontWeight: '700', color: '#f8fafc' }}>
                        {row.signal}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: row.matched ? '#34d399' : '#94a3b8' }}>
                        {row.points} / {row.maxPoints}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>
                        {row.matched ? (
                          <span style={{ color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', fontWeight: '700' }}>
                            <CheckCircle2 style={{ width: '14px', height: '14px' }} /> Match
                          </span>
                        ) : (
                          <span style={{ color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem' }}>
                            <XCircle style={{ width: '14px', height: '14px' }} /> Partial
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', color: '#cbd5e1', fontSize: '0.8rem' }}>
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
