// PWA Icon Generator for Agriculture AI
// Run: node create-pwa-icons.js

const fs = require('fs');
const path = require('path');

const iconDir = path.join(__dirname, 'client', 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// SVG icon template (agricultural wheat symbol)
function generateSVG(size, maskable = false) {
  const padding = maskable ? size * 0.1 : 0;
  const contentSize = size - (padding * 2);
  const scale = contentSize / 300;
  const centerX = size / 2;
  const centerY = size / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${size}${maskable ? 'm' : ''}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2d5016;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4a7c2c;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  ${maskable 
    ? `<rect width="${size}" height="${size}" fill="url(#grad${size}m)"/>`
    : `<circle cx="${centerX}" cy="${centerY}" r="${size / 2}" fill="url(#grad${size})"/>`
  }
  
  <g transform="translate(${centerX}, ${centerY}) scale(${scale})">
    <!-- Wheat stem -->
    <line x1="0" y1="60" x2="0" y2="-80" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
    
    <!-- Left wheat grains -->
    <ellipse cx="-15" cy="-60" rx="12" ry="18" fill="#ffffff" transform="rotate(30 -15 -60)"/>
    <ellipse cx="-15" cy="-35" rx="12" ry="18" fill="#ffffff" transform="rotate(30 -15 -35)"/>
    <ellipse cx="-15" cy="-10" rx="12" ry="18" fill="#ffffff" transform="rotate(30 -15 -10)"/>
    <ellipse cx="-15" cy="15" rx="12" ry="18" fill="#ffffff" transform="rotate(30 -15 15)"/>
    <ellipse cx="-15" cy="40" rx="12" ry="18" fill="#ffffff" transform="rotate(30 -15 40)"/>
    
    <!-- Right wheat grains -->
    <ellipse cx="15" cy="-60" rx="12" ry="18" fill="#ffffff" transform="rotate(-30 15 -60)"/>
    <ellipse cx="15" cy="-35" rx="12" ry="18" fill="#ffffff" transform="rotate(-30 15 -35)"/>
    <ellipse cx="15" cy="-10" rx="12" ry="18" fill="#ffffff" transform="rotate(-30 15 -10)"/>
    <ellipse cx="15" cy="15" rx="12" ry="18" fill="#ffffff" transform="rotate(-30 15 15)"/>
    <ellipse cx="15" cy="40" rx="12" ry="18" fill="#ffffff" transform="rotate(-30 15 40)"/>
    
    <!-- Leaves -->
    <path d="M 0 20 Q -30 10 -40 -10" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 0 40 Q 30 30 40 10" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>
</svg>`;
}

// Generate shortcut icon SVG
function generateShortcutSVG(emoji, size = 96) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradShortcut" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2d5016;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4a7c2c;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="url(#gradShortcut)"/>
  
  <text x="50%" y="50%" font-size="${size * 0.5}" text-anchor="middle" dominant-baseline="central">
    ${emoji}
  </text>
</svg>`;
}

// Icon configurations
const icons = [
  { size: 72, name: 'icon-72x72.png', svg: 'icon-72x72.svg', maskable: false },
  { size: 96, name: 'icon-96x96.png', svg: 'icon-96x96.svg', maskable: false },
  { size: 128, name: 'icon-128x128.png', svg: 'icon-128x128.svg', maskable: false },
  { size: 144, name: 'icon-144x144.png', svg: 'icon-144x144.svg', maskable: false },
  { size: 152, name: 'icon-152x152.png', svg: 'icon-152x152.svg', maskable: false },
  { size: 192, name: 'icon-192x192.png', svg: 'icon-192x192.svg', maskable: false },
  { size: 384, name: 'icon-384x384.png', svg: 'icon-384x384.svg', maskable: false },
  { size: 512, name: 'icon-512x512.png', svg: 'icon-512x512.svg', maskable: false },
  { size: 192, name: 'icon-192x192-maskable.png', svg: 'icon-192x192-maskable.svg', maskable: true },
  { size: 512, name: 'icon-512x512-maskable.png', svg: 'icon-512x512-maskable.svg', maskable: true }
];

const shortcuts = [
  { name: 'shortcut-dashboard.svg', emoji: '🏠' },
  { name: 'shortcut-farms.svg', emoji: '🌾' },
  { name: 'shortcut-crops.svg', emoji: '🌱' },
  { name: 'shortcut-weather.svg', emoji: '⛅' },
  { name: 'shortcut-chatbot.svg', emoji: '🤖' }
];

// Generate main icons
console.log('Generating PWA icons...\n');

icons.forEach(icon => {
  const svg = generateSVG(icon.size, icon.maskable);
  const svgPath = path.join(iconDir, icon.svg);
  fs.writeFileSync(svgPath, svg);
  console.log(`✓ Generated ${icon.svg} (${icon.size}x${icon.size}${icon.maskable ? ' maskable' : ''})`);
});

// Generate shortcut icons
shortcuts.forEach(shortcut => {
  const svg = generateShortcutSVG(shortcut.emoji);
  const svgPath = path.join(iconDir, shortcut.name);
  fs.writeFileSync(svgPath, svg);
  console.log(`✓ Generated ${shortcut.name}`);
});

// Generate favicon
const faviconSVG = generateSVG(32, false);
fs.writeFileSync(path.join(__dirname, 'client', 'public', 'favicon.svg'), faviconSVG);
console.log(`✓ Generated favicon.svg`);

// Generate apple-touch-icon
const appleTouchSVG = generateSVG(180, false);
fs.writeFileSync(path.join(iconDir, 'apple-touch-icon.svg'), appleTouchSVG);
console.log(`✓ Generated apple-touch-icon.svg`);

// Generate badge icon
const badgeSVG = generateSVG(72, false);
fs.writeFileSync(path.join(iconDir, 'badge-72x72.svg'), badgeSVG);
console.log(`✓ Generated badge-72x72.svg`);

console.log('\n✅ All PWA icons generated successfully!');
console.log('\n📝 Note: SVG files have been created. For production, you may want to convert them to PNG using:');
console.log('   - Online tools like https://cloudconvert.com/svg-to-png');
console.log('   - Or install sharp: npm install sharp');
console.log('   - Browser support for SVG icons is excellent in modern PWAs\n');
