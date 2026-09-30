const fs = require('fs');
const file = 'client/src/views/LoginPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// I will just use regex to replace anything resembling the label
content = content.replace(/>[^>]*Live Mode/g, '> 🔌 Live Mode');
content = content.replace(/>[^>]*Dummy Data/g, '> 🧪 Dummy Data');
content = content.replace(/placeholder="[^"]+"/g, 'placeholder="••••••••"');
content = content.replace(/>[^>]*v2\.4\.0/g, '>Secure Access Portal • v2.4.0');

fs.writeFileSync(file, content, 'utf8');
