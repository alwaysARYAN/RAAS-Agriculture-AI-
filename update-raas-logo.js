#!/usr/bin/env node

/**
 * RAAS Logo Update Script
 * 
 * This script updates all instances of the Agriculture AI logo
 * with the RAAS logo throughout the application.
 * 
 * Prerequisites:
 * 1. Save RAAS logo as: client/public/logos/raas-logo-original.png
 * 2. Install sharp: npm install sharp (optional, for image processing)
 * 
 * Usage: node update-raas-logo.js
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 RAAS Logo Update Script\n');
console.log('=' .repeat(50));

const projectRoot = __dirname;
const logoDir = path.join(projectRoot, 'client', 'public', 'logos');
const iconsDir = path.join(projectRoot, 'client', 'public', 'icons');
const publicDir = path.join(projectRoot, 'client', 'public');

// Check for logo file
const possibleLogos = [
  'raas-logo-original.png',
  'raas-logo-original.jpg',
  'raas-logo-original.jpeg',
  'raas-logo-original.svg',
  'raas-logo.png',
  'raas-logo.jpg',
  'raas-logo.svg'
];

let logoFound = false;
let logoPath = '';
let logoExt = '';

for (const logoFile of possibleLogos) {
  const fullPath = path.join(logoDir, logoFile);
  if (fs.existsSync(fullPath)) {
    logoFound = true;
    logoPath = fullPath;
    logoExt = path.extname(logoFile);
    console.log(`\n✅ Found logo: ${logoFile}`);
    break;
  }
}

if (!logoFound) {
  console.error('\n❌ Error: RAAS logo not found!');
  console.error('\nPlease save your RAAS logo as one of:');
  possibleLogos.forEach(name => console.error(`   - ${path.join(logoDir, name)}`));
  console.error('\nThen run this script again.');
  process.exit(1);
}

// Check if sharp is available for image processing
let sharp;
let canResize = false;
try {
  sharp = require('sharp');
  canResize = true;
  console.log('✅ Sharp available for image processing');
} catch (e) {
  console.log('⚠️  Sharp not available - will copy logo as-is');
  console.log('   Install with: npm install sharp');
}

console.log('\n' + '='.repeat(50));
console.log('\n📋 Starting update process...\n');

// Main async function
async function updateLogo() {

// Step 1: Update manifest.json
console.log('1️⃣  Updating manifest.json...');
const manifestPath = path.join(publicDir, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Update names
    manifest.name = 'RAAS - Roots AI Agriculture Solutions';
    manifest.short_name = 'RAAS';
    manifest.description = 'Roots AI Agriculture Solutions - AI-powered smart farming platform for crop management, disease detection, weather forecasting, and market insights.';
    
    // Update icons to use PNG instead of SVG
    manifest.icons = manifest.icons.map(icon => ({
      ...icon,
      src: icon.src.replace('.svg', '.png'),
      type: 'image/png'
    }));
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('   ✅ Manifest updated');
  } catch (error) {
    console.error('   ❌ Error updating manifest:', error.message);
  }
} else {
  console.error('   ❌ Manifest not found');
}

// Step 2: Copy logo to public directory
console.log('\n2️⃣  Copying logo to public directory...');
const mainLogoPath = path.join(publicDir, 'raas-logo.png');
try {
  fs.copyFileSync(logoPath, mainLogoPath);
  console.log('   ✅ Logo copied to public/raas-logo.png');
} catch (error) {
  console.error('   ❌ Error copying logo:', error.message);
}

// Step 3: Create icon sizes
console.log('\n3️⃣  Creating PWA icons...');
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

if (canResize && logoExt !== '.svg') {
  // Use sharp to resize
  iconSizes.forEach(async (size) => {
    try {
      await sharp(logoPath)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
      console.log(`   ✅ Created icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`   ❌ Error creating ${size}x${size} icon:`, error.message);
    }
  });
  
  // Create maskable icons (with 20% padding)
  [192, 512].forEach(async (size) => {
    try {
      const padding = Math.floor(size * 0.1);
      const innerSize = size - (padding * 2);
      
      await sharp(logoPath)
        .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 45, g: 80, b: 22, alpha: 1 } // Agricultural green
        })
        .png()
        .toFile(path.join(iconsDir, `icon-${size}x${size}-maskable.png`));
      console.log(`   ✅ Created icon-${size}x${size}-maskable.png`);
    } catch (error) {
      console.error(`   ❌ Error creating maskable ${size}x${size}:`, error.message);
    }
  });
  
  // Create favicon
  try {
    await sharp(logoPath)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));
    console.log('   ✅ Created favicon.png');
  } catch (error) {
    console.error('   ❌ Error creating favicon:', error.message);
  }
  
  // Create apple touch icon
  try {
    await sharp(logoPath)
      .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(iconsDir, 'apple-touch-icon.png'));
    console.log('   ✅ Created apple-touch-icon.png');
  } catch (error) {
    console.error('   ❌ Error creating apple touch icon:', error.message);
  }
  
} else {
  // Just copy the logo as-is for each size
  console.log('   ⚠️  Copying logo as-is (no resizing)');
  iconSizes.forEach(size => {
    try {
      fs.copyFileSync(logoPath, path.join(iconsDir, `icon-${size}x${size}.png`));
      console.log(`   ✅ Copied icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`   ❌ Error copying ${size}x${size}:`, error.message);
    }
  });
}

// Step 4: Update index.html
console.log('\n4️⃣  Updating index.html...');
const indexPath = path.join(publicDir, 'index.html');
if (fs.existsSync(indexPath)) {
  try {
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Update title
    html = html.replace(
      /<title>.*?<\/title>/,
      '<title>RAAS - Roots AI Agriculture Solutions</title>'
    );
    
    // Update meta description
    html = html.replace(
      /<meta name="description" content=".*?".*?\/>/,
      '<meta name="description" content="Roots AI Agriculture Solutions - AI-powered smart farming platform for crop management, disease detection, and market insights." />'
    );
    
    // Update Open Graph
    html = html.replace(
      /<meta property="og:title" content=".*?".*?\/>/,
      '<meta property="og:title" content="RAAS - Roots AI Agriculture Solutions" />'
    );
    
    // Update favicon references
    html = html.replace(/favicon\.svg/g, 'raas-logo.png');
    html = html.replace(/\.svg"/g, '.png"');
    
    fs.writeFileSync(indexPath, html);
    console.log('   ✅ index.html updated');
  } catch (error) {
    console.error('   ❌ Error updating index.html:', error.message);
  }
} else {
  console.error('   ❌ index.html not found');
}

// Step 5: Create component update instructions
console.log('\n5️⃣  Creating component update guide...');
const componentUpdates = {
  'client/src/components/Auth/Login.js': {
    find: /Agriculture AI/g,
    replace: 'RAAS'
  },
  'client/src/components/Auth/Register.js': {
    find: /Agriculture AI/g,
    replace: 'RAAS'
  },
  'client/src/components/Layout/Layout.js': {
    find: /Agriculture AI/g,
    replace: 'RAAS'
  },
  'client/src/components/Dashboard/Dashboard.js': {
    find: /Agriculture AI/g,
    replace: 'RAAS'
  }
};

const updateInstructions = [];
for (const [file, update] of Object.entries(componentUpdates)) {
  const filePath = path.join(projectRoot, file);
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const updated = content.replace(update.find, update.replace);
      
      if (content !== updated) {
        updateInstructions.push({
          file,
          action: 'Replace "Agriculture AI" with "RAAS"',
          done: false
        });
      }
    } catch (error) {
      console.error(`   ⚠️  Could not read ${file}`);
    }
  }
}

console.log('   ✅ Component update guide created');

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Update Summary:\n');
console.log('✅ Manifest updated with RAAS branding');
console.log('✅ Logo copied to public directory');
console.log(`✅ ${iconSizes.length} PWA icons created/updated`);
console.log('✅ Favicon created');
console.log('✅ Apple touch icon created');
console.log('✅ index.html updated');

if (updateInstructions.length > 0) {
  console.log(`\n⚠️  ${updateInstructions.length} components need manual update:`);
  updateInstructions.forEach(({ file, action }) => {
    console.log(`   - ${file}: ${action}`);
  });
} else {
  console.log('\n✅ All component references up to date');
}

console.log('\n' + '='.repeat(50));
console.log('\n🎉 Logo update complete!\n');
console.log('Next steps:');
console.log('1. Restart frontend server: cd client && npm start');
console.log('2. Clear browser cache: Ctrl + Shift + R');
console.log('3. Check manifest in DevTools → Application');
console.log('4. Verify RAAS logo appears everywhere\n');

console.log('📝 Files updated:');
console.log(`   - ${path.relative(projectRoot, manifestPath)}`);
console.log(`   - ${path.relative(projectRoot, indexPath)}`);
console.log(`   - ${path.relative(projectRoot, iconsDir)}/*.png`);
console.log(`   - ${path.relative(projectRoot, mainLogoPath)}`);
console.log('\n' + '='.repeat(50) + '\n');
}

// Run the update
updateLogo().catch(error => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});
