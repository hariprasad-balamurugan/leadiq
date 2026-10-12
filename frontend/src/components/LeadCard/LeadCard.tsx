import React from 'react';
import { Link } from 'react-router-dom';
import { ILead } from '../../types/lead';
import { Building2, MapPin, Users, Globe, CheckCircle2, Bookmark, ExternalLink, Zap, Flame, UserCheck } from 'lucide-react';

interface LeadCardProps {
  lead: ILead;
  onToggleSave: (id: string) => void;
  onExportSingle?: (lead: ILead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onToggleSave }) => {
  const isHigh = lead.priority === 'High';
  const isMedium = lead.priority === 'Medium';

  const formatRevenue = (rev: number) => {
    if (!rev) return '$0';
    if (rev >= 1000000) return `$${(rev / 1000000).toFixed(1)}M`;
    if (rev >= 1000) return `$${(rev / 1000).toFixed(0)}K`;
    return `$${rev}`;
  };

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        minWidth: 0,
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Card Top Row: Header Info & Score */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', width: '100%' }}>
        {/* Left Side: Company name, verification, website, metadata */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f8fafc', wordBreak: 'break-word', minWidth: 0, margin: 0 }}>
              {lead.name}
            </h3>
            {lead.verified && (
              <span title="Domain Verified" style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                <CheckCircle2 style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
              </span>
            )}
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', flexShrink: 0 }}
            >
              <Globe style={{ width: '12px', height: '12px' }} />
              website
            </a>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            rowGap: '0.25rem',
            columnGap: '0.5rem',
            marginTop: '0.35rem',
            fontSize: '0.8rem',
            color: '#94a3b8'
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
              <Building2 style={{ width: '13px', height: '13px', color: '#6366f1', flexShrink: 0 }} />
              {lead.industry}
            </span>
            <span style={{ color: '#475569' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
              <MapPin style={{ width: '13px', height: '13px', color: '#f43f5e', flexShrink: 0 }} />
              {lead.location}
            </span>
            <span style={{ color: '#475569' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
              <Users style={{ width: '13px', height: '13px', color: '#a855f7', flexShrink: 0 }} />
              {lead.employeeCount} employees
            </span>
          </div>
        </div>

        {/* Right Side: Score & Priority */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.4rem',
          flexShrink: 0,
          minWidth: 'fit-content'
        }}>
          <div className={`score-pill ${isHigh ? 'score-pill-high' : isMedium ? 'score-pill-medium' : 'score-pill-low'}`}>
            <span>{lead.leadScore}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>/100</span>
          </div>

          <div className={isHigh ? 'badge-priority-high' : isMedium ? 'badge-priority-medium' : 'badge-priority-low'}>
            {isHigh ? <Flame style={{ width: '12px', height: '12px', flexShrink: 0 }} /> : isMedium ? <Zap style={{ width: '12px', height: '12px', flexShrink: 0 }} /> : null}
            <span>{lead.priority} Priority</span>
          </div>
        </div>
      </div>

      {/* Technologies Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem', width: '100%' }}>
        {lead.technologies && lead.technologies.slice(0, 5).map((tech) => (
          <span key={tech} className="tech-tag">
            {tech}
          </span>
        ))}
        {lead.technologies && lead.technologies.length > 5 && (
          <span className="tech-tag" style={{ color: '#64748b' }}>
            +{lead.technologies.length - 5} more
          </span>
        )}
      </div>

      {/* Growth Signals & Decision Maker Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.75rem',
        background: 'rgba(15, 23, 42, 0.4)',
        padding: '0.75rem',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: '700' }}>
            Growth Signals
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {lead.growthSignals && lead.growthSignals.length > 0 ? (
              lead.growthSignals.map((signal) => (
                <span key={signal} className="growth-tag">
                  ✓ {signal}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Standard trajectory</span>
            )}
          </div>
        </div>

        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <UserCheck style={{ width: '12px', height: '12px', color: '#10b981', flexShrink: 0 }} />
            Decision Maker
          </div>
          {lead.contact ? (
            <div style={{ fontSize: '0.8rem', minWidth: 0 }}>
              <div style={{ fontWeight: '700', color: '#f8fafc', wordBreak: 'break-word', lineHeight: 1.3 }}>
                {lead.contact.name}
                {lead.contact.title && (
                  <span style={{ color: '#94a3b8', fontWeight: '400', marginLeft: '0.35rem', fontSize: '0.75rem' }}>
                    ({lead.contact.title})
                  </span>
                )}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                marginTop: '0.2rem',
                wordBreak: 'break-all',
                overflowWrap: 'anywhere'
              }}>
                {lead.contact.email}
              </div>
            </div>
          ) : (
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>No contact listed</span>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginTop: 'auto',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        width: '100%'
      }}>
        <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>
          Est. Revenue: <strong style={{ color: '#cbd5e1' }}>{formatRevenue(lead.revenueEstimate)}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onToggleSave(lead._id)}
            className="btn-secondary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              color: lead.isSaved ? '#fbbf24' : '#94a3b8',
              borderColor: lead.isSaved ? 'rgba(245, 158, 11, 0.4)' : undefined,
              background: lead.isSaved ? 'rgba(245, 158, 11, 0.1)' : undefined,
              whiteSpace: 'nowrap'
            }}
          >
            <Bookmark style={{ width: '14px', height: '14px', fill: lead.isSaved ? '#fbbf24' : 'none', flexShrink: 0 }} />
            {lead.isSaved ? 'Saved' : 'Save Lead'}
          </button>

          <Link
            to={`/leads/${lead._id}`}
            className="btn-primary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
          >
            View Details
            <ExternalLink style={{ width: '13px', height: '13px', flexShrink: 0 }} />
          </Link>
        </div>
      </div>
    </div>
  );
};
