const fs = require('fs');
const file = 'client/src/views/FlightTrackingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* Advanced Map Controls Overlay \*\/\}[\s\S]*?<\/div>/;
const replacement = \{/* Advanced Map Controls Overlay */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 p-2 bg-[var(--neu-surface)]/40 backdrop-blur-xl border border-[var(--border-subtle)]/50 rounded-xl shadow-xl shadow-black/5">
          <button 
            onClick={() => setIsAutoPanEnabled(!isAutoPanEnabled)}
            className={"px-3 py-2 flex items-center gap-2 rounded-lg text-xs font-bold transition-all hover:scale-105 " + (isAutoPanEnabled ? 'bg-emerald-500/90 text-white shadow-md shadow-emerald-500/20 dark-active-text' : 'hover:bg-[var(--neu-surface-raised)]/80 text-main')}
          >
            <span className="text-sm">{isAutoPanEnabled ? '\\uD83C\\uDFAF' : '\\u26F6'}</span>
            {isAutoPanEnabled ? 'Auto-Center: ON' : 'Auto-Center: OFF'}
          </button>
          
          <button 
            onClick={() => setShowTrajectory(!showTrajectory)}
            className="px-3 py-2 flex items-center gap-2 rounded-lg text-xs font-bold transition-all hover:scale-105 hover:bg-[var(--neu-surface-raised)]/80 text-main"
          >
            <span className="text-sm">{showTrajectory ? '\\uD83D\\uDC41\\uFE0F' : '\\uD83D\\uDEE4\\uFE0F'}</span>
            {showTrajectory ? 'Hide Path' : 'Show Path'}
          </button>
          
          <button 
            onClick={handleFitBounds}
            className="px-3 py-2 flex items-center gap-2 rounded-lg text-xs font-bold transition-all hover:scale-105 bg-[var(--accent-primary)]/90 text-white shadow-md shadow-[var(--accent-primary)]/20 dark-active-text hover:bg-[var(--accent-primary)]"
          >
            <span className="text-sm">\\uD83D\\uDD0D</span>
            Fit Bounds
          </button>
        </div>\;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content, 'utf8');
