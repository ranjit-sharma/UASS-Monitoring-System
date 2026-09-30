const fs = require('fs');
const file = 'client/src/views/DashboardPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/icon="ðŸŒ¡ï¸ "/g, 'icon="🌡️"');
content = content.replace(/icon="â˜ ï¸ "/g, 'icon="☁️"');
content = content.replace(/icon="â ±ï¸ "/g, 'icon="⏱️"');
content = content.replace(/:\ 'â€”'/g, ": '—'");
content = content.replace(/: 'â€”'/g, ": '—'");
content = content.replace(/return 'â€”'/g, "return '—'");
content = content.replace(/â–¶ï¸ /g, "▶️");

fs.writeFileSync(file, content, 'utf8');
