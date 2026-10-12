import React, { useEffect, useState } from 'react';
import { getDashboardStats, getLeads } from '../services/api';
import { ILeadStats, ILead } from '../types/lead';
import { DashboardComponent } from '../components/Dashboard/DashboardComponent';

interface DashboardPageProps {
  onToggleSave: (id: string) => void;
  onExportCSV: () => void;
  onOpenAddModal: () => void;
  refreshTrigger: number;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onToggleSave,
  onExportCSV,
  onOpenAddModal,
  refreshTrigger
}) => {
  const [stats, setStats] = useState<ILeadStats | null>(null);
  const [topLeads, setTopLeads] = useState<ILead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const statsRes = await getDashboardStats();
        if (statsRes.success) {
          setStats(statsRes.data);
        }

        const leadsRes = await getLeads({ sortBy: 'leadScore', sortOrder: 'desc', priority: 'High' });
        if (leadsRes.success) {
          setTopLeads(leadsRes.data);
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#94a3b8' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          Loading LeadIQ Dashboard...
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <DashboardComponent
      stats={stats}
      topLeads={topLeads}
      onToggleSave={onToggleSave}
      onExportCSV={onExportCSV}
      onOpenAddModal={onOpenAddModal}
    />
  );
};
