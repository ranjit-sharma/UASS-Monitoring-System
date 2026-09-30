import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const THEMES = [
  { id: 'glass', name: 'Glassmorphism', icon: '✨' },
  { id: 'neu', name: 'Neumorphism', icon: '🌑' },
  { id: 'clay', name: 'Claymorphism', icon: '☁️' },
  { id: 'material', name: 'Material Design', icon: '📱' },
  { id: 'bento', name: 'Bento UI', icon: '🍱' },
];

export function ThemeProvider({ children }) {
  const [uiStyle, setUiStyle] = useState(() => {
    return localStorage.getItem('uass_ui_style') || 'neu';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('uass_dark_mode') === 'true';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-style', uiStyle);
    localStorage.setItem('uass_ui_style', uiStyle);
  }, [uiStyle]);

  useEffect(() => {
    document.documentElement.setAttribute('data-dark', isDarkMode.toString());
    localStorage.setItem('uass_dark_mode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const changeStyle = (newStyle) => {
    setUiStyle(newStyle);
  };

  return (
    <ThemeContext.Provider value={{ uiStyle, changeStyle, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
