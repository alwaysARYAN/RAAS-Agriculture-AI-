# 🧪 PWA Testing Checklist

## Pre-Testing Setup

- [ ] Backend running on http://localhost:5001
- [ ] Frontend running on http://localhost:3002
- [ ] Chrome/Edge browser open
- [ ] DevTools open (F12)

---

## 1. Manifest Testing

**Steps**:
1. Open DevTools → Application → Manifest
2. Check all fields

**Expected Results**:
- [ ] ✅ Name: "Agriculture AI - Smart Farming Assistant"
- [ ] ✅ Short name: "Agriculture AI"
- [ ] ✅ Theme color: #2d5016
- [ ] ✅ Background color: #faf8f3
- [ ] ✅ Display: standalone
- [ ] ✅ All icons load (no 404 errors)
- [ ] ✅ 10 icons total (8 regular + 2 maskable)
- [ ] ✅ 5 shortcuts visible
- [ ] ✅ No errors or warnings

---

## 2. Service Worker Testing

**Steps**:
1. Open DevTools → Application → Service Workers
2. Check status

**Expected Results**:
- [ ] ✅ Service worker registered
- [ ] ✅ Status: "activated and running"
- [ ] ✅ Source: /service-worker.js
- [ ] ✅ No errors in console
- [ ] ✅ Version: v1.0.0

**Test Update on Reload**:
- [ ] ✅ Check "Update on reload"
- [ ] ✅ Reload page
- [ ] ✅ Service worker updates

---

## 3. Cache Testing

**Steps**:
1. Open DevTools → Application → Cache Storage
2. Navigate around the app
3. Check caches

**Expected Results**:
- [ ] ✅ Three caches created:
  - agriculture-ai-v1.0.0 (static assets)
  - agriculture-ai-data-v1.0.0 (API responses)
  - agriculture-ai-images-v1.0.0 (images)
- [ ] ✅ Static assets cached (HTML, CSS, JS)
- [ ] ✅ offline.html cached
- [ ] ✅ Icons cached
- [ ] ✅ API responses cached after first request

**View Cache Contents**:
```javascript
// In Console
caches.keys().then(console.log)
caches.open('agriculture-ai-v1.0.0').then(cache => 
  cache.keys().then(keys => console.log(keys.map(k => k.url)))
)
```

---

## 4. Offline Testing

**Steps**:
1. DevTools → Application → Service Workers
2. Check "Offline" checkbox
3. Test functionality

**Expected Results**:
- [ ] ✅ Offline indicator banner appears (top of page)
- [ ] ✅ Can navigate between cached pages
- [ ] ✅ Previously loaded data displays
- [ ] ✅ Images load from cache
- [ ] ✅ Uncached pages show offline.html
- [ ] ✅ API calls return cached data or offline error
- [ ] ✅ No white screen / app crash

**Test Uncached Route**:
- [ ] ✅ Navigate to new route while offline
- [ ] ✅ Should see offline.html with retry button

**Go Back Online**:
- [ ] ✅ Uncheck "Offline"
- [ ] ✅ Offline banner disappears
- [ ] ✅ Data syncs (check console for sync messages)
- [ ] ✅ Fresh data loads

---

## 5. Install Testing (Desktop)

**Steps**:
1. Look for install button in address bar
2. Click install icon (⊕)

**Expected Results**:
- [ ] ✅ Install prompt appears
- [ ] ✅ Shows app name and icon
- [ ] ✅ "Install" button works
- [ ] ✅ App opens in standalone window
- [ ] ✅ No browser address bar/tabs
- [ ] ✅ App icon in taskbar/dock
- [ ] ✅ Can open from Start menu/Applications

**Alternative (In-App Install)**:
- [ ] ✅ Wait 30 seconds after page load
- [ ] ✅ Install prompt appears (bottom right)
- [ ] ✅ Shows benefits list
- [ ] ✅ "Install Now" button works
- [ ] ✅ Can dismiss prompt

---

## 6. Install Testing (Mobile)

**Android (Chrome)**:
- [ ] ✅ Automatic banner appears
- [ ] ✅ Or: Menu → "Add to Home Screen"
- [ ] ✅ App icon on home screen
- [ ] ✅ Opens fullscreen (no browser UI)
- [ ] ✅ Custom splash screen shows
- [ ] ✅ Status bar matches theme color

**iOS (Safari)**:
- [ ] ✅ Share button → "Add to Home Screen"
- [ ] ✅ App icon on home screen
- [ ] ✅ Opens fullscreen
- [ ] ✅ Custom splash screen
- [ ] ✅ Status bar styling applied

---

## 7. Network Strategy Testing

**Network First (API)**:
```javascript
// In Console - Online
fetch('/api/farms').then(r => r.json()).then(console.log)
// Should get fresh data

// Go offline, try again
fetch('/api/farms').then(r => r.json()).then(console.log)
// Should get cached data or offline error
```

**Expected Results**:
- [ ] ✅ API requests go to network first when online
- [ ] ✅ Successful responses cached
- [ ] ✅ Offline requests served from cache
- [ ] ✅ Console shows SW messages

