const fs = require('fs');
const file = 'client/src/components/layout/Sidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const NAV_ITEMS = \[[\s\S]*?\];/;
const replacement = const NAV_ITEMS = [
  { to: '/dashboard',    label: 'Dashboard',     icon: String.fromCodePoint(0x1F30D), roles: ['admin', 'operator', 'viewer'] },
  { to: '/monitoring',   label: 'Live Monitor',  icon: String.fromCodePoint(0x1F4E1), roles: ['admin', 'operator', 'viewer'] },
  { to: '/tracking',     label: 'Flight Track',  icon: String.fromCodePoint(0x1F5FA, 0xFE0F), roles: ['admin', 'operator', 'viewer'] },
  { to: '/observations', label: 'Observations',  icon: String.fromCodePoint(0x1F5C2, 0xFE0F), roles: ['admin', 'operator', 'viewer'] },
  { to: '/collections',  label: 'Data Collect',  icon: String.fromCodePoint(0x26A1),  roles: ['admin', 'operator'] },
  { to: '/users',        label: 'Users',         icon: String.fromCodePoint(0x1F465),  roles: ['admin'] },
  { to: '/audit-logs',   label: 'Audit Logs',    icon: String.fromCodePoint(0x1F50D),  roles: ['admin'] },
];;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content, 'utf8');
