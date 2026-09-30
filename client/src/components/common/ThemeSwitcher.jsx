import { useTheme, THEMES } from '../../context/ThemeContext.jsx';
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
        className="h-8 w-10 neu-flat flex items-center justify-center rounded-full hover:bg-[var(--neu-surface-raised)] transition-all text-main"
        title="Change Theme"
      >
        <Palette size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-2 neu-flat rounded-2xl shadow-2xl z-[10001] flex flex-col gap-1 border border-[var(--border-subtle)] max-h-[60vh] overflow-y-auto">
          <div className="p-2 flex items-center justify-between border-b border-[var(--border-subtle)] mb-1">
            <span className="text-xs font-bold text-subtle uppercase tracking-widest">Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-emerald-500' : 'bg-gray-400'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0'} flex items-center justify-center`}>
                {isDarkMode ? <Moon size={10} className="text-emerald-500" /> : <Sun size={10} className="text-gray-400" />}
              </div>
            </button>
          </div>
          
          <div className="p-2 pb-1 text-xs font-bold text-subtle uppercase tracking-widest">
            Themes
          </div>

          {THEMES.map((t) => {
            const isActive = uiStyle === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { changeStyle(t.id); setIsOpen(false); }}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${isActive ? 'shadow-md' : 'hover:bg-[var(--neu-surface-raised)] text-main'}`}
                  style={isActive ? { background: 'var(--accent-primary)', color: 'var(--neu-bg)' } : {}}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{t.icon}</span>
                  <span className="text-sm font-semibold">{t.name}</span>
                </div>
                {isActive && <Check size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
