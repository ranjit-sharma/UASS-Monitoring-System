const fs = require('fs');

const content = import { MapContainer, TileLayer, Marker, Polyline, Popup, CircleMarker } from 'react-leaflet';
import { useLiveObservations } from '../../../controllers/useLiveObservations.js';
import { useDataSource } from '../../../context/DataSourceContext.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useDashboard } from '../../../controllers/useDashboard.js';
import { collectionService } from '../../../models/collectionService.js';
import { observationService } from '../../../models/observationService.js';
import { Badge } from '../../../components/common/Badge.jsx';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog.jsx';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';

function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))); 
}

import * as L from 'leaflet';
import { MBTiles } from 'leaflet-tilelayer-mbtiles-ts';
import { useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState, useMemo } from 'react';
import { AltitudeProfileChart } from '../../../components/charts/AltitudeProfileChart.jsx';

function MapEvents({ center, isAutoPanEnabled, setIsAutoPanEnabled }) {
  const map = useMap();
  useMapEvents({ dragstart: () => { if (isAutoPanEnabled) setIsAutoPanEnabled(false); } });
  useEffect(() => { setTimeout(() => { map.invalidateSize(); }, 200); }, [map]);
  useEffect(() => { if (center && isAutoPanEnabled) map.flyTo(center, map.getZoom(), { animate: true, duration: 1.5 }); }, [center, isAutoPanEnabled, map]);
  return null;
}

function MBTilesLayer({ url }) {
  const map = useMap();
  useEffect(() => {
    if (!url) return;
    try {
      const layer = new MBTiles(url, { minZoom: 0, maxZoom: 18 }).addTo(map);
      return () => map.removeLayer(layer);
    } catch (e) {}
  }, [map, url]);
  return null;
}

