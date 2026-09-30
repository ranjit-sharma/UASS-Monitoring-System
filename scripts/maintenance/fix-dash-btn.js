const fs = require('fs');
const file = 'client/src/views/DashboardPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Use a wildcard to replace the corrupted characters before " Stop Session"
content = content.replace(/[^>]*Stop Session/g, '⏹️ Stop Session');
content = content.replace(/[^>]*Start Session/g, '▶️ Start Session');

fs.writeFileSync(file, content, 'utf8');
