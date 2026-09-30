const fs = require('fs');
const file = 'client/src/views/LoginPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/>[^>]*Live Mode/g, '>\n                  🔌 Live Mode');
content = content.replace(/>[^>]*Dummy Data/g, '>\n                  🧪 Dummy Data');
content = content.replace(/Secure Access Portal[^v]*v2\.4\.0/g, 'Secure Access Portal • v2.4.0');

fs.writeFileSync(file, content, 'utf8');
