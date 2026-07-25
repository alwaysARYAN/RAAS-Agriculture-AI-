# 🎨 Update RAAS Logo - Instructions

## Step 1: Save Your Logo

1. **Save the RAAS logo image** you showed me to:
   ```
   d:\agriculture-ai\client\public\logos\raas-logo-original.png
   ```

2. Or save it as any format (PNG, JPG, SVG) and rename it to `raas-logo-original` with the appropriate extension

## Step 2: Install Image Processing Tool (if not installed)

```powershell
# Option 1: Using npm
npm install -g sharp-cli

# Option 2: Or we'll use an online converter
```

## Step 3: Run Automated Update

Once you've saved the logo, run:

```powershell
node d:\agriculture-ai\update-raas-logo.js
```

This will automatically:
- ✅ Create all PWA icon sizes (72x72 to 512x512)
- ✅ Create maskable icons
- ✅ Create favicon
- ✅ Create Apple touch icons
- ✅ Create shortcut icons
- ✅ Update manifest.json
- ✅ Update index.html
- ✅ Update all components

## Alternative: Manual Quick Update

If you want to update immediately without processing:

1. Save your logo as:
   - `d:\agriculture-ai\client\public\raas-logo.png` (main logo)
   - `d:\agriculture-ai\client\public\favicon.png` (32x32 or 64x64)

2. I'll update all references to use this logo

---

## What I'll Update

### PWA Icons (in `client/public/icons/`)
- icon-72x72.png → RAAS logo
- icon-96x96.png → RAAS logo
- icon-128x128.png → RAAS logo
- icon-144x144.png → RAAS logo
- icon-152x152.png → RAAS logo
- icon-192x192.png → RAAS logo
- icon-384x384.png → RAAS logo
- icon-512x512.png → RAAS logo
- icon-192x192-maskable.png → RAAS logo with padding
- icon-512x512-maskable.png → RAAS logo with padding

### Application
- Favicon (browser tab)
- Apple touch icon
- Dashboard logo
- Login page logo
- Navbar logo
- Splash screen

### Manifest
- All icon references
- Name: "RAAS - Agriculture AI"
- Short name: "RAAS"
- Description updated

### Components
- Login.js
- Register.js
- Dashboard.js
- Layout.js (navbar)
- Any other logo references

---

## Let me know when you've saved the logo file and I'll run the automated update!
