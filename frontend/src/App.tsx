import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { DashboardPage } from './pages/Dashboard';
import { LeadsPage } from './pages/Leads';
import { LeadDetailsPage } from './pages/LeadDetails';
import { AddLeadModal } from './components/AddLeadModal/AddLeadModal';
import { toggleSaveLead, createLead, reseedDatabase, exportLeadsCSV } from './services/api';
import { ILead } from './types/lead';

export const App: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleSave = async (id: string) => {
    try {
      const res = await toggleSaveLead(id);
      showToast(res.data?.isSaved ? 'Prospect saved to favorites ⭐' : 'Prospect removed from saved list');
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  const handleCreateLead = async (leadPayload: Partial<ILead>) => {
    const res = await createLead(leadPayload);
    showToast(`Created & Scored lead "${res.data?.name}" (Score: ${res.data?.leadScore}/100 🔥)`);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleResetSeed = async () => {
    if (!window.confirm('Reset all demo leads to the original seed data?')) {
      return;
    }
    try {
      await reseedDatabase();
      showToast('Database reset with seed dataset! 🎯');
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to reset seed:', err);
    }
  };

  const handleGlobalExportCSV = async () => {
    await exportLeadsCSV();
    showToast('Exporting CSV prospect dataset... 📥');
  };

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Navbar */}
        <Navbar
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onResetSeed={handleResetSeed}
        />

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#f8fafc',
            border: '1px solid rgba(99, 102, 241, 0.5)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: '600',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.25s ease-out'
          }}>
            <span>✨</span>
            {toastMessage}
          </div>
        )}

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '1rem 1.5rem 3rem 1.5rem' }}>
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  onToggleSave={handleToggleSave}
                  onExportCSV={handleGlobalExportCSV}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  refreshTrigger={refreshTrigger}
                />
              }
            />
            <Route
              path="/leads"
              element={
                <LeadsPage
                  onToggleSave={handleToggleSave}
                  refreshTrigger={refreshTrigger}
                />
              }
            />
            <Route
              path="/saved"
              element={
                <LeadsPage
                  onToggleSave={handleToggleSave}
                  isSavedOnly={true}
                  refreshTrigger={refreshTrigger}
                />
              }
            />
            <Route
              path="/leads/:id"
              element={
                <LeadDetailsPage
                  onToggleSave={handleToggleSave}
                />
              }
            />
          </Routes>
        </main>

        {/* Add Lead Modal */}
        <AddLeadModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateLead}
        />

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', padding: '1.25rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b', background: 'rgba(11, 15, 25, 0.8)' }}>
          LeadIQ — Smart Lead Generation & Qualification System • Built with React TypeScript Vite & Express Mongoose
        </footer>

      </div>
    </BrowserRouter>
  );
};

export default App;
