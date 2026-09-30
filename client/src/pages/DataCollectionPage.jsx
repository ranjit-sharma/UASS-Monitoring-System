// src/pages/DataCollectionPage.jsx â€” MVC View Layer
import { useState, useEffect } from 'react';
import { collectionService } from '../services/collectionService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/common/ErrorMessage.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import toast from 'react-hot-toast';

function formatDate(isoStr) { return isoStr ? new Date(isoStr).toLocaleString() : '-'; }

function handlePrintReport(session) {
  const content = <div style="padding:40px;font-family:sans-serif;color:black;background:white">
    <h1 style="margin-bottom:0">Flight Session Report</h1>
    <p style="color:gray;margin-top:5px">Generated on </p>
    <hr />
    <h2>Session Details</h2>
    <p><strong>Name:</strong> </p>
    <p><strong>Status:</strong> </p>
    <p><strong>Started At:</strong> </p>
    <p><strong>Ended At:</strong> </p>
    <p><strong>Data Source:</strong> </p>
    <p><strong>Session ID:</strong> </p>
    <br/>
    <h2>System Administrator Note</h2>
    <p>This report confirms the official data acquisition log for the selected flight session. You can cross-reference this session ID in the historical observations table to extract the full CSV telemetry file.</p>
  </div>;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => { printWindow.print(); }, 500);
}

export function DataCollectionPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const canControl = user?.role === 'admin' || user?.role === 'operator';

  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [stopConfirmId, setStopConfirmId] = useState(null);

  async function loadSessions() {
    try {
      const result = await collectionService.list({ limit: 20 });
      setSessions(result.data);
      setActiveSession(result.data.find((s) => s.status === 'running') || null);
    } catch (err) { setError(err.message); }
    finally { setIsLoading(false); }
  }

  useEffect(() => { loadSessions(); }, []);

  useEffect(() => {
    if (!socket) return;
    const onStarted = (s) => { setSessions((p) => [s, ...p]); setActiveSession(s); toast.success(`Started: ${s.sessionName}`); };
    const onStopped = (s) => { setSessions((p) => p.map((x) => x._id === s._id ? s : x)); setActiveSession(null); toast.success(`Stopped: ${s.sessionName}`); };
    socket.on('collection:started', onStarted);
    socket.on('collection:stopped', onStopped);
    return () => { socket.off('collection:started', onStarted); socket.off('collection:stopped', onStopped); };
  }, [socket]);

  async function handleStart() {
    setIsStarting(true);
    try { await collectionService.start({ sessionName: `Session ${new Date().toLocaleString()}` }); }
    catch (err) { toast.error(err.message); }
    finally { setIsStarting(false); }
  }

  async function handleStop(sessionId) {
    try { await collectionService.stop(sessionId); setStopConfirmId(null); }
    catch (err) { toast.error(err.message); setStopConfirmId(null); }
  }

  return (
    <div className="p-6 space-y-6 flex-1 min-h-screen" style={{ background: 'var(--neu-bg)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">Data Collection</h1>
          <p className="text-subtle text-sm mt-0.5">Manage sounding sessions</p>
        </div>
        {canControl && (
          activeSession ? (
            <button onClick={() => setStopConfirmId(activeSession._id)}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #ff6b6b, #fa5252)', boxShadow: '0 4px 14px rgba(255,107,107,0.35)' }}>
              Stop Session
            </button>
          ) : (
            <button onClick={handleStart} disabled={isStarting}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #51cf66, #40c057)', boxShadow: '0 4px 14px rgba(81,207,102,0.35)' }}>
              {isStarting ? 'â³ Startingâ€¦' : 'Start Session'}
            </button>
          )
        )}
      </div>

      {activeSession && (
        <div className="neu-flat border-l-4 border-emerald-500 p-4 flex items-center justify-between">
          <div>
            <p className="text-emerald-500 font-semibold text-sm">{activeSession.sessionName}</p>
            <p className="text-subtle text-xs mt-0.5">Started {formatDate(activeSession.startedAt)} Â· {activeSession.source}</p>
          </div>
          <Badge label="running" variant="running" />
        </div>
      )}

      {isLoading ? <LoadingSpinner className="mt-12" />
       : error ? <ErrorMessage message={error} />
       : sessions.length === 0 ? <EmptyState title="No sessions yet" description={canControl ? 'Click Start Session to begin.' : 'No sessions have been run.'} />
       : (
        <div className="neu-flat overflow-hidden">
          <table className="w-full text-sm text-main">
            <thead>
              <tr className="text-subtle text-xs border-b border-[var(--table-border)]">
                <th className="text-left px-4 py-3">Session Name</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-left px-4 py-3">Started</th>
                <th className="text-left px-4 py-3">Ended</th>
                  <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s._id} className="border-b border-[var(--table-border)] hover:bg-[var(--table-hover)]">
                  <td className="px-4 py-3 font-medium text-main">{s.sessionName}</td>
                  <td className="px-4 py-3"><Badge label={s.status} variant={s.status} /></td>
                  <td className="px-4 py-3 text-subtle">{s.source}</td>
                  <td className="px-4 py-3 text-subtle">{formatDate(s.startedAt)}</td>
                  <td className="px-4 py-3 text-subtle">{formatDate(s.endedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog isOpen={!!stopConfirmId} title="Stop Collection Session"
        message="Stop the active data collection session?"
        confirmLabel="Stop" danger
        onConfirm={() => handleStop(stopConfirmId)}
        onCancel={() => setStopConfirmId(null)} />
    </div>
  );
}




