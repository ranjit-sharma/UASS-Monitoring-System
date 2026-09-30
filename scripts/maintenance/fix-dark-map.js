const fs = require('fs');
const file = 'client/src/views/FlightTrackingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
content = content.replace(
  "import { useAuth } from '../../../context/AuthContext.jsx';",
  "import { useAuth } from '../../../context/AuthContext.jsx';\nimport { useTheme } from '../../../context/ThemeContext.jsx';"
);

// Add hook & effect
const hookRegex = /const \[selectedMapType, setSelectedMapType\] = useState\('osm'\);/;
const replacement = \const { isDarkMode } = useTheme();
  const [selectedMapType, setSelectedMapType] = useState(isDarkMode ? 'dark' : 'osm');
  
  useEffect(() => {
    if (isDarkMode && selectedMapType === 'osm') setSelectedMapType('dark');
    if (!isDarkMode && selectedMapType === 'dark') setSelectedMapType('osm');
  }, [isDarkMode]);\;
content = content.replace(hookRegex, replacement);

fs.writeFileSync(file, content, 'utf8');
