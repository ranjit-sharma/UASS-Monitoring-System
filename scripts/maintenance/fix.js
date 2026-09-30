const fs = require('fs');
let content = fs.readFileSync('client/src/components/layout/AppLayout.jsx', 'utf8');

const newContent = import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../Sidebar.jsx';
import { Toaster } from 'react-hot-toast';
import { useLiveObservations } from '../../../../controllers/useLiveObservations.js';
import { useState, useEffect, useRef } from 'react';
import { Modal } from '../../../common/Modal.jsx';

export function AppLayout() {
  const liveObs = useLiveObservations();
  const latestObs = liveObs[0];
  
  const isHarmful = !!latestObs && (latestObs.humidity >= 95 || latestObs.temperature <= -50 || latestObs.windSpeed >= 80);
  
  const [showAlert, setShowAlert] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [alertsLog, setAlertsLog] = useState([]);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const lastAlertRef = useRef('');

  let alertMessage = "";
  if (latestObs) {
    if (latestObs.humidity >= 95) alertMessage = 'WARNING: Heavy Clouds / Rain Detected';
    else if (latestObs.temperature <= -50) alertMessage = 'CRITICAL: Extreme Cold Zone (-50C)';
    else if (latestObs.windSpeed >= 80) alertMessage = 'HIGH WINDS: Severe Turbulence';
  }

  useEffect(() => {
    if (isHarmful && alertMessage && alertMessage !== lastAlertRef.current) {
      setShowAlert(true);
      lastAlertRef.current = alertMessage;
      setAlertsLog(prev => [{ time: new Date().toLocaleTimeString(), message: alertMessage }, ...prev].slice(0, 50));
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    } else if (!isHarmful) {
      setShowAlert(false);
    }
  }, [isHarmful, alertMessage]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--neu-bg)' }}>
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto min-w-0 relative">
        <button onClick={() => setIsAlertsOpen(true)} className="absolute top-6 right-6 z-50 bg-[var(--neu-surface)] text-[var(--text-main)] px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-[var(--neu-surface-raised)] transition-all border border-[var(--border-subtle)]">
          Alerts {alertsLog.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{alertsLog.length}</span>}
        </button>

        {isAlertsOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[var(--neu-surface)] w-full max-w-lg rounded-2xl p-6 border border-[var(--border-subtle)] shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-main">System Alerts</h2>
                <button onClick={() => setIsAlertsOpen(false)} className="text-subtle hover:text-main text-xl">x</button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
                {alertsLog.length === 0 ? (
                  <p className="text-subtle text-center py-8">No active alerts.</p>
                ) : alertsLog.map((log, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[var(--neu-bg)] border border-red-500/20 flex flex-col">
                    <span className="text-xs text-subtle mb-1">{log.time}</span>
                    <span className="text-sm font-semibold text-main">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showAlert && (
          <div className="fixed bottom-6 right-6 z-[9999] bg-red-500/90 text-white p-4 rounded-xl shadow-2xl flex flex-col gap-2 max-w-sm border-2 border-red-400" style={{ animation: 'glow-pulse 2s infinite' }}>
            <div className="flex items-start justify-between gap-3">
              <span className="font-bold text-sm leading-tight">{alertMessage}</span>
            </div>
            <p className="text-xs text-red-100 opacity-90">Telemetry and balloon integrity may be affected!</p>
          </div>
        )}
        <Toaster position="top-right" toastOptions={{ className: 'neu-flat text-main', style: { background: 'var(--neu-surface)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)' } }} />
        <Outlet />
      </main>
    </div>
  );
};

fs.writeFileSync('client/src/components/layout/AppLayout.jsx', newContent, 'utf8');
