const fs = require('fs');
const path = require('path');

const replacements = {
  'ðŸŒ¡ï¸ ': '🌡️',
  'â˜ ï¸ ': '☁️',
  'ðŸ’§': '💧',
  'ðŸ’¨': '💨',
  'ðŸ“¡': '📡',
  'ðŸ§­': '🧭',
  'ðŸ“Š': '📊',
  'â ±ï¸ ': '⏱️',
  'â€”': '—',
  'â›¶': '⚙️',
  'â ¹': '⏹',
  'â ³': '⏳',
  'â–¶': '▶',
  'âš ï¸ ': '⚠️',
  'â „ï¸ ': '❄️',
  'ðŸŒªï¸ ': '🌪️',
  'Â°C': '°C',
  'Â°': '°',
  'ðŸŒ ': '🌍',
  'ðŸ—ºï¸ ': '🗺️',
  'ðŸ—‚ï¸ ': '🗂️',
  'âš¡': '⚡',
  'ðŸ‘¥': '👥',
  'ðŸ” ': '🔍'
};

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walkDir(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walkDir('client/src');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  for (const [corrupt, fixed] of Object.entries(replacements)) {
    if (content.includes(corrupt)) {
      content = content.split(corrupt).join(fixed);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
  }
}
