const fs = require('fs');
const file = 'client/src/views/LoginPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Fix dummy data and live mode emojis
content = content.replace(/ðŸ”Œ/g, '🔌');
content = content.replace(/ðŸ§ª/g, '🧪');
// Also fix bullet points
content = content.replace(/â€¢/g, '•');

fs.writeFileSync(file, content, 'utf8');
