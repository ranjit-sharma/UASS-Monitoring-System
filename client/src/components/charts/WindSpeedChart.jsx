// src/components/charts/WindSpeedChart.jsx
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
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
      <p style={{ color: '#cc5de8', fontWeight: 700, fontSize: 15 }}>
        {payload[0]?.value?.toFixed(1)} m/s
      </p>
    </div>
  );
};

export function WindSpeedChart({ data }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-48 text-subtle text-sm">No data</div>
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#cc5de8" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#845ef7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.6} />
        <XAxis dataKey="recordedAt" tickFormatter={formatTime} stroke="var(--text-subtle)"
               tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval="preserveStartEnd" />
        <YAxis stroke="var(--text-subtle)" tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
               label={{ value: 'm/s', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="windSpeed" stroke="#cc5de8" strokeWidth={2.5}
              fill="url(#windGrad)" dot={false}
              activeDot={{ r: 5, fill: '#cc5de8', stroke: 'var(--neu-surface)', strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
