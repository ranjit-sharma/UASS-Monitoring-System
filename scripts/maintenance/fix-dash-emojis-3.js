const fs = require('fs');
const file = 'client/src/views/DashboardPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/orbClass="orb-temp" icon="[^"]+"/g, 'orbClass="orb-temp" icon="🌡️"');
content = content.replace(/orbClass="orb-pressure" icon="[^"]+"/g, 'orbClass="orb-pressure" icon="☁️"');
content = content.replace(/orbClass="orb-primary" icon="[^"]+"/g, 'orbClass="orb-primary" icon="⏱️"');

fs.writeFileSync(file, content, 'utf8');
