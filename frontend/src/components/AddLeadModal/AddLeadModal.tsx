import React, { useState } from 'react';
import { ILead } from '../../types/lead';
import { X, Plus, AlertCircle, Building2, Globe, MapPin, Users, Mail, User, Sparkles } from 'lucide-react';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: Partial<ILead>) => Promise<void>;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: 'SaaS',
    location: 'Chennai, India',
    employeeCount: 100,
    technologies: 'React, Node.js, MongoDB',
    revenueEstimate: 2000000,
    growthSignals: 'Hiring, Expanding Team',
    contactName: '',
    contactTitle: 'CTO',
    contactEmail: '',
    contactPhone: '+91 98765 43210'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.website || !formData.contactName || !formData.contactEmail) {
      setError('Please fill in Company Name, Website, Contact Name, and Contact Email.');
      return;
    }

    try {
      setLoading(true);
      const leadPayload: Partial<ILead> = {
        name: formData.name,
        website: formData.website.startsWith('http') ? formData.website : `https://${formData.website}`,
        industry: formData.industry,
        location: formData.location,
        employeeCount: Number(formData.employeeCount),
        revenueEstimate: Number(formData.revenueEstimate),
        technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
        growthSignals: formData.growthSignals.split(',').map((s) => s.trim()).filter(Boolean),
        contact: {
          name: formData.contactName,
          title: formData.contactTitle,
          email: formData.contactEmail,
          phone: formData.contactPhone
        },
        verified: true,
        isSaved: true
      };

      await onSubmit(leadPayload);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to add company.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 8, 15, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '620px', background: '#0f172a', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '20px', padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>
            <Sparkles style={{ width: '20px', height: '20px', color: '#6366f1' }} />
            Add & Auto-Score New Lead
          </div>
          <button onClick={onClose} className="btn-icon">
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', color: '#f43f5e', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Row 1: Company Name & Website */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Building2 style={{ width: '13px', height: '13px', color: '#6366f1' }} />
                Company Name *
              </label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. Apex AI Systems"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Globe style={{ width: '13px', height: '13px', color: '#38bdf8' }} />
                Website Domain *
              </label>
              <input
                type="text"
                className="input-control"
                placeholder="https://apexai.example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Row 2: Industry & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                Industry Sector
              </label>
              <select
                className="input-control"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              >
                {['SaaS', 'FinTech', 'Healthcare', 'E-commerce', 'Cybersecurity', 'Manufacturing', 'Logistics', 'AgriTech'].map((i) => (
                  <option key={i} value={i} style={{ background: '#0f172a' }}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin style={{ width: '13px', height: '13px', color: '#f43f5e' }} />
                Location Hub
              </label>
              <input
                type="text"
                className="input-control"
                placeholder="Chennai, India"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          {/* Row 3: Employee Count & Est. Revenue */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Users style={{ width: '13px', height: '13px', color: '#a855f7' }} />
                Employee Count
              </label>
              <input
                type="number"
                className="input-control"
                value={formData.employeeCount}
                onChange={(e) => setFormData({ ...formData, employeeCount: Number(e.target.value) })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                Estimated Revenue ($ USD)
              </label>
              <input
                type="number"
                className="input-control"
                value={formData.revenueEstimate}
                onChange={(e) => setFormData({ ...formData, revenueEstimate: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Row 4: Tech Stack & Growth Signals */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Technologies Used (comma separated)
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="React, Node.js, MongoDB, AWS, Python"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Growth Signals (comma separated)
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="Hiring, New Product Launch, Series A"
              value={formData.growthSignals}
              onChange={(e) => setFormData({ ...formData, growthSignals: e.target.value })}
            />
          </div>

          {/* Contact Person Card */}
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase' }}>
              Decision Maker Contact Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <input
                  type="text"
                  className="input-control"
                  placeholder="Contact Name *"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  className="input-control"
                  placeholder="Title (e.g. CEO, CTO)"
                  value={formData.contactTitle}
                  onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                />
              </div>
            </div>
            <div>
              <input
                type="email"
                className="input-control"
                placeholder="Contact Email *"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              <Plus style={{ width: '16px', height: '16px' }} />
              {loading ? 'Scoring Lead...' : 'Save & Score Lead'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
