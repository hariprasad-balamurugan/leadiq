import React, { useEffect, useState } from 'react';
import { getLeads, exportLeadsCSV } from '../services/api';
import { ILead, FilterState } from '../types/lead';
import { Filters } from '../components/Filters/Filters';
import { LeadCard } from '../components/LeadCard/LeadCard';
import { Download, SlidersHorizontal, LayoutGrid, List, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface LeadsPageProps {
  onToggleSave: (id: string) => void;
  isSavedOnly?: boolean;
  refreshTrigger: number;
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  industries: [],
  location: '',
  minEmployees: 1,
  maxEmployees: 1000,
  technologies: [],
  minScore: 0,
  priority: 'All',
  sortBy: 'leadScore',
  sortOrder: 'desc'
};

const PAGE_SIZE = 6;

export const LeadsPage: React.FC<LeadsPageProps> = ({ onToggleSave, isSavedOnly = false, refreshTrigger }) => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [leads, setLeads] = useState<ILead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setPage(1);
  }, [isSavedOnly]);

  useEffect(() => {
    let ignore = false;
    async function loadLeads() {
      try {
        setLoading(true);
        const res = await getLeads({
          ...filters,
          isSaved: isSavedOnly ? true : undefined,
          page,
          limit: PAGE_SIZE
        });
        if (!ignore && res.success) {
          setLeads(res.data);
          setTotal(res.pagination.total);
          setTotalPages(res.pagination.totalPages || 1);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to load leads:', err);
          setError(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadLeads();
    return () => { ignore = true; };
  }, [filters, isSavedOnly, refreshTrigger, retry, page]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleExportCSV = async () => {
    await exportLeadsCSV({
      ...filters,
      isSaved: isSavedOnly ? true : undefined
    });
  };

  return (
    <div className="leads-layout">
      
      {/* Sidebar Filters */}
      <Filters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleResetFilters}
        totalResults={total}
      />

      {/* Main Prospects Grid / Explorer Area */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Header Control Bar */}
        <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isSavedOnly ? 'Saved Prospects ⭐' : 'Prospect Explorer'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} qualified company prospects
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            
            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.3rem 0.6rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <ArrowUpDown style={{ width: '14px', height: '14px', color: '#6366f1' }} />
              <select
                value={filters.sortBy}
                onChange={(e) => {
                  setFilters({ ...filters, sortBy: e.target.value });
                  setPage(1);
                }}
                style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '0.8rem', outline: 'none', cursor: 'pointer', fontWeight: '600' }}
              >
                <option value="leadScore" style={{ background: '#0f172a' }}>Sort by Score</option>
                <option value="employeeCount" style={{ background: '#0f172a' }}>Sort by Employee Count</option>
                <option value="revenueEstimate" style={{ background: '#0f172a' }}>Sort by Revenue</option>
                <option value="name" style={{ background: '#0f172a' }}>Sort by Name</option>
              </select>
            </div>

            {/* View Mode Switch */}
            <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', padding: '0.2rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                onClick={() => setViewMode('grid')}
                className="btn-icon"
                style={{ padding: '0.3rem', color: viewMode === 'grid' ? '#6366f1' : '#64748b' }}
                title="Grid View"
              >
                <LayoutGrid style={{ width: '16px', height: '16px' }} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="btn-icon"
                style={{ padding: '0.3rem', color: viewMode === 'list' ? '#6366f1' : '#64748b' }}
                title="List View"
              >
                <List style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {/* CSV Export Button */}
            <button onClick={handleExportCSV} className="btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
              <Download style={{ width: '14px', height: '14px' }} />
              Export CSV
            </button>

          </div>
        </div>

        {/* Lead Cards List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: '#94a3b8' }}>
            Loading leads...
          </div>
        ) : error ? (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: '#f43f5e', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Unable to load leads.</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>
                Please try again.
              </p>
            </div>
            <button onClick={() => { setError(false); setRetry(r => r + 1); }} className="btn-secondary" style={{ marginTop: '0.5rem' }}>
              Retry
            </button>
          </div>
        ) : leads.length > 0 ? (
          <div className={viewMode === 'grid' ? 'leads-grid' : 'leads-list'}>
            {leads.map((lead) => (
              <LeadCard key={lead._id} lead={lead} onToggleSave={onToggleSave} />
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <SlidersHorizontal style={{ width: '40px', height: '40px', color: '#64748b' }} />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>No leads found</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.3rem' }}>
                Try changing your filters.
              </p>
            </div>
            <button onClick={handleResetFilters} className="btn-secondary" style={{ marginTop: '0.5rem' }}>
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && total > 0 && (
          <div
            className="glass-panel"
            style={{
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Page <strong style={{ color: '#6366f1' }}>{page}</strong> of <strong style={{ color: '#f8fafc' }}>{totalPages}</strong> ({total} total leads)
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn-secondary"
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.8rem',
                  opacity: page <= 1 ? 0.4 : 1,
                  cursor: page <= 1 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronLeft style={{ width: '14px', height: '14px' }} />
                Previous
              </button>

              <span style={{ fontSize: '0.8rem', color: '#cbd5e1', padding: '0 0.4rem', fontWeight: '600' }}>
                Page {page} / {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="btn-secondary"
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.8rem',
                  opacity: page >= totalPages ? 0.4 : 1,
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
                <ChevronRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
