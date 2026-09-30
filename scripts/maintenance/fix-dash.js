const fs = require('fs');

const path = 'client/src/views/DashboardPage.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/ðŸŒ¡ï¸ /g, '🌡️');
content = content.replace(/â˜ ï¸ /g, '☁️');
content = content.replace(/ðŸ’§/g, '💧');
content = content.replace(/ðŸ’¨/g, '💨');
content = content.replace(/ðŸ“¡/g, '📡');
content = content.replace(/ðŸ§­/g, '🧭');
content = content.replace(/ðŸ“Š/g, '📊');
content = content.replace(/â ±ï¸ /g, '⏱️');
content = content.replace(/â€”/g, '—');
content = content.replace(/â›¶/g, '⚙️');
content = content.replace(/â ¹/g, '⏹');
content = content.replace(/â ³/g, '⏳');
content = content.replace(/â–▶/g, '▶');
content = content.replace(/â–¶/g, '▶');
content = content.replace(/âš ï¸ /g, '⚠️');
content = content.replace(/â „ï¸ /g, '❄️');
content = content.replace(/ðŸŒªï¸ /g, '🌪️');
content = content.replace(/Â°C/g, '°C');
content = content.replace(/Â°/g, '°');

fs.writeFileSync(path, content, 'utf8');
