const fs = require('fs');
const file = 'client/src/views/FlightTrackingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update mapTypes
content = content.replace(
  /satellite: \{ name: 'Satellite', url: 'https:\/\/server\.arcgisonline\.com[^}]+ \},/,
  "satellite: { name: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', overlayUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', attribution: '&copy; Esri' },"
);

// 2. Add L.divIcon setup before the render
content = content.replace(
  /const latest = pathData\[pathData\.length - 1\];/,
  "const latest = pathData[pathData.length - 1];\n  const pulsatingIcon = useMemo(() => new L.divIcon({\n    className: 'pulsating-dot',\n    html: '<div class=\"ring\"></div><div class=\"circle\"></div>',\n    iconSize: [24, 24],\n    iconAnchor: [12, 12]\n  }), []);"
);

// 3. Update Map rendering
const mapRenderStart = /\{\s*mapTypes\[selectedMapType\]\.isMBTiles[\s\S]*?(?=\{\s*showTrajectory)/;
const newMapRender = {mapTypes[selectedMapType].isMBTiles ? (
              <MBTilesLayer url={mapTypes[selectedMapType].url} />
            ) : (
              <>
                <TileLayer url={mapTypes[selectedMapType].url} attribution={mapTypes[selectedMapType].attribution} />
                {mapTypes[selectedMapType].overlayUrl && (
                  <TileLayer url={mapTypes[selectedMapType].overlayUrl} zIndex={10} />
                )}
              </>
            )}
            
            ;
content = content.replace(mapRenderStart, newMapRender);

// 4. Update the latest marker
const latestMarkerStart = /\{\s*latest && \([\s\S]*?<\/CircleMarker>\s*\)\}/;
const newLatestMarker = {latest && (
              <Marker position={[latest.latitude, latest.longitude]} icon={pulsatingIcon}>
                <Popup>
                  <strong>Current Location</strong><br/>
                  Altitude: {latest.altitude?.toFixed(0)} m<br/>
                  Time: {new Date(latest.recordedAt).toLocaleTimeString()}
                </Popup>
              </Marker>
            )};
content = content.replace(latestMarkerStart, newLatestMarker);

fs.writeFileSync(file, content, 'utf8');
