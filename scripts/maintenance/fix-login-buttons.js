const fs = require('fs');
const file = 'client/src/views/LoginPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Live Mode button
content = content.replace(
  /className=\{`flex-1 py-2 text-xs font-bold rounded-lg transition-all \$\{[\s\S]*?\}\`/g,
  `className="flex-1 py-2 text-xs font-bold rounded-lg transition-all hover:scale-[1.02]"
                    style={{
                      background: dataSourceMode === 'instrument' ? 'var(--accent-primary)' : 'transparent',
                      color: dataSourceMode === 'instrument' ? 'var(--neu-bg)' : 'var(--text-subtle)',
                      boxShadow: dataSourceMode === 'instrument' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                    }}`
);

// Dummy Data button (Wait, the regex above will match BOTH if I'm not careful. Let's use a replacer function!)
fs.writeFileSync(file, content, 'utf8');
