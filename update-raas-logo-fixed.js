const fs = require('fs');
const path = require('path');

console.log('🎨 RAAS Logo Update Script\n');
console.log('='.repeat(50));

const projectRoot = __dirname;
const logoDir = path.join(projectRoot, 'client', 'public', 'logos');
const iconsDir = path.join(projectRoot, 'client', 'public', 'icons');
const publicDir = path.join(projectRoot, 'client', 'public');

// Check for logo file
const possibleLogos = [
  'raas-logo-original.png',
  'raas-logo-original.jpg',
  'raas-logo-original.jpeg',
  'raas-logo.png'
];

let logoFound = false;
let logoPath = '';

for (const logoFile of possibleLogos) {
  const fullPath = path.join(logoDir, logoFile);
  if (fs.existsSync(fullPath)) {
    logoFound = true;
    logoPath = fullPath;
    console.log(`\n✅ Found logo: ${logoFile}`);
    break;
  }
}

if (!logoFound) {
  console.error('\n❌ Error: RAAS logo not found!');
  console.error('\nChecked locations:');
  possibleLogos.forEach(name => console.error(`   - ${path.join(logoDir, name)}`));
  process.exit(1);
}

// Check for sharp
let sharp;
let canResize = false;
try {
  sharp = require('sharp');
  canResize = true;
  console.log('✅ Sharp available for image processing');
} catch (e) {
  console.log('⚠️  Sharp not available - copying logo as-is');
}

console.log('\n' + '='.repeat(50));
console.log('\n📋 Starting update...\n');

async function updateLogo() {
  const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  // Step 1: Copy main logo
  console.log('1️⃣  Copying main logo...');
  const mainLogoPath = path.join(publicDir, 'raas-logo.png');
  fs.copyFileSync(logoPath, mainLogoPath);
  console.log('   ✅ raas-logo.png');
  
  // Step 2: Create icons
  console.log('\n2️⃣  Creating PWA icons...');
  
  if (canResize) {
    // Create regular icons
    for (const size of iconSizes) {
      await sharp(logoPath)
        .resize(size, size, { 
          fit: 'contain', 
          background: { r: 0, g: 0, b: 0, alpha: 0 } 
        })
        .png()
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
      console.log(`   ✅ icon-${size}x${size}.png`);
    }
    
    // Create maskable icons
    for (const size of [192, 512]) {
      const padding = Math.floor(size * 0.1);
      const innerSize = size - (padding * 2);
      
      await sharp(logoPath)
        .resize(innerSize, innerSize, { 
          fit: 'contain', 
          background: { r: 0, g: 0, b: 0, alpha: 0 } 
        })
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 45, g: 80, b: 22, alpha: 1 }
        })
        .png()
        .toFile(path.join(iconsDir, `icon-${size}x${size}-maskable.png`));
      console.log(`   ✅ icon-${size}x${size}-maskable.png`);
    }
    
    // Create favicon
    await sharp(logoPath)
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));
    console.log('   ✅ favicon.png');
    
    // Create apple touch icon
    await sharp(logoPath)
      .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(iconsDir, 'apple-touch-icon.png'));
    console.log('   ✅ apple-touch-icon.png');
    
  } else {
    // Just copy
    iconSizes.forEach(size => {
      fs.copyFileSync(logoPath, path.join(iconsDir, `icon-${size}x${size}.png`));
      console.log(`   ✅ icon-${size}x${size}.png (copied)`);
    });
  }
  
  // Step 3: Update manifest
  console.log('\n3️⃣  Updating manifest.json...');
  const manifestPath = path.join(publicDir, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Update icon types to PNG
  manifest.icons = manifest.icons.map(icon => ({
    ...icon,
    src: icon.src.replace('.svg', '.png'),
    type: 'image/png'
  }));
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('   ✅ Icon references updated to PNG');
  
  // Step 4: Update index.html favicon
  console.log('\n4️⃣  Updating index.html...');
  const indexPath = path.join(publicDir, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  
  html = html.replace(
    /<link rel="icon" type="image\/svg\+xml" href="%PUBLIC_URL%\/favicon\.svg" \/>/,
    '<link rel="icon" type="image/png" href="%PUBLIC_URL%/favicon.png" />'
  );
  
  html = html.replace(
    /<link rel="alternate icon" href="%PUBLIC_URL%\/favicon\.ico" \/>/,
    '<link rel="alternate icon" href="%PUBLIC_URL%/favicon.png" />'
  );
  
  html = html.replace(
    /<link rel="mask-icon" href="%PUBLIC_URL%\/icons\/icon-512x512\.svg"/,
    '<link rel="mask-icon" href="%PUBLIC_URL%/icons/icon-512x512.png"'
  );
  
  html = html.replace(
    /href="%PUBLIC_URL%\/icons\/apple-touch-icon\.svg"/g,
    'href="%PUBLIC_URL%/icons/apple-touch-icon.png"'
  );
  
  html = html.replace(
    /href="%PUBLIC_URL%\/icons\/icon-(\d+)x\1\.svg"/g,
    'href="%PUBLIC_URL%/icons/icon-$1x$1.png"'
  );
  
  html = html.replace(
    /content="%PUBLIC_URL%\/icons\/icon-512x512\.svg"/g,
    'content="%PUBLIC_URL%/icons/icon-512x512.png"'
  );
  
  fs.writeFileSync(indexPath, html);
  console.log('   ✅ Favicon references updated');
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n✅ RAAS Logo Update Complete!\n');
  console.log('📊 Created:');
  console.log(`   - 1 main logo (raas-logo.png)`);
  console.log(`   - ${iconSizes.length} PWA icons`);
  console.log(`   - 2 maskable icons`);
  console.log(`   - 1 favicon`);
  console.log(`   - 1 apple touch icon`);
  console.log(`\n📝 Updated:`);
  console.log(`   - manifest.json`);
  console.log(`   - index.html`);
  console.log('\n🚀 Next steps:');
  console.log('   1. Restart frontend: Ctrl+C then npm start');
  console.log('   2. Clear cache: Ctrl+Shift+R');
  console.log('   3. Check DevTools → Application → Manifest');
  console.log('\n' + '='.repeat(50) + '\n');
}

// Run
updateLogo().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
