// Quick PWA Icon Verification Script
// Run: node verify-pwa-icons.js

const fs = require('fs');
const path = require('path');

const iconDir = path.join(__dirname, 'client', 'public', 'icons');
const manifestPath = path.join(__dirname, 'client', 'public', 'manifest.json');

console.log('🔍 Verifying PWA Icons...\n');

// Required icons from manifest
const requiredIcons = [
  'icon-72x72.svg',
  'icon-96x96.svg',
  'icon-128x128.svg',
  'icon-144x144.svg',
  'icon-152x152.svg',
  'icon-192x192.svg',
  'icon-384x384.svg',
  'icon-512x512.svg',
  'icon-192x192-maskable.svg',
  'icon-512x512-maskable.svg',
  'shortcut-dashboard.svg',
  'shortcut-farms.svg',
  'shortcut-crops.svg',
  'shortcut-weather.svg',
  'shortcut-chatbot.svg'
];

// Special icons
const specialIcons = [
  'apple-touch-icon.svg',
  'badge-72x72.svg',
  '../favicon.svg'
];

let allPassed = true;

// Check icon directory exists
if (!fs.existsSync(iconDir)) {
  console.error('❌ Icons directory not found:', iconDir);
  allPassed = false;
} else {
  console.log('✅ Icons directory found:', iconDir, '\n');
}

// Check required icons
console.log('📋 Checking Required Icons:\n');
requiredIcons.forEach(icon => {
  const iconPath = path.join(iconDir, icon);
  const exists = fs.existsSync(iconPath);
  
  if (exists) {
    const stats = fs.statSync(iconPath);
    console.log(`✅ ${icon} (${stats.size} bytes)`);
  } else {
    console.log(`❌ ${icon} - NOT FOUND`);
    allPassed = false;
  }
});

// Check special icons
console.log('\n📋 Checking Special Icons:\n');
specialIcons.forEach(icon => {
  const iconPath = path.join(iconDir, icon);
  const exists = fs.existsSync(iconPath);
  
  if (exists) {
    const stats = fs.statSync(iconPath);
    console.log(`✅ ${icon} (${stats.size} bytes)`);
  } else {
    console.log(`❌ ${icon} - NOT FOUND`);
  }
});

// Check manifest
console.log('\n📋 Checking Manifest:\n');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    console.log(`✅ Manifest found and valid`);
    console.log(`   Name: ${manifest.name}`);
    console.log(`   Short Name: ${manifest.short_name}`);
    console.log(`   ID: ${manifest.id || 'NOT SET'}`);
    console.log(`   Theme Color: ${manifest.theme_color}`);
    console.log(`   Icons: ${manifest.icons?.length || 0}`);
    console.log(`   Shortcuts: ${manifest.shortcuts?.length || 0}`);
    
    // Check for screenshots
    if (manifest.screenshots && manifest.screenshots.length > 0) {
      console.log(`   ⚠️  Screenshots: ${manifest.screenshots.length} (may cause 404 errors)`);
    }
    
    // Verify icon references in manifest
    console.log('\n📋 Verifying Icon References in Manifest:\n');
    let iconRefsValid = true;
    
    manifest.icons?.forEach(icon => {
      const iconPath = path.join(__dirname, 'client', 'public', icon.src);
      const exists = fs.existsSync(iconPath);
      
      if (exists) {
        console.log(`✅ ${icon.src}`);
      } else {
        console.log(`❌ ${icon.src} - Referenced but not found`);
        iconRefsValid = false;
        allPassed = false;
      }
    });
    
    // Check shortcuts
    console.log('\n📋 Verifying Shortcut Icons in Manifest:\n');
    manifest.shortcuts?.forEach(shortcut => {
      shortcut.icons?.forEach(icon => {
        const iconPath = path.join(__dirname, 'client', 'public', icon.src);
        const exists = fs.existsSync(iconPath);
        
        if (exists) {
          console.log(`✅ ${shortcut.name}: ${icon.src}`);
        } else {
          console.log(`❌ ${shortcut.name}: ${icon.src} - Not found`);
          iconRefsValid = false;
          allPassed = false;
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Manifest is invalid JSON:', error.message);
    allPassed = false;
  }
} else {
  console.error('❌ Manifest not found:', manifestPath);
  allPassed = false;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Verification Summary:\n');

if (allPassed) {
  console.log('✅ ALL CHECKS PASSED!');
  console.log('\n🎉 Your PWA icons are ready!\n');
  console.log('Next steps:');
  console.log('1. Clear browser cache (Ctrl + Shift + R)');
  console.log('2. Open http://localhost:3002');
  console.log('3. Check DevTools → Application → Manifest');
  console.log('4. All icons should load without errors\n');
} else {
  console.log('❌ SOME CHECKS FAILED');
  console.log('\nPlease review the errors above and:');
  console.log('1. Run: node create-pwa-icons.js');
  console.log('2. Verify files were created');
  console.log('3. Restart frontend server');
  console.log('4. Run this script again\n');
}

console.log('='.repeat(50) + '\n');

// Exit with appropriate code
process.exit(allPassed ? 0 : 1);
