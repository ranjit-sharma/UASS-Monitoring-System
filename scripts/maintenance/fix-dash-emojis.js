const fs = require('fs');
const file = 'client/src/views/DashboardPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/Â°/g, '°');
content = content.replace(/ðŸŒ¡ï¸ /g, String.fromCodePoint(0x1F321, 0xFE0F)); // Thermometer
content = content.replace(/â˜ ï¸ /g, String.fromCodePoint(0x2601, 0xFE0F)); // Cloud
content = content.replace(/ðŸ’§/g, String.fromCodePoint(0x1F4A7)); // Droplet
content = content.replace(/ðŸ’¨/g, String.fromCodePoint(0x1F4A8)); // Dashing Away
content = content.replace(/ðŸ“¡/g, String.fromCodePoint(0x1F4E1)); // Satellite Antenna
content = content.replace(/â ±ï¸ /g, String.fromCodePoint(0x23F1, 0xFE0F)); // Stopwatch

fs.writeFileSync(file, content, 'utf8');
