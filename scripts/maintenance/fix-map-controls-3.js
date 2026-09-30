const fs = require('fs');
const file = 'client/src/views/FlightTrackingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* Advanced Map Controls Overlay \*\/\}[\s\S]*?<\/div>/;
const replacement = "{/* Advanced Map Controls Overlay */}\n" +
'        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 p-2 bg-[var(--neu-surface)]/60 backdrop-blur-xl border border-[var(--border-subtle)]/50 rounded-xl shadow-xl shadow-black/5">\n' +
'          <button \n' +
'            onClick={() => setIsAutoPanEnabled(!isAutoPanEnabled)}\n' +
'            className={"px-3 py-2 flex items-center gap-2 rounded-lg text-xs font-bold transition-all hover:scale-105 " + (isAutoPanEnabled ? \'bg-emerald-500/90 text-white shadow-md shadow-emerald-500/20 dark-active-text\' : \'hover:bg-[var(--neu-surface-raised)]/80 text-main\')}\n' +
'          >\n' +
'            <span className="text-sm">{isAutoPanEnabled ? String.fromCodePoint(0x1F3AF) : String.fromCodePoint(0x26F6)}</span>\n' +
'            {isAutoPanEnabled ? \'Auto-Center: ON\' : \'Auto-Center: OFF\'}\n' +
'          </button>\n' +
'          \n' +
'          <button \n' +
'            onClick={() => setShowTrajectory(!showTrajectory)}\n' +
'            className="px-3 py-2 flex items-center gap-2 rounded-lg text-xs font-bold transition-all hover:scale-105 hover:bg-[var(--neu-surface-raised)]/80 text-main"\n' +
'          >\n' +
'            <span className="text-sm">{showTrajectory ? String.fromCodePoint(0x1F441, 0xFE0F) : String.fromCodePoint(0x1F6E4, 0xFE0F)}</span>\n' +
'            {showTrajectory ? \'Hide Path\' : \'Show Path\'}\n' +
'          </button>\n' +
'          \n' +
'          <button \n' +
'            onClick={handleFitBounds}\n' +
'            className="px-3 py-2 flex items-center gap-2 rounded-lg text-xs font-bold transition-all hover:scale-105 bg-[var(--accent-primary)]/90 text-white shadow-md shadow-[var(--accent-primary)]/20 dark-active-text hover:bg-[var(--accent-primary)]"\n' +
'          >\n' +
'            <span className="text-sm">{String.fromCodePoint(0x1F50D)}</span>\n' +
'            Fit Bounds\n' +
'          </button>\n' +
'        </div>';

content = content.replace(regex, replacement);
fs.writeFileSync(file, content, 'utf8');
