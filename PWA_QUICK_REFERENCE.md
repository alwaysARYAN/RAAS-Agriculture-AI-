# 🚀 PWA Quick Reference Card

## 📋 Essential Commands

### **Development**
```bash
# Start backend
cd server && npm run dev

# Start frontend (port 3002)
cd client && npm start

# Access app
http://localhost:3002
```

### **Build & Deploy**
```bash
# Production build
cd client && npm run build

# Test production locally
npx serve -s build -l 3002

# Deploy (choose one)
vercel --prod           # Vercel
netlify deploy --prod   # Netlify
firebase deploy         # Firebase
```

---

## 🧪 Testing Checklist

### **Quick Test (5 min)**
1. ✅ Open http://localhost:3002
2. ✅ F12 → Application → Manifest (no errors)
3. ✅ Service Workers → Status: "activated"
4. ✅ Cache Storage → 3 caches created
5. ✅ Check "Offline" → App still works

### **Install Test**
1. ✅ Look for install icon in address bar (⊕)
2. ✅ Or wait 30 seconds for prompt
3. ✅ Click install → Opens standalone
4. ✅ App icon on desktop/home screen

### **Lighthouse Audit**
1. ✅ F12 → Lighthouse
2. ✅ Select "Progressive Web App"
3. ✅ Click "Analyze page load"
4. ✅ Score: 80+ (localhost) or 100 (HTTPS)

---

## 📁 Key Files

| File | Purpose | Location |
|------|---------|----------|
| `manifest.json` | PWA config | `client/public/` |
| `service-worker.js` | Caching & offline | `client/public/` |
| `offline.html` | Offline page | `client/public/` |
| `PWAInstall.js` | Install prompt | `client/src/components/` |
| `index.html` | Meta tags | `client/public/` |
| Icons | All sizes | `client/public/icons/` |

---

## 🔧 Common Tasks

### **Update Service Worker**
```javascript
// In service-worker.js
const CACHE_VERSION = 'v1.0.1'; // Increment
```
Save → Reload → Update banner appears

### **Clear Cache**
```javascript
// In browser console
caches.keys().then(keys => 
  Promise.all(keys.map(key => caches.delete(key)))
);
```

### **Check PWA Status**
```javascript
// In browser console
console.log('SW:', await navigator.serviceWorker.getRegistrations());
console.log('Caches:', await caches.keys());
console.log('Online:', navigator.onLine);
console.log('Installed:', window.matchMedia('(display-mode: standalone)').matches);
```

### **Test Offline**
DevTools → Application → Service Workers → ✅ Offline

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| SW not registering | Check HTTPS (required in prod), clear cache |
| Install not showing | Wait 30 sec, check manifest, try different browser |
| Offline not working | Verify SW active, check cache in DevTools |
| Icons broken | Check paths in manifest.json, verify files exist |
| Update not appearing | Increment CACHE_VERSION, hard reload |

---

## 📱 Browser Support

| Browser | PWA Support | Notes |
|---------|-------------|-------|
| Chrome | ✅ Full | Best support |
| Edge | ✅ Full | Chromium-based |
| Firefox | ✅ Good | SW + manifest |
| Safari (iOS) | ✅ Good | Add to home screen |
| Safari (Mac) | ⚠️ Basic | Limited PWA |

---

## 🎯 Deployment URLs

### **Vercel**
```bash
cd client
vercel --prod
# URL: https://your-app.vercel.app
```

### **Netlify**
```bash
cd client
netlify deploy --prod
# URL: https://your-app.netlify.app
```

### **Firebase**
```bash
firebase init hosting
firebase deploy
# URL: https://your-app.web.app
```

---

## 📊 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| PWA Score | 100 | ✅ Ready |
| First Load | < 3s | ✅ Optimized |
| Cached Load | < 1s | ✅ Instant |
| Offline | Works | ✅ Full support |

---

## 🔑 Environment Variables

### **Production .env**
```env
REACT_APP_API_URL=https://your-api.com/api
REACT_APP_VAPID_PUBLIC_KEY=your-vapid-key
NODE_ENV=production
PUBLIC_URL=https://your-domain.com
```

---

## 📚 Documentation

1. **PWA_IMPLEMENTATION_COMPLETE.md** - Full guide
2. **PWA_TESTING_CHECKLIST.md** - 20 test sections
3. **PWA_TRANSFORMATION_SUMMARY.md** - Overview
4. **PWA_QUICK_REFERENCE.md** - This card

---

## ✅ Pre-Deployment Checklist

- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] Service worker registers
- [ ] Manifest loads without errors
- [ ] Icons all load (no 404s)
- [ ] Offline mode works
- [ ] HTTPS configured
- [ ] Environment variables set
- [ ] Lighthouse PWA score: 100

---

## 🎊 Features Summary

| Feature | Status |
|---------|--------|
| Offline Mode | ✅ |
| Install Prompt | ✅ |
| App Shortcuts | ✅ (5) |
| Caching | ✅ (Smart) |
| Updates | ✅ (Auto) |
| Push Notifications | ✅ (Ready) |
| Background Sync | ✅ (Ready) |
| Share Target | ✅ |
| Icons | ✅ (18) |
| Meta Tags | ✅ (70+) |

---

## 🔗 Quick Links

- **Test Local**: http://localhost:3002
- **DevTools**: F12 → Application
- **Lighthouse**: F12 → Lighthouse
- **PWA Tools**: https://www.pwabuilder.com/
- **Web.dev**: https://web.dev/progressive-web-apps/

---

## 💡 Pro Tips

1. **Always test on HTTPS** in production
2. **Clear cache** after updates during testing
3. **Test offline mode** thoroughly
4. **Check all icon sizes** load
5. **Run Lighthouse audit** before deploy
6. **Test on real devices** (iOS, Android)
7. **Monitor service worker** status
8. **Keep CACHE_VERSION** updated

---

## 🎯 Success Criteria

✅ Service worker: Active
✅ Caches: 3 created
✅ Offline: Working
✅ Install: Available
✅ Update: Functional
✅ Lighthouse: 80+
✅ No errors: Clean console

---

**All systems go! Deploy with confidence! 🚀🌾**