export function FlightTrackingPage() {
  const liveObs = useLiveObservations();
  const { dataSourceMode } = useDataSource();
  const { summary, refetch } = useDashboard();
  const { user } = useAuth();
  const canControl = user?.role === 'admin' || user?.role === 'operator';
  const [isStarting, setIsStarting] = useState(false);
  const [stopConfirmId, setStopConfirmId] = useState(null);

  const mapTypes = {
    osm: { name: 'OpenStreetMap', url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap' },
    dark: { name: 'Dark Map', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attribution: '&copy; OpenStreetMap &copy; CARTO' },
    satellite: { name: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: '&copy; Esri' },
    offline: { name: 'Offline (MBTiles)', url: '/offline-maps/countries.mbtiles', isMBTiles: true }
  };
  const [selectedMapType, setSelectedMapType] = useState('osm');
  const [mapInstance, setMapInstance] = useState(null);
  const [isAutoPanEnabled, setIsAutoPanEnabled] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(true);

  // Playback States
  const [playbackMode, setPlaybackMode] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [playbackData, setPlaybackData] = useState([]);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (playbackMode) {
      collectionService.list({ limit: 50 }).then(res => setSessions(res.data)).catch(console.error);
    } else {
      setIsPlaying(false);
      setPlaybackData([]);
    }
  }, [playbackMode]);

  useEffect(() => {
    if (playbackMode && selectedSessionId) {
      setIsPlaying(false);
      setPlaybackData([]);
      observationService.list({ sessionId: selectedSessionId, limit: 5000 }).then(res => {
        setPlaybackData([...res.data].reverse()); // Observations might come newest-first, we need oldest-first for playback
        setPlaybackIndex(0);
      }).catch(console.error);
    }
  }, [selectedSessionId, playbackMode]);

  useEffect(() => {
    let timer;
    if (isPlaying && playbackData.length > 0) {
      timer = setInterval(() => {
        setPlaybackIndex(prev => {
          if (prev >= playbackData.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 500); // 2x speed playback
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackData]);

  const pathData = useMemo(() => {
    if (playbackMode) {
      return playbackData.slice(0, playbackIndex + 1).filter(obs => obs.latitude != null && obs.longitude != null);
    }
    return [...liveObs]
      .filter(obs => obs.source === dataSourceMode && obs.latitude != null && obs.longitude != null)
      .reverse(); 
  }, [liveObs, dataSourceMode, playbackMode, playbackData, playbackIndex]);

  const latest = pathData[pathData.length - 1];
  const start = pathData[0];
  const positions = pathData.map(obs => [obs.latitude, obs.longitude]);
  const distanceKm = start && latest ? calculateDistance(start.latitude, start.longitude, latest.latitude, latest.longitude) : 0;

  let ascentRate = 0;
  if (pathData.length >= 2) {
    const p1 = pathData[pathData.length - 2];
    const p2 = pathData[pathData.length - 1];
    const dt = (new Date(p2.recordedAt) - new Date(p1.recordedAt)) / 1000;
    if (dt > 0) ascentRate = (p2.altitude - p1.altitude) / dt;
  }

  function handleFitBounds() {
    if (mapInstance && positions.length > 0) {
      mapInstance.fitBounds(positions, { padding: [50, 50] });
      setIsAutoPanEnabled(false);
    }
  }

  async function handleStart() {
    setIsStarting(true);
    try { 
      await collectionService.start({ sessionName: 'Flight Tracking ' + new Date().toLocaleString() }); 
      await refetch();
      toast.success('Session started');
    } catch (err) { toast.error(err.message); }
    finally { setIsStarting(false); }
  }

  async function handleStop(sessionId) {
    try { 
      await collectionService.stop(sessionId); 
      setStopConfirmId(null); 
      await refetch();
      toast.success('Session stopped');
    } catch (err) { toast.error(err.message); setStopConfirmId(null); }
  }

  return (
    <div className="p-6 space-y-6 flex flex-col h-full min-h-screen" style={{ background: 'var(--neu-bg)' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div>
          <h1 className="text-2xl font-bold text-main">Flight Tracking</h1>
          <p className="text-subtle text-sm mt-0.5">Real-time balloon location and path</p>
        </div>
        
        <div className="flex items-center flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-subtle font-bold">Map Source:</span>
            <select
              value={selectedMapType}
              onChange={(e) => setSelectedMapType(e.target.value)}
              className="neu-pressed px-3 py-1.5 text-xs font-bold rounded-lg text-main outline-none focus:ring-2 focus:ring-[var(--accent-primary)] cursor-pointer"
            >
              {Object.entries(mapTypes).map(([key, type]) => (
                <option key={key} value={key}>{type.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPlaybackMode(!playbackMode)} 
              className={"px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all " + (playbackMode ? "bg-amber-500/20 text-amber-500 border border-amber-500/50" : "neu-button text-subtle")}
            >
              {playbackMode ? '⏪ Exit Playback' : '⏪ Time Machine'}
            </button>
            {playbackMode && (
              <select 
                value={selectedSessionId} 
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="neu-pressed px-3 py-1.5 text-xs font-bold rounded-lg text-main outline-none"
              >
                <option value="">Select Session...</option>
                {sessions.map(s => <option key={s._id} value={s._id}>{s.sessionName}</option>)}
              </select>
            )}
          </div>

          {latest && (
            <div className="flex gap-4">
              <div className="neu-flat px-4 py-2 text-right">
                <p className="text-[10px] uppercase tracking-widest text-subtle">Altitude</p>
                <p className="text-lg font-bold grad-text-altitude">{latest.altitude?.toFixed(0)} m</p>
              </div>
              <div className="neu-flat px-4 py-2 text-right">
                <p className="text-[10px] uppercase tracking-widest text-subtle">Ground Distance</p>
                <p className="text-lg font-bold grad-text-primary">{distanceKm.toFixed(2)} km</p>
              </div>
              <div className="neu-flat px-4 py-2 text-right">
                <p className="text-[10px] uppercase tracking-widest text-subtle">Ascent Rate</p>
                <p className={"text-lg font-bold " + (ascentRate >= 0 ? 'text-emerald-400' : 'text-orange-400')}>
                  {ascentRate >= 0 ? '▲' : '▼'} {Math.abs(ascentRate).toFixed(1)} m/s
                </p>
              </div>
            </div>
          )}

          {!playbackMode && canControl && (
            <div className="flex items-center gap-2 shrink-0">
              {summary?.activeSession && <Badge label="Live Session" variant="running" />}
              <div className="flex rounded-xl gap-2">
                {summary?.activeSession ? (
                  <button onClick={() => setStopConfirmId(summary.activeSession.id)} className="px-4 py-2 rounded-xl flex items-center justify-center font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all hover:scale-105 shrink-0" style={{ background: 'linear-gradient(135deg, #ff6b6b, #fa5252)' }}>
                    ⏹ Stop
                  </button>
                ) : (
                  <button onClick={handleStart} disabled={isStarting} className="px-4 py-2 rounded-xl flex items-center justify-center font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all hover:scale-105 disabled:opacity-50 shrink-0" style={{ background: 'linear-gradient(135deg, #51cf66, #40c057)' }}>
                    {isStarting ? '⏳ Starting...' : '▶ Start'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {playbackMode && playbackData.length > 0 && (
        <div className="neu-flat p-4 rounded-xl flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg hover:scale-105 transition-transform"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <div className="flex-1 flex flex-col gap-1">
              <input 
                type="range" 
                min={0} 
                max={playbackData.length - 1} 
                value={playbackIndex} 
                onChange={(e) => { setPlaybackIndex(parseInt(e.target.value)); setIsPlaying(false); }}
                className="w-full cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-subtle font-bold">
                <span>{new Date(playbackData[0].recordedAt).toLocaleTimeString()}</span>
                <span className="text-main">{latest ? new Date(latest.recordedAt).toLocaleTimeString() : ''}</span>
                <span>{new Date(playbackData[playbackData.length-1].recordedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 neu-flat p-2 rounded-2xl relative z-10 flex flex-col" style={{ minHeight: '500px', height: '60vh' }}>
        
        {/* Advanced Map Controls Overlay */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
          <button 
            onClick={() => setIsAutoPanEnabled(!isAutoPanEnabled)}
            className={"px-3 py-2 rounded-lg text-xs font-bold shadow-md transition-colors border " + (isAutoPanEnabled ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-gray-800/90 text-gray-300 border-gray-600 hover:bg-gray-700')}
          >
            {isAutoPanEnabled ? '🎯 Auto-Center: ON' : '⛶ Auto-Center: OFF'}
          </button>
          
          <button 
            onClick={() => setShowTrajectory(!showTrajectory)}
            className="px-3 py-2 rounded-lg text-xs font-bold shadow-md bg-gray-800/90 text-gray-300 border border-gray-600 hover:bg-gray-700 transition-colors"
          >
            {showTrajectory ? '👁️ Hide Path' : '🛤️ Show Path'}
          </button>
          
          <button 
            onClick={handleFitBounds}
            className="px-3 py-2 rounded-lg text-xs font-bold shadow-md bg-blue-500/90 text-white border border-blue-400 hover:bg-blue-400 transition-colors"
          >
            🔍 Fit Bounds
          </button>
        </div>

        {positions.length > 0 ? (
          <MapContainer 
            ref={setMapInstance}
            center={positions[positions.length - 1]} 
            zoom={12} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%', borderRadius: '0.75rem', minHeight: '480px' }}
          >
            <MapEvents 
              center={positions[positions.length - 1]} 
              isAutoPanEnabled={isAutoPanEnabled}
              setIsAutoPanEnabled={setIsAutoPanEnabled}
            />
            
            {mapTypes[selectedMapType].isMBTiles ? (
              <MBTilesLayer url={mapTypes[selectedMapType].url} />
            ) : (
              <TileLayer url={mapTypes[selectedMapType].url} attribution={mapTypes[selectedMapType].attribution} />
            )}
            
            {showTrajectory && (
              <Polyline positions={positions} color="var(--accent-primary, #3b82f6)" weight={4} opacity={0.7} />
            )}
            
            {start && (
              <CircleMarker center={[start.latitude, start.longitude]} radius={6} color="#10b981" fillColor="#10b981" fillOpacity={1}>
                <Popup>Launch Point<br/>{new Date(start.recordedAt).toLocaleTimeString()}</Popup>
              </CircleMarker>
            )}

            {latest && (
              <CircleMarker center={[latest.latitude, latest.longitude]} radius={8} color="#ef4444" fillColor="#ef4444" fillOpacity={1}>
                <Popup>
                  <div className="text-xs">
                    <b>Current Position</b><br/>
                    Lat: {latest.latitude}<br/>
                    Lng: {latest.longitude}<br/>
                    Alt: {latest.altitude}m<br/>
                    Speed: {latest.windSpeed}m/s
                  </div>
                </Popup>
              </CircleMarker>
            )}
          </MapContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-subtle">
            <p className="text-4xl mb-2">🗺️</p>
            <p>No location data available.</p>
          </div>
        )}
      </div>

      <div className="neu-flat p-4 rounded-2xl h-[300px]">
        <h3 className="text-main font-bold mb-2">Altitude Profile & Ascent Dynamics</h3>
        <AltitudeProfileChart data={pathData} />
      </div>

      <ConfirmDialog isOpen={!!stopConfirmId} title="Stop Collection Session"
        message="Stop the active data collection session?"
        confirmLabel="Stop" danger
        onConfirm={() => handleStop(stopConfirmId)}
        onCancel={() => setStopConfirmId(null)} />
    </div>
  );
}
;

fs.writeFileSync('client/src/views/FlightTrackingPage.jsx', content, 'utf8');
