const fs = require('fs');
let content = fs.readFileSync('client/src/index.css', 'utf8');

// Improve Dark Mode Contrast
content = content.replace(/\[data-dark="true"\] \{[\s\S]*?\}/, "[data-dark=\"true\"] {\n  --neu-bg: #111111;\n  --neu-surface: #1f1f1f;\n  --neu-surface-raised: #262626;\n  --neu-shadow-dark: #0a0a0a;\n  --neu-shadow-light: #303030;\n\n  --text-main: #ffffff;\n  --text-muted: #d4d4d4;\n  --text-subtle: #a3a3a3;\n  --border-subtle: #525252;\n  --table-border: #262626;\n  --table-hover: rgba(255, 255, 255, 0.1);\n\n  --accent-primary: #ffffff;\n  --accent-secondary: #e5e5e5;\n  \n  --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.6);\n  \n  --metric-temp: #f87171;\n  --metric-pressure: #38bdf8;\n  --metric-humidity: #34d399;\n  --metric-wind: #a78bfa;\n  --metric-alt: #60a5fa;\n}");

// Remove flat and cyberpunk
content = content.replace(/\/\* 4\. FLAT DESIGN \*\/[\s\S]*?\/\* 5\. MATERIAL DESIGN \*\//, '/* 5. MATERIAL DESIGN */');
content = content.replace(/\/\* 7\. CYBERPUNK \*\/[\s\S]*?\/\* COMPONENT MAPPINGS/, '/* COMPONENT MAPPINGS');
content = content.replace(/\[data-style="flat"\] \.neu-pressed,[\s\S]*?\[data-style="cyberpunk"\] \.neu-pressed \{/g, '[data-style="material"] .neu-pressed,\n[data-style="bento"] .neu-pressed {');
content = content.replace(/\[data-style="flat"\] \.neu-button,\s*\[data-style="bento"\] \.neu-button \{/g, '[data-style="bento"] .neu-button {');
content = content.replace(/\[data-style="cyberpunk"\] \.neu-button \{[\s\S]*?\}\s*\[data-style="cyberpunk"\] \.neu-button:hover \{[\s\S]*?\}/g, '');

fs.writeFileSync('client/src/index.css', content, 'utf8');
