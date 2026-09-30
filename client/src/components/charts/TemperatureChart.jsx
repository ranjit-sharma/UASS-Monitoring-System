// src/components/charts/TemperatureChart.jsx
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
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
      <p style={{ color: '#ff6b6b', fontWeight: 700, fontSize: 15 }}>
        {payload[0]?.value?.toFixed(1)}°C
      </p>
    </div>
  );
};

export function TemperatureChart({ data }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-48 text-subtle text-sm">No data</div>
  );

  const avg = data.reduce((s, d) => s + d.temperature, 0) / data.length;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#ffa94d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.6} />
        <XAxis dataKey="recordedAt" tickFormatter={formatTime} stroke="var(--text-subtle)"
               tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
        <YAxis stroke="var(--text-subtle)" tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
               label={{ value: '°C', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={avg} stroke="#ffa94d" strokeDasharray="4 4" strokeOpacity={0.7} />
        <Area type="monotone" dataKey="temperature" stroke="#ff6b6b" strokeWidth={2.5}
              fill="url(#tempGrad)" dot={false} activeDot={{ r: 5, fill: '#ff6b6b', stroke: 'var(--neu-surface)', strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
