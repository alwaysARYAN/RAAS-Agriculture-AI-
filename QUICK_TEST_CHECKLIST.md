# 🚀 Quick Test Checklist

## ⚡ System URLs
- **Frontend**: http://localhost:3002
- **Backend**: http://localhost:5000

## ✅ 5-Minute Quick Test

### 1. Open App (10 sec)
- [ ] Visit http://localhost:3002
- [ ] Page loads successfully

### 2. Register Account (30 sec)
- [ ] Click "Register"
- [ ] Fill: Name, Email, Password
- [ ] Select State & Soil Type
- [ ] Submit → Success

### 3. Dashboard (20 sec)
- [ ] View dashboard
- [ ] See daily tip (cached - 1 API call)
- [ ] Check weather widget
- [ ] View notifications

### 4. Add Farm (30 sec)
- [ ] Click "Farms" → "Add Farm"
- [ ] Enter: Farm Name, Area, Soil Type
- [ ] Save → Success

### 5. Add Crop (30 sec)
- [ ] Click "Crops" → "Add Crop"
- [ ] Select farm, crop type
- [ ] Set planting date
- [ ] Save → Success

### 6. Check Market (20 sec)
- [ ] Click "Market Prices"
- [ ] Browse mandi data
- [ ] Search for crop

### 7. View Schemes (20 sec)
- [ ] Click "Government Schemes"
- [ ] Browse available schemes
- [ ] Read scheme details

### 8. Test Chatbot (40 sec) ⚠️ Uses AI Quota
- [ ] Open chatbot
- [ ] Ask: "What is the best time to sow wheat?"
- [ ] Get AI response
- [ ] **STOP** (save quota)

### 9. Get Recommendations (30 sec) - Cached
- [ ] Go to "Recommendations"
- [ ] Click "Get Recommendations"
- [ ] View 3 crop suggestions
- [ ] Check profit estimates

### 10. Test Disease Detection (60 sec) ⚠️ High Quota Usage
**ONLY if quota available**
- [ ] Go to "Disease Detection"
- [ ] Upload crop image (JPEG/PNG)
- [ ] Submit for analysis
- [ ] View diagnosis & treatment

---

## 📊 Server Console Checklist

Look for these messages:

✅ **Working Correctly**:
```
✅ Cache HIT
🤖 Gemini API call - Request 3/15
✅ MongoDB Connected
```

⚠️ **Warning (Normal)**:
```
⏳ Rate limit reached. Waiting...
```

❌ **Problem (Stop AI Testing)**:
```
❌ Gemini API quota exceeded
```

---

## 🎯 Priority Features to Test

### High Priority (Test First)
1. ✅ Registration/Login
2. ✅ Dashboard
3. ✅ Farm Management
4. ✅ Crop Management
5. ✅ Weather
6. ✅ Market Prices

### Medium Priority (Test Next)
7. ✅ Daily Tips (cached)
8. ✅ Government Schemes
9. ✅ Recommendations (cached)
10. ✅ Analytics

### Low Priority (Test Last)
11. ⚠️ Chatbot (2-3 questions max)
12. ⚠️ Disease Detection (1-2 images max)

---

## 💡 Quick Tips

1. **Start with non-AI features** - They don't use quota
2. **Daily tip is cached** - Only 1 API call per day
3. **Recommendations are cached** - Safe to test multiple times
4. **Chatbot uses quota** - Keep questions to 2-3 max
5. **Disease detection uses most quota** - Test last, 1-2 images only

---

## 🐛 Quick Fixes

**Page won't load?**
→ Check if servers are running (ports 5000 & 3002)

**Can't login?**
→ Register first, then login with same credentials

**Quota exceeded?**
→ Normal - features use fallback responses

**Cache not working?**
→ Restart server with `npm run dev` in server folder

---

## ✨ Demo-Ready Features (No AI Quota)

Perfect for showing off:
- Modern responsive UI
- Real-time weather data
- Live market prices
- Multi-language support
- Farm & crop management
- Analytics dashboard
- Government schemes database
- Notification system

---

**Total Test Time**: ~5-7 minutes  
**API Calls Used**: ~3-5 (if following guide)  
**Quota Remaining**: 1,495+ requests today

**Ready to test! 🎉**
