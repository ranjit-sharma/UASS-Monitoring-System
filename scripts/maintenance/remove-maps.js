const fs = require('fs');
const file = 'client/src/views/FlightTrackingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const regexMapTypes = /const mapTypes = \{[\s\S]*?\};/;
const replacementMapTypes = `const mapTypes = {
  osm: { name: 'OpenStreetMap', url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; OpenStreetMap' },
  satellite: { name: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', overlayUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', attribution: '&copy; Esri' }
};`;
content = content.replace(regexMapTypes, replacementMapTypes);

const regexLogic = /const \{ isDarkMode \} = useTheme\(\);[\s\S]*?\}, \[isDarkMode\]\);/;
const replacementLogic = `const [selectedMapType, setSelectedMapType] = useState('osm');`;
content = content.replace(regexLogic, replacementLogic);

// Remove useTheme import since we don't need it anymore
content = content.replace(/import \{ useTheme \} from '\.\.\/context\/ThemeContext\.jsx';\n?/, '');

fs.writeFileSync(file, content, 'utf8');
