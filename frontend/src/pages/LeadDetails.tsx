import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLeadById, exportLeadsCSV } from '../services/api';
import { ILead } from '../types/lead';
import { LeadDetailsComponent } from '../components/LeadDetails/LeadDetailsComponent';

interface LeadDetailsPageProps {
  onToggleSave: (id: string) => void;
}

export const LeadDetailsPage: React.FC<LeadDetailsPageProps> = ({ onToggleSave }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<ILead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLead() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getLeadById(id);
        if (res.success) {
          setLead(res.data);
        } else {
          setError('Lead not found');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading lead details');
      } finally {
        setLoading(false);
      }
    }
    loadLead();
  }, [id]);

  const handleExportSingle = async (singleLead: ILead) => {
    await exportLeadsCSV({ search: singleLead.name });
  };

  const handleToggleSaveInternal = async (leadId: string) => {
    await onToggleSave(leadId);
    if (lead && lead._id === leadId) {
      setLead({ ...lead, isSaved: !lead.isSaved });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#94a3b8' }}>
        Loading Lead Qualification Intelligence...
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#f43f5e', marginBottom: '1rem' }}>Lead Not Found</h2>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{error || 'The requested prospect record could not be found.'}</p>
        <button onClick={() => navigate('/leads')} className="btn-primary">
          Back to Prospect Explorer
        </button>
      </div>
    );
  }

  return (
    <LeadDetailsComponent
      lead={lead}
      onToggleSave={handleToggleSaveInternal}
      onExportSingle={handleExportSingle}
    />
  );
};
