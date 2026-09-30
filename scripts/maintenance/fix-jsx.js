const fs = require('fs');
const dashFile = 'client/src/views/DashboardPage.jsx';
let dashContent = fs.readFileSync(dashFile, 'utf8');

dashContent = dashContent.replace(/<Badge label="Live Session" variant="running" \/>\{\/\* Start\/Stop Session Text Buttons \*\/\}/g, '<Badge label="Live Session" variant="running" />}\n{/* Start/Stop Session Text Buttons */}');

fs.writeFileSync(dashFile, dashContent, 'utf8');
