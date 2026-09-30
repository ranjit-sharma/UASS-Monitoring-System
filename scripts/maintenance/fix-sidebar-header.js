const fs = require('fs');
const file = 'client/src/components/layout/Sidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove from bottom
content = content.replace(/<ThemeSwitcher \/>\s+/, '');

// Add to top beside Mode
content = content.replace(
  /\{\/\* Current Data Mode Indicator \*\/\}[\s\S]*?<\/div>\s+<\/div>/,
  {/* Header Controls: Mode + Theme */}
        <div className="mt-4 mb-2 flex justify-center items-center gap-2">
          <div className="neu-pressed px-3 py-1.5 rounded-full flex items-center gap-2" title={\Currently viewing \ data\}>
            <span className="text-[10px] uppercase font-bold tracking-widest text-subtle">Mode</span>
            <span className="text-subtle text-[10px]">•</span>
            {dataSourceMode === 'instrument' ? (
              <span className="text-xs font-bold text-emerald-500">🔌 LIVE</span>
            ) : (
              <span className="text-xs font-bold text-amber-500">🧪 DUMMY</span>
            )}
          </div>
          <div className="w-10 h-8"><ThemeSwitcher /></div>
        </div>
);

fs.writeFileSync(file, content, 'utf8');
