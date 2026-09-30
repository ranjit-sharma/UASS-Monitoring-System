const fs = require('fs');

// Fix Sidebar active links
const sidebarFile = 'client/src/components/layout/Sidebar.jsx';
let sidebarContent = fs.readFileSync(sidebarFile, 'utf8');
sidebarContent = sidebarContent.replace(
  /className=\{.*?cn\('flex items-center gap-3 px-3 py-2 rounded-xl transition-all font-semibold text-sm', isActive \? 'bg-\[var\(--accent-primary\)\] text-white dark-active-text shadow-md scale-\[1\.02\]' : 'neu-flat text-subtle hover:text-main'\)\}/g,
  `className={({ isActive }) => cn('flex items-center gap-3 px-3 py-2 rounded-xl transition-all font-semibold text-sm', isActive ? 'shadow-md scale-[1.02]' : 'neu-flat text-subtle hover:text-main')} style={({ isActive }) => (isActive ? { background: 'var(--accent-primary)', color: 'var(--neu-bg)' } : {})}`
);
fs.writeFileSync(sidebarFile, sidebarContent, 'utf8');


// Fix Flight Tracking Page buttons
const flightFile = 'client/src/views/FlightTrackingPage.jsx';
let flightContent = fs.readFileSync(flightFile, 'utf8');

// Fix Fit Bounds button
flightContent = flightContent.replace(
  /className="px-3 py-2 flex items-center gap-2 rounded-lg text-xs font-bold transition-all hover:scale-105 bg-\[var\(--accent-primary\)\]\/90 text-white shadow-md shadow-\[var\(--accent-primary\)\]\/20 dark-active-text hover:bg-\[var\(--accent-primary\)\]"/g,
  `className="px-3 py-2 flex items-center gap-2 rounded-lg text-xs font-bold transition-all hover:scale-105 shadow-md shadow-[var(--accent-primary)]/20"\n            style={{ background: 'var(--accent-primary)', color: 'var(--neu-bg)' }}`
);

// Fix Auto-Center button
flightContent = flightContent.replace(
  /className=\{"px-3 py-2 flex items-center gap-2 rounded-lg text-xs font-bold transition-all hover:scale-105 " \+ \(isAutoPanEnabled \? 'bg-emerald-500\/90 text-white shadow-md shadow-emerald-500\/20 dark-active-text' : 'hover:bg-\[var\(--neu-surface-raised\)\]\/80 text-main'\)\}/g,
  `className={"px-3 py-2 flex items-center gap-2 rounded-lg text-xs font-bold transition-all hover:scale-105 " + (isAutoPanEnabled ? 'shadow-md shadow-emerald-500/20' : 'hover:bg-[var(--neu-surface-raised)]/80 text-main')}
            style={isAutoPanEnabled ? { background: '#10b981', color: '#ffffff' } : {}}`
);
fs.writeFileSync(flightFile, flightContent, 'utf8');

