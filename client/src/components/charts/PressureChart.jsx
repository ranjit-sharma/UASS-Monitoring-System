// src/components/charts/PressureChart.jsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';

function formatTime(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="neu-flat px-3.5 py-2.5 text-xs">
      <p className="text-subtle mb-1">{formatTime(label)}</p>
      <p style={{ color: '#4ecdc4', fontWeight: 700, fontSize: 15 }}>
        {payload[0]?.value?.toFixed(1)} hPa
      </p>
    </div>
  );
};

export function PressureChart({ data }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-48 text-subtle text-sm">No data</div>
  );

  const avg = data.reduce((s, d) => s + d.pressure, 0) / data.length;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.6} />
        <XAxis dataKey="recordedAt" tickFormatter={formatTime} stroke="var(--text-subtle)"
               tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
        <YAxis stroke="var(--text-subtle)" tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
               label={{ value: 'hPa', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={avg} stroke="#45b7d1" strokeDasharray="4 4" strokeOpacity={0.7} />
        <Line type="monotone" dataKey="pressure" stroke="#4ecdc4" strokeWidth={2.5}
              dot={false} activeDot={{ r: 5, fill: '#4ecdc4', stroke: 'var(--neu-surface)', strokeWidth: 2 }}
              strokeLinecap="round" strokeLinejoin="round" />
      </LineChart>
    </ResponsiveContainer>
  );
}
