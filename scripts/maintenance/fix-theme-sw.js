const fs = require('fs');
const content = `import { useTheme, THEMES } from '../../../../context/ThemeContext.jsx';
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
    <div className="relative flex items-center justify-center" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="neu-pressed w-8 h-8 rounded-full flex items-center justify-center text-main hover:text-[var(--accent-primary)] transition-all"
        title="Change Theme"
      >
        <Palette size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 p-2 neu-flat rounded-2xl shadow-2xl z-[10001] flex flex-col gap-1 border border-[var(--border-subtle)] max-h-[60vh] overflow-y-auto">
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
                className={\`flex items-center justify-between p-3 rounded-xl transition-all \${isActive ? 'bg-[var(--accent-primary)] text-white' : 'hover:bg-[var(--neu-surface-raised)] text-main'}\`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{t.icon}</span>
                  <span className={\`text-sm font-semibold \${isActive ? 'text-white' : 'text-main'}\`}>{t.name}</span>
                </div>
                {isActive && <Check size={16} className={isActive ? 'text-white' : 'text-main'} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('client/src/components/common/ThemeSwitcher.jsx', content, 'utf8');
