const fs = require('fs');
const file = 'client/src/views/LoginPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const plug = String.fromCodePoint(0x1F50C);
const tube = String.fromCodePoint(0x1F9EA);
const bullet = String.fromCodePoint(0x2022);

content = content.replace(/>[^>]*Live Mode/g, '>\n                  ' + plug + ' Live Mode');
content = content.replace(/>[^>]*Dummy Data/g, '>\n                  ' + tube + ' Dummy Data');
content = content.replace(/Secure Access Portal[^v]*v2\.4\.0/g, 'Secure Access Portal ' + bullet + ' v2.4.0');

fs.writeFileSync(file, content, 'utf8');
