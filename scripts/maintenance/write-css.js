const fs = require('fs');

const cssContent = 
@import "tailwindcss";

/* Base Light Mode - Grayscale/Neutral base */
:root {
  --neu-bg: #f5f5f5;
  --neu-surface: #ffffff;
  --neu-surface-raised: #e5e5e5;
  --neu-shadow-dark: #d4d4d4;
  --neu-shadow-light: #ffffff;

  --text-main: #171717;
  --text-muted: #737373;
  --text-subtle: #404040;
  --border-subtle: #d4d4d4;
  --table-border: #e5e5e5;
  --table-hover: rgba(0, 0, 0, 0.05);

  --accent-primary: #404040;
  --accent-secondary: #737373;
  
  --card-radius: 1rem;
  --card-border: 1px solid var(--border-subtle);
  --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --card-backdrop: none;
  
  --metric-temp: #ef4444;
  --metric-pressure: #0ea5e9;
  --metric-humidity: #10b981;
  --metric-wind: #8b5cf6;
  --metric-alt: #3b82f6;
}

/* Base Dark Mode - Grayscale (No Blue!) */
[data-dark="true"] {
  --neu-bg: #111111;
  --neu-surface: #1f1f1f;
  --neu-surface-raised: #262626;
  --neu-shadow-dark: #0a0a0a;
  --neu-shadow-light: #303030;

  --text-main: #f5f5f5;
  --text-muted: #a3a3a3;
  --text-subtle: #d4d4d4;
  --border-subtle: #404040;
  --table-border: #262626;
  --table-hover: rgba(255, 255, 255, 0.05);

  --accent-primary: #d4d4d4;
  --accent-secondary: #a3a3a3;
  
  --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  
  --metric-temp: #f87171;
  --metric-pressure: #38bdf8;
  --metric-humidity: #34d399;
  --metric-wind: #a78bfa;
  --metric-alt: #60a5fa;
}

/* 1. GLASSMORPHISM */
[data-style="glass"] {
  --card-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  --card-backdrop: blur(12px);
  --card-border: 1px solid rgba(255, 255, 255, 0.2);
  --accent-primary: #3b82f6;
}
[data-style="glass"][data-dark="true"] {
  --card-border: 1px solid rgba(255, 255, 255, 0.05);
  --card-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  --neu-surface: rgba(31, 31, 31, 0.6);
  --neu-bg: #111111; /* fallback */
  background-image: radial-gradient(circle at top right, #262626, #111111);
}
[data-style="glass"]:not([data-dark="true"]) {
  --neu-surface: rgba(255, 255, 255, 0.6);
  background-image: radial-gradient(circle at top right, #ffffff, #e5e5e5);
}

/* 2. NEUMORPHISM */
[data-style="neu"] {
  --card-radius: 1.25rem;
  --card-border: none;
  --card-shadow: 8px 8px 16px var(--neu-shadow-dark), -8px -8px 16px var(--neu-shadow-light);
}

/* 3. CLAYMORPHISM */
[data-style="clay"] {
  --card-radius: 2rem;
  --card-border: none;
  --card-shadow: 8px 8px 16px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(0,0,0,0.05), inset 4px 4px 8px rgba(255,255,255,0.8);
  --accent-primary: #f43f5e;
}
[data-style="clay"][data-dark="true"] {
  --card-shadow: 8px 8px 16px rgba(0,0,0,0.4), inset -4px -4px 8px rgba(0,0,0,0.3), inset 4px 4px 8px rgba(255,255,255,0.1);
}

/* 4. FLAT DESIGN */
[data-style="flat"] {
  --card-radius: 0px;
  --card-border: 2px solid var(--text-main);
  --card-shadow: none;
  --accent-primary: #2563eb;
}

/* 5. MATERIAL DESIGN */
[data-style="material"] {
  --card-radius: 0.25rem;
  --card-border: none;
  --card-shadow: 0 2px 1px -1px rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 1px 3px 0 rgba(0,0,0,0.12);
  --accent-primary: #6200ea;
}
[data-style="material"][data-dark="true"] {
  --card-shadow: 0 2px 1px -1px rgba(0,0,0,0.6), 0 1px 1px 0 rgba(0,0,0,0.4);
}

/* 6. BENTO UI */
[data-style="bento"] {
  --card-radius: 1.5rem;
  --card-border: 1px solid var(--border-subtle);
  --card-shadow: none;
  --accent-primary: #10b981;
}

/* 7. CYBERPUNK */
[data-style="cyberpunk"] {
  --card-radius: 0px;
  --card-border: 1px solid #0ff;
  --card-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
  --accent-primary: #0ff;
  --text-main: #0ff;
  --text-subtle: #f0f;
  --neu-bg: #050505;
  --neu-surface: #0a0a0a;
}
[data-style="cyberpunk"][data-dark="true"] {
  --neu-bg: #000000;
  --neu-surface: #0a0a0a;
  --text-main: #0ff;
  --text-subtle: #f0f;
  --border-subtle: #0ff;
  --card-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
}

/* COMPONENT MAPPINGS (Preserving existing class names) */
body {
  background-color: var(--neu-bg);
  color: var(--text-main);
  transition: background-color 0.3s, color 0.3s;
}

.neu-flat {
  background: var(--neu-surface);
  border-radius: var(--card-radius);
  border: var(--card-border);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--card-backdrop);
  transition: all 0.3s ease;
}

.neu-pressed {
  background: var(--neu-surface-raised);
  border-radius: calc(var(--card-radius) * 0.75);
  border: var(--card-border);
  box-shadow: inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light);
  transition: all 0.3s ease;
}
[data-style="flat"] .neu-pressed,
[data-style="material"] .neu-pressed,
[data-style="bento"] .neu-pressed,
[data-style="cyberpunk"] .neu-pressed {
  box-shadow: none;
}
[data-style="glass"] .neu-pressed {
  box-shadow: none;
  background: rgba(0, 0, 0, 0.1);
}

.neu-button {
  background: var(--neu-surface);
  border-radius: var(--card-radius);
  border: var(--card-border);
  box-shadow: var(--card-shadow);
  color: var(--text-main);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}
.neu-button:hover {
  transform: translateY(-2px);
}
.neu-button:active {
  box-shadow: inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light);
  transform: translateY(0);
}
[data-style="flat"] .neu-button,
[data-style="bento"] .neu-button {
  background: var(--neu-surface-raised);
}
[data-style="cyberpunk"] .neu-button {
  background: transparent;
  color: #0ff;
  border: 1px solid #0ff;
  text-shadow: 0 0 5px #0ff;
}
[data-style="cyberpunk"] .neu-button:hover {
  background: rgba(0, 255, 255, 0.1);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
}

.grad-text-primary {
  background: linear-gradient(to right, var(--text-main), var(--text-subtle));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.grad-text-altitude {
  background: linear-gradient(to right, var(--metric-alt), var(--text-main));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Keep original layout helpers */
.active { color: var(--accent-primary) !important; font-weight: bold; }
;

fs.writeFileSync('client/src/index.css', cssContent, 'utf8');
