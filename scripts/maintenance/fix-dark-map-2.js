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
const replacement = "const { isDarkMode } = useTheme();\n" +
"  const [selectedMapType, setSelectedMapType] = useState(isDarkMode ? 'dark' : 'osm');\n" +
"  \n" +
"  useEffect(() => {\n" +
"    if (isDarkMode && selectedMapType === 'osm') setSelectedMapType('dark');\n" +
"    if (!isDarkMode && selectedMapType === 'dark') setSelectedMapType('osm');\n" +
"  }, [isDarkMode]);";
content = content.replace(hookRegex, replacement);

fs.writeFileSync(file, content, 'utf8');
