import { useState, useEffect } from 'react';
import { collectionService } from '../services/collectionService.js';
import { observationService } from '../services/observationService.js';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';

export function FlightComparisonPage() {
  const [sessions, setSessions] = useState([]);
  const [sessionA, setSessionA] = useState('');
  const [sessionB, setSessionB] = useState('');
  const [dataA, setDataA] = useState([]);
  const [dataB, setDataB] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    collectionService.list({ limit: 50 }).then(res => setSessions(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      if (sessionA) {
        const res = await observationService.list({ sessionId: sessionA, limit: 1000 });
        setDataA([...res.data].reverse());
      } else setDataA([]);
      
      if (sessionB) {
        const res = await observationService.list({ sessionId: sessionB, limit: 1000 });
        setDataB([...res.data].reverse());
      } else setDataB([]);
      setLoading(false);
    }
    fetch();
  }, [sessionA, sessionB]);

  const maxLength = Math.max(dataA.length, dataB.length);
  const comparisonData = Array.from({ length: maxLength }).map((_, i) => ({
    index: i,
    altA: dataA[i]?.altitude,
    altB: dataB[i]?.altitude,
    tempA: dataA[i]?.temperature,
    tempB: dataB[i]?.temperature,
  }));

  const nameA = sessions.find(s => s._id === sessionA)?.sessionName || 'Flight A';
  const nameB = sessions.find(s => s._id === sessionB)?.sessionName || 'Flight B';

  return (
    <div className="p-6 space-y-6 flex flex-col h-full min-h-screen" style={{ background: 'var(--neu-bg)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">Flight Comparison</h1>
          <p className="text-subtle text-sm">Overlay and analyze historical flight profiles</p>
        </div>
      </div>
      
      <div className="flex gap-6">
        <div className="flex-1 neu-flat p-4">
          <label className="text-xs font-bold text-subtle uppercase mb-2 block">Select Flight A (Blue)</label>
          <select value={sessionA} onChange={e => setSessionA(e.target.value)} className="neu-pressed w-full p-2 text-sm text-main rounded">
            <option value="">-- None --</option>
            {sessions.map(s => <option key={s._id} value={s._id}>{s.sessionName}</option>)}
          </select>
        </div>
        <div className="flex-1 neu-flat p-4">
          <label className="text-xs font-bold text-subtle uppercase mb-2 block">Select Flight B (Green)</label>
          <select value={sessionB} onChange={e => setSessionB(e.target.value)} className="neu-pressed w-full p-2 text-sm text-main rounded">
            <option value="">-- None --</option>
            {sessions.map(s => <option key={s._id} value={s._id}>{s.sessionName}</option>)}
          </select>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : comparisonData.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 flex-1">
          <div className="neu-flat p-6 rounded-2xl h-[400px]">
            <h3 className="text-main font-bold mb-4">Altitude Profile Comparison (m)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.6} />
                <XAxis dataKey="index" stroke="var(--text-subtle)" tick={false} />
                <YAxis stroke="var(--text-subtle)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--neu-surface)', borderColor: 'var(--border-subtle)' }} />
                <Legend />
                <Line type="monotone" dataKey="altA" name={nameA} stroke="#339af0" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="altB" name={nameB} stroke="#51cf66" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="neu-flat p-6 rounded-2xl h-[400px]">
            <h3 className="text-main font-bold mb-4">Temperature Profile Comparison (°C)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.6} />
                <XAxis dataKey="index" stroke="var(--text-subtle)" tick={false} />
                <YAxis stroke="var(--text-subtle)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--neu-surface)', borderColor: 'var(--border-subtle)' }} />
                <Legend />
                <Line type="monotone" dataKey="tempA" name={nameA} stroke="#339af0" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="tempB" name={nameB} stroke="#51cf66" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-subtle">
          Select two flights to compare them.
        </div>
      )}
    </div>
  );
}