**Cache First (Images)**:
- [ ] ✅ Images load instantly (from cache)
- [ ] ✅ Network tab shows "ServiceWorker" source
- [ ] ✅ Offline images still load

---

## 8. Update Testing

**Steps**:
1. Change service worker version:
   ```javascript
   // In service-worker.js
   const CACHE_VERSION = 'v1.0.1'; // Change from v1.0.0
   ```
2. Save file
3. Reload page (may need hard reload)

**Expected Results**:
- [ ] ✅ New service worker installs
- [ ] ✅ Status: "waiting to activate"
- [ ] ✅ Update notification banner appears (top right)
- [ ] ✅ Shows "Update Available" message
- [ ] ✅ "Update Now" button works
- [ ] ✅ Page reloads with new version
- [ ] ✅ Old cache deleted
- [ ] ✅ New cache created with v1.0.1

---

## 9. Lighthouse Audit

**Steps**:
1. DevTools → Lighthouse
2. Select:
   - ✅ Progressive Web App
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
3. Click "Analyze page load"

**Expected Scores (localhost)**:
- [ ] ✅ PWA: 80-90+ (100 on HTTPS production)
- [ ] ✅ Performance: 70-90+
- [ ] ✅ Accessibility: 90-95+
- [ ] ✅ Best Practices: 85-95+
- [ ] ✅ SEO: 90-100

**PWA Checks** (should all pass on HTTPS):
- [ ] ✅ Registers a service worker
- [ ] ✅ Responds with 200 when offline
- [ ] ✅ Has a web app manifest
- [ ] ✅ Configured for a custom splash screen
- [ ] ✅ Sets theme color
- [ ] ✅ Content sized correctly for viewport
- [ ] ✅ Has maskable icon

---

## 10. App Features Testing

**Install Prompt**:
- [ ] ✅ Appears after 30 seconds (if not installed)
- [ ] ✅ Shows agricultural icon
- [ ] ✅ Lists 4 benefits
- [ ] ✅ Can dismiss
- [ ] ✅ Can install

**Offline Indicator**:
- [ ] ✅ Appears when offline
- [ ] ✅ Amber/yellow design
- [ ] ✅ Shows "You're Offline" message
- [ ] ✅ Disappears when online

**Shortcuts** (after install):
- [ ] ✅ Right-click app icon shows shortcuts
- [ ] ✅ 5 shortcuts: Dashboard, Farms, Crops, Weather, AI Chat
- [ ] ✅ Each has correct icon
- [ ] ✅ Clicking opens correct page

---

## 11. Console Testing

**Check Console for**:
- [ ] ✅ `[PWA] Service worker registered successfully`
- [ ] ✅ `[Service Worker] Installed successfully`
- [ ] ✅ `[Service Worker] Activated successfully`
- [ ] ✅ No error messages
- [ ] ✅ Caching messages for requests
- [ ] ✅ Network/cache strategy logs

**Test Commands**:
```javascript
// Check if installed
console.log('Standalone:', window.matchMedia('(display-mode: standalone)').matches);

// Check service worker
navigator.serviceWorker.getRegistrations().then(console.log);

// Check caches
caches.keys().then(console.log);

// Check network status
console.log('Online:', navigator.onLine);
```

---

## 12. Meta Tags Testing

**View Page Source** (Ctrl+U):
- [ ] ✅ Theme color meta tags present
- [ ] ✅ Apple touch icon links
- [ ] ✅ Manifest link
- [ ] ✅ Viewport meta tag
- [ ] ✅ Open Graph tags
- [ ] ✅ Twitter card tags
- [ ] ✅ Microsoft tile config

**Mobile Testing**:
- [ ] ✅ Status bar matches theme color
- [ ] ✅ Splash screen shows on launch
- [ ] ✅ App title displays correctly

---

## 13. Share Target Testing (After Install)

**Steps**:
1. Share an image from another app
2. Select "Agriculture AI"

**Expected Results**:
- [ ] ✅ App appears in share menu
- [ ] ✅ Can receive shared images
- [ ] ✅ Image opens in app (handle at /share route)

*Note: Requires implementation of share handler route*

---

## 14. Background Sync Testing

**Steps**:
1. Make changes while online (e.g., add farm)
2. Go offline
3. Try to make more changes
4. Go back online

**Expected Results**:
- [ ] ✅ Offline changes queued
- [ ] ✅ Console shows sync registration
- [ ] ✅ When online, sync triggers
- [ ] ✅ Pending changes uploaded
- [ ] ✅ Console: `[PWA] Background sync completed`

*Note: Requires IndexedDB implementation for queue*

---

## 15. Performance Testing

**Check Network Tab**:
- [ ] ✅ Service worker intercepts requests
- [ ] ✅ Cached resources load instantly
- [ ] ✅ Images from service worker
- [ ] ✅ API responses cached appropriately

**Check Performance**:
- [ ] ✅ First load: < 3 seconds
- [ ] ✅ Subsequent loads: < 1 second
- [ ] ✅ No layout shifts
- [ ] ✅ Smooth animations

---

## 16. Cross-Browser Testing

