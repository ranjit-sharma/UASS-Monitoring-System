const fs = require('fs');
const file = 'client/src/views/DashboardPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/>▶️ Start Session'\}/g, '>▶️ Start Session');
fs.writeFileSync(file, content, 'utf8');
