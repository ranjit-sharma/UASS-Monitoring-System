// src/pages/AuditLogsPage.jsx — MVC View Layer
import { useState, useEffect } from 'react';
import { auditLogService } from '../services/auditLogService.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Pagination } from '../components/common/Pagination.jsx';
import { Badge } from '../components/common/Badge.jsx';

function formatDate(isoStr) { return isoStr ? new Date(isoStr).toLocaleString() : '—'; }

const ACTION_VARIANTS = {
  LOGIN_SUCCESS: 'running', LOGIN_FAILURE: 'failed', LOGOUT: 'idle',
  USER_CREATED: 'running', USER_DEACTIVATED: 'failed', ROLE_CHANGED: 'manual',
  USER_UPDATED: 'idle', OBSERVATION_CREATED: 'instrument',
  OBSERVATION_UPDATED: 'simulated', OBSERVATION_DELETED: 'failed',
  COLLECTION_STARTED: 'running', COLLECTION_STOPPED: 'completed',
};

export function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    auditLogService.list({ page, limit: 50 })
      .then((r) => { setLogs(r.data); setPagination(r.pagination); })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [page]);

  return (
    <div className="p-6 space-y-6 flex-1 min-h-screen" style={{ background: 'var(--neu-bg)' }}>
      <div>
        <h1 className="text-2xl font-bold text-main">Audit Logs</h1>
        <p className="text-subtle text-sm mt-0.5">Security & activity history</p>
      </div>

      {isLoading ? <LoadingSpinner className="mt-12" />
       : error ? <ErrorMessage message={error} />
       : logs.length === 0 ? <EmptyState title="No audit logs" description="Actions appear here as they occur." />
       : (
        <div className="neu-flat overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-main">
              <thead>
                <tr className="text-subtle text-xs border-b border-[var(--table-border)]">
                  <th className="text-left px-4 py-3">Time</th>
                  <th className="text-left px-4 py-3">Action</th>
                  <th className="text-left px-4 py-3">Resource</th>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b border-[var(--table-border)] hover:bg-[var(--table-hover)] transition-colors duration-200">
                    <td className="px-4 py-3 text-subtle whitespace-nowrap">{formatDate(log.timestamp)}</td>
                    <td className="px-4 py-3">
                      <Badge label={log.action.replace(/_/g, ' ')} variant={ACTION_VARIANTS[log.action] || 'idle'} />
                    </td>
                    <td className="px-4 py-3 capitalize text-muted">{log.resource}</td>
                    <td className="px-4 py-3 text-muted">{log.userId?.name || <span className="text-subtle">—</span>}</td>
                    <td className="px-4 py-3 text-subtle text-xs max-w-xs truncate">
                      {log.metadata && Object.keys(log.metadata).length > 0 ? JSON.stringify(log.metadata) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[var(--table-border)] flex justify-end">
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}



