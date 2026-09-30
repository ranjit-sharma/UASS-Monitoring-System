const fs = require('fs');
const file = 'client/src/views/LoginPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("text-white dark-active-text ", "");

fs.writeFileSync(file, content, 'utf8');
