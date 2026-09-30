const fs = require('fs');
const file = 'client/src/views/LoginPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /style=\{\{\s*background:\s*'var\(--accent-primary\)'\s*\}\}/g;
content = content.replace(regex, "style={{ background: 'var(--accent-primary)', color: 'var(--neu-bg)' }}");

fs.writeFileSync(file, content, 'utf8');
