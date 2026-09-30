const fs = require('fs');
const file = 'client/src/components/layout/Sidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const NAV_ITEMS = \[[\s\S]*?\];/;
const replacement = "const NAV_ITEMS = [\n" +
"  { to: '/dashboard',    label: 'Dashboard',     icon: String.fromCodePoint(0x1F30D), roles: ['admin', 'operator', 'viewer'] },\n" +
"  { to: '/monitoring',   label: 'Live Monitor',  icon: String.fromCodePoint(0x1F4E1), roles: ['admin', 'operator', 'viewer'] },\n" +
"  { to: '/tracking',     label: 'Flight Track',  icon: String.fromCodePoint(0x1F5FA, 0xFE0F), roles: ['admin', 'operator', 'viewer'] },\n" +
"  { to: '/observations', label: 'Observations',  icon: String.fromCodePoint(0x1F5C2, 0xFE0F), roles: ['admin', 'operator', 'viewer'] },\n" +
"  { to: '/collections',  label: 'Data Collect',  icon: String.fromCodePoint(0x26A1),  roles: ['admin', 'operator'] },\n" +
"  { to: '/users',        label: 'Users',         icon: String.fromCodePoint(0x1F465),  roles: ['admin'] },\n" +
"  { to: '/audit-logs',   label: 'Audit Logs',    icon: String.fromCodePoint(0x1F50D),  roles: ['admin'] },\n" +
"];";

content = content.replace(regex, replacement);
fs.writeFileSync(file, content, 'utf8');
