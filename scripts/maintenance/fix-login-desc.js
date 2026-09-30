const fs = require('fs');
const file = 'client/src/views/LoginPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/Upper Air Sounding System\.<br\/>\s*Advanced Real-Time Telemetry & Environmental Monitoring\./g, 'Upper Air Sounding System.<br/><br/>Welcome to the central command hub. This advanced telemetry suite provides real-time atmospheric tracking, live environmental payload monitoring, and historical flight data analysis all in one seamless interface.');

fs.writeFileSync(file, content, 'utf8');
