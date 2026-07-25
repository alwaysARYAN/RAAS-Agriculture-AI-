# 🧪 SIMPLE TEST INSTRUCTIONS

## ✅ Servers are Running!

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

---

## 🎯 Test 1: Language Selection (First Visit)

### Step 1: Clear Browser Data
Open browser console (Press **F12**), then paste:
```javascript
localStorage.clear();
location.reload();
```

### Expected Result:
You should see a beautiful screen with:
- 🌾 Agriculture AI logo
- "Choose Language / भाषा चुनें / ભાષા પસંદ કરો"
- 3 big buttons:
  - 🇬🇧 English
  - 🇮🇳 हिंदी (Hindi)
  - 🇮🇳 ગુજરાતી (Gujarati)

### What to Do:
- Click any language
- Should go to login page

✅ **Test 1 PASSED** if you see the language selection screen!

---

## 🎯 Test 2: Language Switcher on Login Page

### What to See:
Look at **top-right corner** of login page

### Expected:
3 small buttons: `English` `हिंदी` `ગુજરાતી`

### What to Do:
- Click each button
- Active button should turn **green**

✅ **Test 2 PASSED** if you see 3 language buttons!

---

## 🎯 Test 3: Login and Check Sidebar

### Step 1: Login
Use your credentials

### Step 2: Look at Sidebar (Left side)
You should see menu items

### Step 3: Change Language
- Click **flag icon** in top header
- Select **हिंदी (Hindi)**

### Expected Changes:
- Dashboard → **डैशबोर्ड**
- My Farms → **मेरे खेत**
- My Crops → **मेरी फसलें**
- Weather → **मौसम**
- Market Prices → **बाजार भाव**
- Schemes → **योजनाएं**
- My Profile → **मेरी प्रोफाइल**

✅ **Test 3 PASSED** if sidebar menu translates to Hindi!

---

## 🎯 Test 4: Farms Page Translation

### Step 1: Click "My Farms" in sidebar

### Step 2: Check Page Title
- In **English**: "My Farms"
- Change to **Hindi**: Should show "**मेरे खेत**"
- Change to **Gujarati**: Should show "**મારા ખેતરો**"

### Step 3: Check Buttons
- "Add New Farm" button should translate
- "Export as PDF" button should translate

✅ **Test 4 PASSED** if Farms page title changes language!

---

## 🎯 Test 5: PDF Export

### Step 1: Go to Farms Page

### Step 2: Add a Farm (if you don't have one)
- Click "+ Add New Farm"
- Fill in details
- Click "Add Farm"

### Step 3: Export
- Click blue **"Export as PDF"** button

### Expected Result:
- File downloads (PDF or CSV)
- **NO error alert appears**
- Check Downloads folder

✅ **Test 5 PASSED** if file downloads without error!

---

## 🎯 Test 6: Dashboard Translation

### Step 1: Go to Dashboard

### Step 2: Change to Hindi

### What Should Translate:
- Page title: "Dashboard" → "**डैशबोर्ड**"
- "Total Farms" → "**कुल खेत**"
- "Active Crops" → "**सक्रिय फसलें**"
- "Total Area" → "**कुल क्षेत्र**"
- "Harvested" → "**काटी गई**"

✅ **Test 6 PASSED** if dashboard stats labels translate!

---

## 📊 QUICK RESULTS TABLE

| Test | Feature | Pass? |
|------|---------|-------|
| 1 | Language selection screen | ⬜ |
| 2 | Language buttons on login | ⬜ |
| 3 | Sidebar menu translation | ⬜ |
| 4 | Farms page translation | ⬜ |
| 5 | PDF export working | ⬜ |
| 6 | Dashboard translation | ⬜ |

---

## 🐛 If Something Doesn't Work

### Language Screen Not Showing?
```javascript
// Try this in console:
localStorage.removeItem('languageSelected');
localStorage.removeItem('language');
location.reload();
```

### Language Not Changing?
- Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
- Clear cache and reload

### PDF Export Error?
- Check browser console (F12) for errors
- File might download as CSV instead (that's OK!)
- Make sure you have at least 1 farm added

### Text Not Translating?
- Some pages are partially translated (Dashboard, Farms fully work)
- Other pages coming soon

---

## ✅ MINIMUM SUCCESS CRITERIA

Your system is working if **at least 3 tests pass**, especially:
- ✅ Test 3: Sidebar translates
- ✅ Test 4: Farms page translates
- ✅ Test 5: PDF export works

---

## 🎉 ALL TESTS PASSED?

Congratulations! Your Agriculture AI system has:
- ✅ Multi-language support working
- ✅ Language selection on first visit
- ✅ PDF export functional
- ✅ All servers running properly

---

## 📞 Still Having Issues?

Check the browser console (F12 → Console tab) and look for:
- Red error messages
- Any "404" or "500" errors
- API connection errors

Copy any error messages you see!

---

**Go to**: http://localhost:3000  
**Start with**: Test 1 (Clear localStorage)
