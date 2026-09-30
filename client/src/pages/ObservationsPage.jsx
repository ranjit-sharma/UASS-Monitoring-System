// src/pages/ObservationsPage.jsx â€” MVC View Layer
import { useState } from 'react';
import { useObservations } from '../hooks/useObservations.js';
import { observationService } from '../services/observationService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Pagination } from '../components/common/Pagination.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import toast from 'react-hot-toast';

function formatDate(isoStr) {
  return isoStr ? new Date(isoStr).toLocaleString() : 'â€”';
}

export function ObservationsPage() {
  const { user } = useAuth();
  const canModify = user?.role === 'admin' || user?.role === 'operator';
  const canDelete = user?.role === 'admin';

  const [params, setParams] = useState({ page: 1, limit: 20, sortBy: 'recordedAt', sortOrder: 'desc' });
  const { observations, pagination, isLoading, error, setParams: updateParams, refetch } = useObservations(params);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [isDeleteFilterOpen, setIsDeleteFilterOpen] = useState(false);
  const [isShowingDeleted, setIsShowingDeleted] = useState(false);

  function handlePageChange(page) { updateParams((prev) => ({ ...prev, page })); }
  function toggleShowDeleted() {
    setIsShowingDeleted(!isShowingDeleted);
    updateParams(prev => ({ ...prev, page: 1, isDeleted: !isShowingDeleted }));
  }

  async function handleDeleteFiltered() {
    try {
      const p = { ...params };
      delete p.page; delete p.limit; delete p.sortBy; delete p.sortOrder;
      await observationService.deleteByFilter(p);
      toast.success('Filtered observations deleted');
      refetch();
    } catch (err) { toast.error(err.message); }
    finally { setIsDeleteFilterOpen(false); }
  }

  async function handleRestore(id) {
    try { await observationService.restore(id); toast.success('Observation restored'); refetch(); }
    catch (err) { toast.error(err.message); }
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    updateParams((prev) => ({ ...prev, page: 1, [name]: value || undefined }));
  }
  async function handleDeleteAll() {
    try { await observationService.deleteAll(); toast.success('All observations deleted'); refetch(); }
    catch (err) { toast.error(err.message); }
    finally { setIsDeleteAllOpen(false); }
  }

  async function handleDelete() {
    try { await observationService.delete(deleteId); toast.success('Observation deleted'); refetch(); }
    catch (err) { toast.error(err.message); }
    finally { setDeleteId(null); }
  }

  function handleExport(format) {
    const url = observationService.getExportUrl({
      startDate: params.startDate,
      endDate: params.endDate,
      source: params.source,
    }, format);
    window.location.href = url;
  }

  return (
    <div className="p-6 space-y-6 flex-1 min-h-screen" style={{ background: 'var(--neu-bg)' }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-main">Observations</h1>
          <p className="text-subtle text-sm mt-0.5">Historical sounding records</p>
        </div>
        {canModify && (
          <div className="flex items-center gap-3">
            {canDelete && (
              <button
                onClick={() => setIsDeleteAllOpen(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #ff6b6b, #fa5252)', boxShadow: '0 4px 14px rgba(255,107,107,0.3)' }}
              >
                Delete All
              </button>
            )}
            <button
              onClick={() => handleExport('excel')}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #107c41, #1f9a55)', boxShadow: '0 4px 14px rgba(16,124,65,0.3)' }}
            >
              Export Excel (.xlsx)
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #4ecdc4, #45b7d1)', boxShadow: '0 4px 14px rgba(78,205,196,0.3)' }}
            >
              Export CSV
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="neu-flat p-4 flex flex-wrap gap-3 items-center">
        <div className="flex flex-col">
          <label className="text-[10px] text-subtle uppercase tracking-widest mb-1">From Date</label>
          <input type="datetime-local" name="startDate" onChange={handleFilterChange}
                 className="neu-input px-3 py-2 text-main text-sm" />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] text-subtle uppercase tracking-widest mb-1">To Date</label>
          <input type="datetime-local" name="endDate" onChange={handleFilterChange}
                 className="neu-input px-3 py-2 text-main text-sm" />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] text-subtle uppercase tracking-widest mb-1">Data Source</label>
          <select name="source" onChange={handleFilterChange}
                  className="neu-input px-3 py-2 text-main text-sm min-w-[140px]">
            <option value="" style={{ background: 'var(--neu-surface)', color: 'var(--text-main)' }}>All sources</option>
            <option value="simulated" style={{ background: 'var(--neu-surface)', color: 'var(--text-main)' }}>Simulated</option>
            <option value="instrument" style={{ background: 'var(--neu-surface)', color: 'var(--text-main)' }}>Instrument</option>
            <option value="manual" style={{ background: 'var(--neu-surface)', color: 'var(--text-main)' }}>Manual</option>
          </select>
        </div>

        {canDelete && (
          <div className="flex items-end gap-3 ml-auto">
            <button onClick={toggleShowDeleted} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isShowingDeleted ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'neu-button text-subtle'}`}>
              {isShowingDeleted ? 'Exit Trash' : 'Show Trash'}
            </button>
            
          </div>
        )}
      </div>

      {isLoading ? <LoadingSpinner className="mt-12" />
       : error ? <ErrorMessage message={error} />
       : observations.length === 0 ? <EmptyState title="No observations found" description="Try adjusting your filters." />
       : (
        <div className="neu-flat overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-main">
              <thead>
                <tr className="text-subtle text-xs border-b border-[var(--table-border)]">
                  <th className="text-left px-4 py-3">Time</th>
                  <th className="text-right px-4 py-3">Alt (m)</th>
                  <th className="text-right px-4 py-3">Temp (Â°C)</th>
                  <th className="text-right px-4 py-3">Press (hPa)</th>
                  <th className="text-right px-4 py-3">Hum (%)</th>
                  <th className="text-right px-4 py-3">Wind (m/s)</th>
                  <th className="text-right px-4 py-3">Dir (Â°)</th>
                  <th className="text-right px-4 py-3">Source</th>
                  {canDelete && <th className="px-4 py-3" />}
                </tr>
              </thead>
              <tbody>
                {observations.map((obs) => (
                  <tr key={obs._id} className="border-b border-[var(--table-border)] hover:bg-[var(--table-hover)]">
                    <td className="px-4 py-3 text-subtle font-medium">{formatDate(obs.recordedAt)}</td>
                    <td className="text-right px-4 py-3"><span className="grad-text-altitude font-bold">{obs.altitude?.toFixed(0)}</span> <span className="text-xs text-subtle ml-0.5">m</span></td>
                    <td className="text-right px-4 py-3"><span className="grad-text-temp font-bold">{obs.temperature?.toFixed(1)}</span> <span className="text-xs text-subtle ml-0.5">Â°C</span></td>
                    <td className="text-right px-4 py-3"><span className="grad-text-pressure font-bold">{obs.pressure?.toFixed(1)}</span> <span className="text-xs text-subtle ml-0.5">hPa</span></td>
                    <td className="text-right px-4 py-3"><span className="grad-text-humidity font-bold">{obs.humidity?.toFixed(1)}</span> <span className="text-xs text-subtle ml-0.5">%</span></td>
                    <td className="text-right px-4 py-3"><span className="grad-text-wind font-bold">{obs.windSpeed?.toFixed(1)}</span> <span className="text-xs text-subtle ml-0.5">m/s</span></td>
                    <td className="text-right px-4 py-3 text-muted font-bold">{obs.windDirection?.toFixed(0)}<span className="text-xs ml-0.5">Â°</span></td>
                    <td className="text-right px-4 py-3"><Badge label={obs.source} variant={obs.source} /></td>
                    {canDelete && (
                      <td className="px-4 py-3 text-right">
                        {isShowingDeleted ? (
                          <button onClick={() => handleRestore(obs._id)}
                                  className="text-emerald-500/80 hover:text-emerald-500 text-xs font-semibold transition-colors">
                            Restore
                          </button>
                        ) : (
                          <button onClick={() => setDeleteId(obs._id)}
                                  className="text-red-500/80 hover:text-red-500 text-xs font-semibold transition-colors">
                            Delete
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[var(--table-border)] flex items-center justify-between">
            <span className="text-subtle text-xs">{pagination?.total?.toLocaleString()} records</span>
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} title="Delete Observation"
        message="Are you sure? This action cannot be undone."
        confirmLabel="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
        
      <ConfirmDialog isOpen={isDeleteAllOpen} title="Delete ALL Observations"
        message="Are you sure you want to permanently delete EVERY observation? This action CANNOT be undone."
        confirmLabel="Delete ALL" danger onConfirm={handleDeleteAll} onCancel={() => setIsDeleteAllOpen(false)} />
        

    </div>
  );
}





