const fs = require('fs');

// 1. Update LoginPage.jsx
const loginFile = 'client/src/views/LoginPage.jsx';
let loginContent = fs.readFileSync(loginFile, 'utf8');

// Replace "Mission<br />Control" with "UASS<br />Monitor"
loginContent = loginContent.replace(
  />\s*Mission<br \/>Control\s*<\/h1>/,
  '>UASS<br />Monitor</h1>'
);
// Replace mobile header
loginContent = loginContent.replace(
  />Mission Control<\/h1>/,
  '>UASS Monitor</h1>'
);

fs.writeFileSync(loginFile, loginContent, 'utf8');

// 2. Update Logo.jsx
const logoFile = 'client/src/components/common/Logo.jsx';
let logoContent = fs.readFileSync(logoFile, 'utf8');

// Replace the inner content of Logo component
const logoRegex = /<div\s*className={`neu-flat flex items-center justify-center shrink-0 rounded-2xl \$\{iconSizes\[size\]\}`\}[\s\S]*?<\/div>/;

const attractiveLogo = `<div
        className={\`flex items-center justify-center shrink-0 rounded-2xl \${iconSizes[size]} relative overflow-hidden shadow-md shadow-[var(--accent-primary)]/40\`}
        style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
      >
        <div className="absolute inset-0 bg-white/20 blur-md rounded-full scale-150 -top-1/2 -left-1/2" />
        <svg
          className="w-[55%] h-[55%] relative z-10 text-white drop-shadow-md"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Sleek Weather Balloon SVG */}
          <path d="M12 2C8.68629 2 6 4.68629 6 8C6 11.75 11.5 18 12 18C12.5 18 18 11.75 18 8C18 4.68629 15.3137 2 12 2Z" fill="rgba(255,255,255,0.2)"/>
          <path d="M12 18V21" />
          <rect x="10" y="21" width="4" height="2" rx="0.5" fill="currentColor" />
          <path d="M7 7.5C7 7.5 9 8.5 12 8.5C15 8.5 17 7.5 17 7.5" opacity="0.6" strokeWidth="1.5" />
        </svg>
      </div>`;

logoContent = logoContent.replace(logoRegex, attractiveLogo);

fs.writeFileSync(logoFile, logoContent, 'utf8');

