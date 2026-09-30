const fs = require('fs');
const file = 'client/src/components/layout/Sidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/âš¡/g, '⚡');
content = content.replace(/ðŸ‘¥/g, '👥');
content = content.replace(/ðŸ” /g, '🔍');
content = content.replace(/â€¢/g, '•');
content = content.replace(/ðŸ”Œ/g, '🔌');
content = content.replace(/ðŸ§ª/g, '🧪');
content = content.replace(/ðŸ””/g, '🔔');

fs.writeFileSync(file, content, 'utf8');
