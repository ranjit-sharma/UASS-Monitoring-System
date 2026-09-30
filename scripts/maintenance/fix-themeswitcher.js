const fs = require('fs');
const file = 'client/src/components/common/ThemeSwitcher.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /className=\{`flex items-center justify-between p-3 rounded-xl transition-all \$\{[\s\S]*?isActive \? 'bg-\[var\(--accent-primary\)\] text-white dark-active-bg dark-active-text' : 'hover:bg-\[var\(--neu-surface-raised\)\] text-main'[\s\S]*?\}`\}/g,
  `className={\`flex items-center justify-between p-3 rounded-xl transition-all \${isActive ? 'shadow-md' : 'hover:bg-[var(--neu-surface-raised)] text-main'}\`}
                  style={isActive ? { background: 'var(--accent-primary)', color: 'var(--neu-bg)' } : {}}`
);

content = content.replace(
  /<span className=\{`text-sm font-semibold \$\{isActive \? 'text-white dark-active-text' : 'text-main'\}`\}>\{t\.name\}<\/span>/g,
  `<span className="text-sm font-semibold">{t.name}</span>`
);

fs.writeFileSync(file, content, 'utf8');
