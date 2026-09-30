const fs = require('fs');
const dashFile = 'client/src/views/DashboardPage.jsx';
let dashContent = fs.readFileSync(dashFile, 'utf8');

dashContent = dashContent.replace(/⏹️ Stop Session Text Buttons \*\/\}/g, "{/* Start/Stop Session Text Buttons */}");

fs.writeFileSync(dashFile, dashContent, 'utf8');
