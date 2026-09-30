const fs = require('fs');

const badgePath = 'client/src/components/common/Badge.jsx';
let badgeContent = fs.readFileSync(badgePath, 'utf8');

badgeContent = badgeContent.replace(/const variants = \{[\s\S]*?\};/, "const variants = {\n  running: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',\n  completed: 'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300 border-slate-200 dark:border-slate-700',\n  failed: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',\n  idle: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',\n  simulated: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',\n  instrument: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800',\n  manual: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800',\n  admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',\n  operator: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800',\n  viewer: 'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300 border-slate-200 dark:border-slate-700',\n};");
fs.writeFileSync(badgePath, badgeContent, 'utf8');

const userPath = 'client/src/views/UserManagementPage.jsx';
let userContent = fs.readFileSync(userPath, 'utf8');
userContent = userContent.replace(/Verified âœ“/g, 'Verified ✓');
userContent = userContent.replace(/Unverified â ³/g, 'Unverified ⏳');
fs.writeFileSync(userPath, userContent, 'utf8');

const logsPath = 'client/src/views/AuditLogsPage.jsx';
let logsContent = fs.readFileSync(logsPath, 'utf8');
logsContent = logsContent.replace(/âœ“/g, '✓');
logsContent = logsContent.replace(/â ³/g, '⏳');
logsContent = logsContent.replace(/âš ï¸ /g, '⚠️');
logsContent = logsContent.replace(/ðŸ›¡ï¸ /g, '🛡️');
fs.writeFileSync(logsPath, logsContent, 'utf8');
