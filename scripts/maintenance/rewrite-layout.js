const fs = require('fs');
let content = fs.readFileSync('client/src/components/layout/AppLayout.jsx', 'utf8');

// Add import
if (!content.includes('import { ThemeSwitcher }')) {
  content = content.replace("import { Sidebar } from '../../Sidebar.jsx';", "import { Sidebar } from '../../Sidebar.jsx';\nimport { ThemeSwitcher } from '../../../common/ThemeSwitcher.jsx';");
}

// Replace mobile header
const headerRegex = /\{\/\* Mobile Header \*\/\}\s*<div className="md:hidden neu-flat p-4 flex items-center justify-between sticky top-0 z-40 bg-\[var\(--neu-bg\)\]">[\s\S]*?<\/button>\s*<\/div>/;

content = content.replace(headerRegex, {/* Global Header */}
        <div className="neu-flat p-4 flex items-center justify-between sticky top-0 z-40 bg-[var(--neu-bg)] border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-subtle hover:text-main">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            </button>
            <div className="md:hidden w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white font-bold">U</div>
            <span className="md:hidden font-bold text-main">UASS</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="w-64">
              <ThemeSwitcher />
            </div>
          </div>
        </div>);

fs.writeFileSync('client/src/components/layout/AppLayout.jsx', content, 'utf8');
