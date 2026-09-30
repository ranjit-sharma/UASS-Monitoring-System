const fs = require('fs');
const file = 'client/src/components/layout/Sidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the literal corrupted chars or whatever they are with safe unicode escapes
content = content.replace(
  /<span className="text-\[10px\] font-bold text-emerald-600 dark:text-emerald-400">.*?<\/span>/g,
  `<span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">${String.fromCodePoint(0x1F50C)} LIVE</span>`
);

content = content.replace(
  /<span className="text-\[10px\] font-bold text-amber-600 dark:text-amber-400">.*?<\/span>/g,
  `<span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">${String.fromCodePoint(0x1F9EA)} DUMMY</span>`
);

content = content.replace(
  /<span className="text-subtle text-\[10px\]">.*?<\/span>/g,
  `<span className="text-subtle text-[10px]">&bull;</span>`
);

fs.writeFileSync(file, content, 'utf8');
