const fs = require('fs');
const file = 'client/src/components/layout/Sidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

// Fix LIVE mode text and emoji
content = content.replace(
  /<span className="text-\[10px\] font-bold text-emerald-500">[^<]+<\/span>/g,
  '<span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">🔌 LIVE</span>'
);

// Fix DUMMY mode text and emoji
content = content.replace(
  /<span className="text-\[10px\] font-bold text-amber-500">[^<]+<\/span>/g,
  '<span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">🧪 DUMMY</span>'
);

// Also fix bullet point just in case it's corrupted
content = content.replace(/<span className="text-subtle text-\[10px\]">[^<]+<\/span>/g, '<span className="text-subtle text-[10px]">•</span>');

fs.writeFileSync(file, content, 'utf8');
