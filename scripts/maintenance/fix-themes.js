const fs = require('fs');
let content = fs.readFileSync('client/src/context/ThemeContext.jsx', 'utf8');

// Remove Flat Design and Cyberpunk
content = content.replace(/\s*\{ id: 'flat', name: 'Flat Design', icon: '📐' \},/g, '');
content = content.replace(/\s*\{ id: 'cyberpunk', name: 'Cyberpunk', icon: '⚡' \},/g, '');

fs.writeFileSync('client/src/context/ThemeContext.jsx', content, 'utf8');
