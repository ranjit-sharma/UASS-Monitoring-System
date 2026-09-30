const fs = require('fs');

// Fix DashboardPage Stop Session Icon
const dashFile = 'client/src/views/DashboardPage.jsx';
let dashContent = fs.readFileSync(dashFile, 'utf8');
dashContent = dashContent.replace(/â ¹ï¸ /g, "⏹️"); // Stop Button Emoji
fs.writeFileSync(dashFile, dashContent, 'utf8');

// Fix LiveMonitoringPage Payload Alpha/Beta Dropdown
const liveFile = 'client/src/views/LiveMonitoringPage.jsx';
let liveContent = fs.readFileSync(liveFile, 'utf8');
const payloadRegex = /<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm neu-flat"><span className="text-subtle font-bold">Payload:<\/span><select[^>]*><option>PAYLOAD-ALPHA<\/option><option>PAYLOAD-BETA<\/option><\/select><\/span>\s*/;
liveContent = liveContent.replace(payloadRegex, '');
fs.writeFileSync(liveFile, liveContent, 'utf8');