**Chrome/Edge**:
- [ ] ✅ Install works
- [ ] ✅ Service worker active
- [ ] ✅ Offline mode works
- [ ] ✅ All features functional

**Firefox**:
- [ ] ✅ Service worker works
- [ ] ✅ Manifest loads
- [ ] ✅ Can add to home screen (mobile)

**Safari (Desktop)**:
- [ ] ✅ Service worker works
- [ ] ✅ Basic caching works
- [ ] ✅ Note: Limited PWA features

**Safari (iOS)**:
- [ ] ✅ Add to home screen works
- [ ] ✅ Standalone mode works
- [ ] ✅ Icons display correctly
- [ ] ✅ Status bar styled

---

## 17. Icons Testing

**Check Icons Load**:
- [ ] ✅ All sizes load without 404
- [ ] ✅ Favicon shows in browser tab
- [ ] ✅ App icon shows after install
- [ ] ✅ Shortcut icons display
- [ ] ✅ Icons are agricultural themed (wheat symbol)

**Icon Sizes**:
```javascript
// In Console
fetch('/icons/icon-192x192.svg').then(r => console.log('192:', r.ok));
fetch('/icons/icon-512x512.svg').then(r => console.log('512:', r.ok));
fetch('/favicon.svg').then(r => console.log('favicon:', r.ok));
```

---

## 18. Offline Page Testing

**Steps**:
1. Go offline (DevTools checkbox)
2. Navigate to uncached route
3. Should see offline.html

**Expected Results**:
- [ ] ✅ Offline page displays (not blank)
- [ ] ✅ Agricultural design with green colors
- [ ] ✅ Lists available offline features
- [ ] ✅ "Try Again" button present
- [ ] ✅ Connection status indicator
- [ ] ✅ Auto-detects when back online
- [ ] ✅ Auto-redirects to home when online

---

## 19. Security Testing

**HTTPS** (Production only):
- [ ] ✅ Site loads on HTTPS
- [ ] ✅ No mixed content warnings
- [ ] ✅ Valid SSL certificate
- [ ] ✅ Service worker registers on HTTPS

**Content Security**:
- [ ] ✅ CSP headers set
- [ ] ✅ No XSS vulnerabilities
- [ ] ✅ API endpoints secure

---

## 20. Final Checklist

**Core PWA Features**:
- [ ] ✅ Manifest configured
- [ ] ✅ Service worker registered
- [ ] ✅ Works offline
- [ ] ✅ Installable
- [ ] ✅ Fast loading
- [ ] ✅ Responsive design

**User Experience**:
- [ ] ✅ Install prompt appears
- [ ] ✅ Update notifications work
- [ ] ✅ Offline indicator shows
- [ ] ✅ No errors or crashes
- [ ] ✅ Smooth navigation

**Production Ready**:
- [ ] ✅ HTTPS configured (for production)
- [ ] ✅ Environment variables set
- [ ] ✅ Build process works
- [ ] ✅ All assets optimized
- [ ] ✅ No console errors

---

## Testing Commands

```bash
# Start backend
cd server
npm start

# Start frontend (separate terminal)
cd client
npm start

# Build for production
cd client
npm run build

# Test production build locally
npm install -g serve
serve -s build -l 3002
```

---

## Quick Test Script

```javascript
// Run in browser console

async function quickTest() {
  console.log('🧪 PWA Quick Test\n');
  
  // Service Worker
  const sw = await navigator.serviceWorker.getRegistrations();
  console.log('✅ Service Worker:', sw.length > 0 ? 'Registered' : '❌ Not Registered');
  
  // Caches
  const cacheNames = await caches.keys();
  console.log('✅ Caches:', cacheNames.length, 'caches');
  console.log('   ', cacheNames);
  
  // Manifest
  const manifest = document.querySelector('link[rel="manifest"]');
  console.log('✅ Manifest:', manifest ? 'Found' : '❌ Not Found');
  
  // Online Status
  console.log('✅ Online:', navigator.onLine ? 'Yes' : 'Offline Mode');
  
  // Standalone
  const standalone = window.matchMedia('(display-mode: standalone)').matches;
  console.log('✅ Installed:', standalone ? 'Yes' : 'No (Web)');
  
  console.log('\n✨ Test Complete!');
}

quickTest();
```

---

## Expected Test Results

**All tests passing** means:
✅ PWA fully functional
✅ Offline support working
✅ Install capability ready
✅ Performance optimized
✅ Ready for production deployment

**If any tests fail**:
1. Check console for errors
2. Review troubleshooting in PWA_IMPLEMENTATION_COMPLETE.md
3. Verify all files are in correct locations
4. Clear cache and retry
5. Check service worker is latest version

---

## 🎉 Success Criteria

Your PWA is ready when:
- [ ] All 20 test sections pass
- [ ] Lighthouse PWA score: 80+ (localhost) or 100 (HTTPS production)
- [ ] No console errors
- [ ] Works offline smoothly
- [ ] Install prompt functions
- [ ] Users can add to home screen
- [ ] Update mechanism works

---

**Happy Testing! 🌾**
