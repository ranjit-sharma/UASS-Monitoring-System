import { useLiveObservations } from '../hooks/useLiveObservations.js';
import { useSocket } from '../context/SocketContext.jsx';
import { useDataSource } from '../context/DataSourceContext.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { TemperatureChart } from '../components/charts/TemperatureChart.jsx';
import { WindCompass } from '../components/charts/WindCompass.jsx';
import { WindSpeedChart } from '../components/charts/WindSpeedChart.jsx';
import { useAlertSettings } from '../context/AlertSettingsContext.jsx';

function formatDate(isoStr) {
  return isoStr ? new Date(isoStr).toLocaleString() : '—';
}

export function LiveMonitoringPage() {
  const { isConnected } = useSocket();
  const liveObs = useLiveObservations();
  const { dataSourceMode: viewMode } = useDataSource();
  const { thresholds, setThresholds } = useAlertSettings();
  
  const observations = liveObs.filter(obs => obs.source === viewMode);
  
  const chartData = [...observations].reverse().slice(-30);
  const latest = observations[0];

  return (
    <div className="p-6 space-y-6" style={{ background: 'var(--neu-bg)', minHeight: '100%' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-main">Live Monitoring</h1>
          <p className="text-subtle text-sm mt-0.5">Real-time socket stream</p>
        </div>
        
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm neu-flat">
          <span
            className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 glow-green' : 'bg-gray-400'}`}
          />
          <span className={isConnected ? 'text-emerald-400' : 'text-subtle'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </span>
      </div>

      {/* Diagnostics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="neu-flat p-5">
          <h3 className="text-xs text-subtle uppercase tracking-widest mb-3">Connection Diagnostics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-subtle text-sm">WebSocket Status</span>
              <span className={`text-sm font-bold ${isConnected ? 'text-emerald-400' : 'text-red-400'}`}>{isConnected ? 'Active & Stable' : 'Disconnected'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-subtle text-sm">Last Packet Received</span>
              <span className="text-sm font-bold text-main">{latest ? new Date(latest.recordedAt).toLocaleTimeString() : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-subtle text-sm">Data Source Mode</span>
              <Badge label={viewMode} variant={viewMode} />
            </div>
          </div>
        </div>
        <div className="neu-flat p-5">
          <h3 className="text-xs text-subtle uppercase tracking-widest mb-3">Alert Threshold Configuration</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-subtle text-sm">Max Humidity (%)</span>
              <input type="number" className="neu-pressed w-16 px-2 py-1 text-xs text-right" value={thresholds.humidityMax} onChange={(e) => setThresholds({...thresholds, humidityMax: Number(e.target.value)})} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-subtle text-sm">Min Temp (°C)</span>
              <input type="number" className="neu-pressed w-16 px-2 py-1 text-xs text-right" value={thresholds.tempMin} onChange={(e) => setThresholds({...thresholds, tempMin: Number(e.target.value)})} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-subtle text-sm">Max Wind (m/s)</span>
              <input type="number" className="neu-pressed w-16 px-2 py-1 text-xs text-right" value={thresholds.windMax} onChange={(e) => setThresholds({...thresholds, windMax: Number(e.target.value)})} />
            </div>
          </div>
        </div>
      </div>

      {/* Top charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="neu-flat p-5">
          <p className="text-xs text-subtle uppercase tracking-widest mb-1">Live Temperature</p>
          <p className="grad-text-temp text-sm font-semibold mb-3">Last 30 readings</p>
          <TemperatureChart data={chartData} />
        </div>
        <div className="neu-flat p-5 flex flex-col items-center justify-center">
          <p className="text-xs text-subtle uppercase tracking-widest mb-1 self-start">Wind Compass</p>
          <p className="grad-text-wind text-sm font-semibold mb-4 self-start">Live direction & speed</p>
          <WindCompass
            direction={latest?.windDirection ?? 0}
            speed={latest?.windSpeed ?? 0}
          />
        </div>
      </div>

      {/* Live wind speed */}
      <div className="neu-flat p-5">
        <p className="text-xs text-subtle uppercase tracking-widest mb-1">Wind Speed</p>
        <p className="grad-text-wind text-sm font-semibold mb-3">m/s — last 30 readings</p>
        <WindSpeedChart data={chartData} />
      </div>

      {/* Live feed table */}
      {observations.length === 0 ? (
        <EmptyState
          title="Waiting for observations"
          description="Start a data collection session to see the live stream."
        />
      ) : (
        <div className="neu-flat p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-subtle uppercase tracking-widest">Live Feed</p>
            <span className="text-xs text-subtle">{observations.length} observations</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-main">
              <thead>
                <tr className="text-muted text-xs border-b border-[var(--table-border)]">
                  <th className="text-left pb-2">Time</th>
                  <th className="text-right pb-2">Alt (m)</th>
                  <th className="text-right pb-2">Temp (°C)</th>
                  <th className="text-right pb-2">Press (hPa)</th>
                  <th className="text-right pb-2">Hum (%)</th>
                  <th className="text-right pb-2">Wind (m/s)</th>
                  <th className="text-right pb-2">Dir (°)</th>
                  <th className="text-right pb-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {observations.map((obs, i) => (
                  <tr
                    key={obs._id || i}
                    className={`border-b border-[var(--table-border)] hover:bg-[var(--table-hover)] ${
                      i === 0 ? 'bg-[var(--table-hover)]' : ''
                    }`}
                  >
                    <td className="py-2 text-subtle">{formatDate(obs.recordedAt)}</td>
                    <td className="text-right"><span className="grad-text-altitude">{obs.altitude?.toFixed(0)}</span></td>
                    <td className="text-right"><span className="grad-text-temp">{obs.temperature?.toFixed(1)}</span></td>
                    <td className="text-right"><span className="grad-text-pressure">{obs.pressure?.toFixed(1)}</span></td>
                    <td className="text-right"><span className="grad-text-humidity">{obs.humidity?.toFixed(1)}</span></td>
                    <td className="text-right"><span className="grad-text-wind">{obs.windSpeed?.toFixed(1)}</span></td>
                    <td className="text-right text-muted">{obs.windDirection?.toFixed(0)}°</td>
                    <td className="text-right"><Badge label={obs.source} variant={obs.source} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}




