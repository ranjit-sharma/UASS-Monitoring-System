const fs = require('fs');

// Restore Sidebar.jsx
let sidebar = fs.readFileSync('client/src/components/layout/Sidebar.jsx', 'utf8');

sidebar = sidebar.replace(/{[\s\S]*?🔌 LIVE[\s\S]*?DUMMY[\s\S]*?ThemeSwitcher \/>[\s\S]*?<\/div>[\s\S]*?<\/div>/, `{/* Current Data Mode Indicator */}
      <div className="mt-4 mb-2 flex justify-center">
        <div className="neu-pressed px-4 py-1.5 rounded-full flex items-center gap-2" title={\`Currently viewing \${dataSourceMode} data\`}>
          <span className="text-[10px] uppercase font-bold tracking-widest text-subtle">Mode</span>
          <span className="text-subtle text-[10px]">•</span>
          {dataSourceMode === 'instrument' ? (
            <span className="text-xs font-bold text-emerald-500">🔌 LIVE</span>
          ) : (
            <span className="text-xs font-bold text-amber-500">🧪 DUMMY</span>
          )}
        </div>
      </div>`);

sidebar = sidebar.replace(/<div className="neu-flat p-3 rounded-xl">/, `<div className="shrink-0 flex flex-col gap-3">
        <ThemeSwitcher />

        <div className="neu-flat p-3 rounded-xl">`);

fs.writeFileSync('client/src/components/layout/Sidebar.jsx', sidebar, 'utf8');

// Restore ThemeSwitcher.jsx
const themeSwitcherContent = `import { useTheme, THEMES } from '../../../../context/ThemeContext.jsx';
import { Palette, Moon, Sun, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function ThemeSwitcher() {
  const { uiStyle, changeStyle, isDarkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full neu-flat p-3 flex items-center justify-between rounded-xl hover:bg-[var(--neu-surface-raised)] transition-all"
        title="Change Theme"
      >
        <div className="flex items-center gap-2 text-main">
          <Palette size={18} />
          <span className="text-sm font-bold">Theme</span>
        </div>
        <div className="text-xs text-subtle font-bold uppercase tracking-wider">
          {THEMES.find(t => t.id === uiStyle)?.name}
        </div>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full p-2 neu-flat rounded-2xl shadow-2xl z-[10001] flex flex-col gap-1 border border-[var(--border-subtle)] max-h-[60vh] overflow-y-auto">
          <div className="p-2 flex items-center justify-between border-b border-[var(--border-subtle)] mb-1">
            <span className="text-xs font-bold text-subtle uppercase tracking-widest">Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className={\`w-10 h-5 rounded-full relative transition-colors \${isDarkMode ? 'bg-emerald-500' : 'bg-gray-400'}\`}
            >
              <div className={\`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform \${isDarkMode ? 'translate-x-5' : 'translate-x-0'} flex items-center justify-center\`}>
                {isDarkMode ? <Moon size={10} className="text-emerald-500" /> : <Sun size={10} className="text-gray-400" />}
              </div>
            </button>
          </div>
          
          <div className="p-2 pb-1 text-xs font-bold text-subtle uppercase tracking-widest">
            Select Theme
          </div>

          {THEMES.map((t) => {
            const isActive = uiStyle === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { changeStyle(t.id); setIsOpen(false); }}
                className={\`flex items-center justify-between p-3 rounded-xl transition-all \${isActive ? 'bg-[var(--accent-primary)] text-white dark-active-bg dark-active-text' : 'hover:bg-[var(--neu-surface-raised)] text-main'}\`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{t.icon}</span>
                  <span className={\`text-sm font-semibold \${isActive ? 'text-white dark-active-text' : 'text-main'}\`}>{t.name}</span>
                </div>
                {isActive && <Check size={16} className={isActive ? 'text-white dark-active-text' : 'text-main'} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('client/src/components/common/ThemeSwitcher.jsx', themeSwitcherContent, 'utf8');

// Restore DashboardPage.jsx toggleFullScreen
let dash = fs.readFileSync('client/src/views/DashboardPage.jsx', 'utf8');
dash = dash.replace(/async function handleStop\(sessionId\) {[\s\S]*?catch \(err\) \{ toast\.error\(err\.message\); setStopConfirmId\(null\); \}\n  }/, `async function handleStop(sessionId) {
    try { 
      await collectionService.stop(sessionId); 
      setStopConfirmId(null); 
      await refetch();
      toast.success('Session stopped');
    }
    catch (err) { toast.error(err.message); setStopConfirmId(null); }
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        toast.error(\`Error attempting to enable fullscreen mode: \${err.message}\`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }`);

dash = dash.replace(/<div className="flex items-center gap-4">\s*\{summary\?.activeSession/, `<div className="flex items-center gap-4">
            <button 
              onClick={toggleFullScreen}
              title="Toggle Full Screen Monitoring"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 shrink-0"
              style={{
                background: 'var(--neu-surface)',
                boxShadow: 'var(--card-shadow)'
              }}
            >
              <span className="text-lg">⛶</span>
            </button>
            
            {summary?.activeSession`);

fs.writeFileSync('client/src/views/DashboardPage.jsx', dash, 'utf8');

