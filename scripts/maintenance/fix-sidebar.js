const fs = require('fs');
const file = 'client/src/components/layout/Sidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/icon: 'ðŸŒ '/g, "icon: String.fromCodePoint(0x1F30D)"); // Globe
content = content.replace(/icon: 'ðŸ“¡'/g, "icon: String.fromCodePoint(0x1F4E1)"); // Satellite
content = content.replace(/icon: 'ðŸ—ºï¸ '/g, "icon: String.fromCodePoint(0x1F5FA, 0xFE0F)"); // Map
content = content.replace(/icon: 'ðŸ—‚ï¸ '/g, "icon: String.fromCodePoint(0x1F5C2, 0xFE0F)"); // Folders
content = content.replace(/icon: 'ðŸ”§'/g, "icon: String.fromCodePoint(0x1F527)"); // Wrench
content = content.replace(/icon: 'ðŸ‘¥'/g, "icon: String.fromCodePoint(0x1F465)"); // Users
content = content.replace(/icon: 'ðŸ“œ'/g, "icon: String.fromCodePoint(0x1F4DC)"); // Scroll

fs.writeFileSync(file, content, 'utf8');
