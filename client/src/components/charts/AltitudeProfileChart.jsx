// src/components/charts/AltitudeProfileChart.jsx
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ZAxis
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="neu-flat px-3.5 py-2.5 text-xs">
      <p style={{ color: '#339af0', fontWeight: 700, fontSize: 13 }}>{d?.altitude?.toFixed(0)} m</p>
      <p style={{ color: '#ff6b6b', fontSize: 12 }}>{d?.temperature?.toFixed(1)}°C</p>
      <p style={{ color: '#4ecdc4', fontSize: 12 }}>{d?.pressure?.toFixed(1)} hPa</p>
    </div>
  );
};

export function AltitudeProfileChart({ data }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-48 text-subtle text-sm">No data</div>
  );

  const sorted = [...data].sort((a, b) => a.altitude - b.altitude);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <radialGradient id="scatterGrad">
            <stop offset="0%" stopColor="#339af0" stopOpacity={1} />
            <stop offset="100%" stopColor="#4dabf7" stopOpacity={0.4} />
          </radialGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.6} />
        <XAxis dataKey="temperature" name="Temperature" type="number" stroke="var(--text-subtle)"
               tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
               label={{ value: '°C', position: 'insideBottomRight', offset: 0, fill: 'var(--text-muted)', fontSize: 11 }} />
        <YAxis dataKey="altitude" name="Altitude" type="number" stroke="var(--text-subtle)"
               tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
               label={{ value: 'm', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11 }} />
        <ZAxis range={[30, 80]} />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'var(--border-subtle)' }} />
        <Scatter data={sorted} fill="url(#scatterGrad)" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
