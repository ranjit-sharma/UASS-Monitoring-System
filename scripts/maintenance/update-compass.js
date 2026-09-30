const fs = require('fs');
let content = fs.readFileSync('client/src/components/charts/WindCompass.jsx', 'utf8');

const beaufortFunc = 
function getBeaufort(speedMs) {
  if (speedMs < 0.3) return 'Calm';
  if (speedMs < 1.6) return 'Light Air';
  if (speedMs < 3.4) return 'Light Breeze';
  if (speedMs < 5.5) return 'Gentle Breeze';
  if (speedMs < 8.0) return 'Mod Breeze';
  if (speedMs < 10.8) return 'Fresh Breeze';
  if (speedMs < 13.9) return 'Strong Breeze';
  if (speedMs < 17.2) return 'Near Gale';
  if (speedMs < 20.8) return 'Gale';
  if (speedMs < 24.5) return 'Strong Gale';
  if (speedMs < 28.5) return 'Storm';
  if (speedMs < 32.7) return 'Violent Storm';
  return 'Hurricane';
}
;

content = content.replace('function getCardinal(deg) {', beaufortFunc + 'function getCardinal(deg) {');

const historyState = 
  const [displayDir, setDisplayDir] = useState(direction);
  const prevDirRef = useRef(direction);
  const [dirHistory, setDirHistory] = useState([]);

  useEffect(() => {
    setDirHistory(prev => [...prev.slice(-15), direction]);
  }, [direction]);
;
content = content.replace('  const [displayDir, setDisplayDir] = useState(direction);\n  const prevDirRef = useRef(direction);', historyState);

const svgFeatures = 
        {/* Historical Trail */}
        {dirHistory.map((histDir, i) => {
          const opacity = (i + 1) / dirHistory.length;
          const rad = degToRad(histDir - 90);
          const tr = r - 16;
          return (
            <circle key={i} cx={cx + tr * Math.cos(rad)} cy={cy + tr * Math.sin(rad)} r={3} fill="#ff6b6b" opacity={opacity * 0.5} />
          );
        })}

        {/* Center Digital Display (Hollow Center) */}
        <circle cx={cx} cy={cy} r={28} fill="var(--neu-bg)" stroke="var(--border-subtle)" strokeWidth={1} filter="url(#needleGlow)" />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#ff6b6b" fontSize={11} fontWeight={800}>{Math.round(direction)}�</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#cc5de8" fontSize={9} fontWeight={600}>{speed?.toFixed(1)} m/s</text>
        <text x={cx} y={cy + 18} textAnchor="middle" fill="var(--text-subtle)" fontSize={7} fontWeight={500}>{getBeaufort(speed)}</text>
      </svg>
;

content = content.replace(/        \{\/\* Center hub \*\/\}[\s\S]*?<\/svg>/, svgFeatures);
content = content.replace(/°/g, '�');

fs.writeFileSync('client/src/components/charts/WindCompass.jsx', content, 'utf8');
