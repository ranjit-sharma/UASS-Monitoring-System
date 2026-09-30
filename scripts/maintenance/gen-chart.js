const fs = require('fs');

const content = import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// Magnus-Tetens formula for Dewpoint
function calculateDewpoint(t, rh) {
  if (t == null || rh == null) return null;
  const a = 17.27;
  const b = 237.3;
  const alpha = ((a * t) / (b + t)) + Math.log(rh / 100);
  return (b * alpha) / (a - alpha);
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="neu-flat px-3 py-2 text-xs">
      <p style={{ color: '#4ecdc4', fontWeight: 700, fontSize: 13 }}>{d?.pressure?.toFixed(1)} hPa</p>
      <p style={{ color: '#ff6b6b' }}>Temp: {d?.temperature?.toFixed(1)}°C</p>
      <p style={{ color: '#51cf66' }}>DewPt: {d?.dewpoint?.toFixed(1)}°C</p>
      <p style={{ color: '#339af0' }}>Alt: {d?.altitude?.toFixed(0)}m</p>
    </div>
  );
};

export function SoundingChart({ data }) {
  if (!data?.length) return <div className="flex items-center justify-center h-full text-subtle text-sm">No data</div>;

  // Process data for sounding (filter, calc dewpoint, sort by pressure descending)
  const soundingData = data
    .filter(d => d.pressure != null && d.temperature != null && d.humidity != null)
    .map(d => ({
      ...d,
      dewpoint: calculateDewpoint(d.temperature, d.humidity)
    }))
    .sort((a, b) => b.pressure - a.pressure); // 1000 at bottom, 10 at top

  // Y-axis must be reversed natively by recharts if we use a decreasing domain
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.6} />
        <XAxis 
          dataKey="temperature" 
          type="number" 
          name="Temperature" 
          stroke="var(--text-subtle)" 
          tick={{ fontSize: 10, fill: 'var(--text-muted)' }} 
          domain={[-100, 50]} 
          label={{ value: 'Temperature (°C)', position: 'bottom', offset: 0, fill: 'var(--text-muted)', fontSize: 11 }}
        />
        <YAxis 
          dataKey="pressure" 
          type="number" 
          name="Pressure" 
          stroke="var(--text-subtle)" 
          tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
          domain={['dataMax', 'dataMin']} 
          reversed={true} 
          label={{ value: 'Pressure (hPa)', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'var(--border-subtle)' }} />
        <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)' }} />
        
        {/* Temperature Line */}
        <Scatter name="Temperature (°C)" data={soundingData} fill="#ff6b6b" line={{ stroke: '#ff6b6b', strokeWidth: 2 }} shape="circle" />
        
        {/* Dewpoint Line */}
        <Scatter name="Dewpoint (°C)" dataKey="dewpoint" data={soundingData} fill="#51cf66" line={{ stroke: '#51cf66', strokeWidth: 2 }} shape="circle" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
;
fs.writeFileSync('client/src/components/charts/SoundingChart.jsx', content, 'utf8');
