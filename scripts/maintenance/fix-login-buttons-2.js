const fs = require('fs');
const file = 'client/src/views/LoginPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace both buttons manually using precise replacement
const blockStart = `<div className="flex gap-2 bg-[var(--neu-surface-raised)] p-1.5 rounded-xl border border-[var(--border-subtle)]">`;

const newBlock = `<div className="flex gap-2 bg-[var(--neu-surface-raised)] p-1.5 rounded-xl border border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => setDataSourceMode('instrument')}
                    className="flex-1 py-2 text-xs font-bold rounded-lg transition-all hover:scale-[1.02]"
                    style={{
                      background: dataSourceMode === 'instrument' ? 'var(--accent-primary)' : 'transparent',
                      color: dataSourceMode === 'instrument' ? 'var(--neu-bg)' : 'var(--text-subtle)',
                      boxShadow: dataSourceMode === 'instrument' ? '0 4px 6px -1px rgba(0,0,0,0.2)' : 'none'
                    }}
                  >
                    🔌 Live Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setDataSourceMode('simulated')}
                    className="flex-1 py-2 text-xs font-bold rounded-lg transition-all hover:scale-[1.02]"
                    style={{
                      background: dataSourceMode === 'simulated' ? 'var(--accent-primary)' : 'transparent',
                      color: dataSourceMode === 'simulated' ? 'var(--neu-bg)' : 'var(--text-subtle)',
                      boxShadow: dataSourceMode === 'simulated' ? '0 4px 6px -1px rgba(0,0,0,0.2)' : 'none'
                    }}
                  >
                    🧪 Dummy Data
                  </button>
                </div>`;

const regex = /<div className="flex gap-2 bg-\[var\(--neu-surface-raised\)\].*?<\/div>/s;
content = content.replace(regex, newBlock);

fs.writeFileSync(file, content, 'utf8');
