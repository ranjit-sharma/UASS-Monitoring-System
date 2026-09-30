// src/components/charts/HumidityChart.jsx
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
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
      <p style={{ color: '#51cf66', fontWeight: 700, fontSize: 15 }}>
        {payload[0]?.value?.toFixed(1)}% RH
      </p>
    </div>
  );
};

export function HumidityChart({ data }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-48 text-subtle text-sm">No data</div>
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="humidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#51cf66" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#94d82d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.6} />
        <XAxis dataKey="recordedAt" tickFormatter={formatTime} stroke="var(--text-subtle)"
               tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
        <YAxis domain={[0, 100]} stroke="var(--text-subtle)" tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
               label={{ value: '%', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="humidity" stroke="#51cf66" strokeWidth={2.5}
              fill="url(#humidGrad)" dot={false}
              activeDot={{ r: 5, fill: '#51cf66', stroke: 'var(--neu-surface)', strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
