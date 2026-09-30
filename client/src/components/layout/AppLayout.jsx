import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Toaster } from 'react-hot-toast';
import { useLiveObservations } from '../../hooks/useLiveObservations.js';
import { useState, useEffect, useRef } from 'react';

export function AppLayout() {
  const liveObs = useLiveObservations();
  const latestObs = liveObs[0];
  
  // Infer hazardous conditions: rain (humidity > 95%), extreme cold (< -50C), high winds (> 80m/s)
  const isHarmful = !!latestObs && (latestObs.humidity >= 95 || latestObs.temperature <= -50 || latestObs.windSpeed >= 80);
  
  const [showAlert, setShowAlert] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [alertsLog, setAlertsLog] = useState([]);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const lastAlertRef = useRef('');

  let alertMessage = "";
  if (latestObs) {
    if (latestObs.humidity >= 95) alertMessage = '⚠️ WARNING: Heavy Clouds / Rain Detected';
    else if (latestObs.temperature <= -50) alertMessage = '❄️ CRITICAL: Extreme Cold Zone (-50C)';
    else if (latestObs.windSpeed >= 80) alertMessage = '🌪️ HIGH WINDS: Severe Turbulence';
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
      <Sidebar onOpenAlerts={() => setIsAlertsOpen(true)} unreadAlerts={alertsLog.length} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 flex flex-col overflow-y-auto min-w-0 relative">
        {/* Mobile Header */}
        <div className="md:hidden neu-flat p-4 flex items-center justify-between sticky top-0 z-40 bg-[var(--neu-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white font-bold">U</div>
            <span className="font-bold text-main">UASS</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-subtle hover:text-main">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          </button>
        </div>
        

        {isAlertsOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[var(--neu-surface)] w-full max-w-lg rounded-2xl p-6 border border-[var(--border-subtle)] shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-main">System Alerts</h2>
                <button onClick={() => setIsAlertsOpen(false)} className="text-subtle hover:text-main text-xl">X</button>
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
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--neu-surface)',
              color: 'var(--text-main)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '6px 6px 14px var(--neu-shadow-dark), -6px -6px 14px var(--neu-shadow-light)',
            },
            success: { iconTheme: { primary: '#51cf66', secondary: 'var(--neu-surface)' } },
            error: { iconTheme: { primary: '#ff6b6b', secondary: 'var(--neu-surface)' } },
          }}
        />
        <Outlet />
      </main>
    </div>
  );
}















