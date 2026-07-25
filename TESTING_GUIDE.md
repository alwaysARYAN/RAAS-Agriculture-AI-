# Agriculture AI - Testing Guide

## 🎯 System Status: READY

### Active Services
✅ **Backend Server**: http://localhost:5000  
✅ **Frontend App**: http://localhost:3002  
✅ **Database**: MongoDB Connected  
✅ **AI Service**: Gemini API with Quota Protection  

---

## 🚀 Quick Start Testing

### Step 1: Access the Application
Open your browser and go to: **http://localhost:3002**

### Step 2: Register a New Account
1. Click "Register" or "Sign Up"
2. Fill in your details:
   - Name
   - Email
   - Phone
   - State (for location-based features)
   - Soil Type (for recommendations)
   - Land Size
3. Create a password
4. Click Register

### Step 3: Explore Features (In Order of API Usage)

---

## 📋 Testing Checklist

### ✅ Phase 1: Zero AI Usage (Test These First)

#### Authentication & Profile
- [ ] Register new account
- [ ] Login with credentials
- [ ] View profile
- [ ] Update profile information
- [ ] Change language (English/Hindi/Gujarati)

#### Dashboard & Navigation
- [ ] View dashboard overview
- [ ] Check navigation menu
- [ ] View farms summary
- [ ] View crops summary
- [ ] View notifications

#### Weather (External API - No Gemini)
- [ ] View current weather
- [ ] Check 5-day forecast
- [ ] Verify temperature, humidity, conditions

#### Market Prices (Google Sheets - No Gemini)
- [ ] Browse mandi prices
- [ ] Search for specific crops
- [ ] Filter by location
- [ ] View price trends

#### Government Schemes (Google Sheets - No Gemini)
- [ ] Browse available schemes
- [ ] Read scheme details
- [ ] Check eligibility criteria
- [ ] View application links

#### Farm Management (Database - No Gemini)
- [ ] Add a new farm
- [ ] View farm list
- [ ] Edit farm details
- [ ] View farm statistics

#### Crop Management (Database - No Gemini)
- [ ] Add a crop
- [ ] View crop list
- [ ] Update crop status
- [ ] Delete a crop

---

### ✅ Phase 2: Cached AI Features (1 Call Per Day)

#### Daily Farming Tips
- [ ] View daily tip on dashboard
- [ ] Verify it's relevant to current season
- [ ] Refresh page - should show same tip (cached)
- [ ] Check different times - still same tip

**Expected**: Only 1 API call for the entire day

---

### ✅ Phase 3: Moderate AI Usage (Cached Per Topic)

#### AI Recommendations
- [ ] Go to Recommendations page
- [ ] Request crop recommendations
- [ ] View 3 recommended crops
- [ ] Check profit estimates
- [ ] Same request should return cached result

**Expected**: 1 API call per unique farm profile per day

#### Quick Suggestions
- [ ] View quick help suggestions (No API calls - static)
- [ ] Browse by category
- [ ] Click suggested questions

---

### ⚠️ Phase 4: Interactive AI (Use Carefully)

#### Chatbot (1 Call Per Message)
- [ ] Open chatbot
- [ ] Send ONE test message: "What is the best time to sow wheat?"
- [ ] Wait for AI response
- [ ] Try ONE more different question
- [ ] **STOP** - Save quota for other features

**Recommendation**: Test with 2-3 messages max

#### Get Agricultural Insights (Cached Per Topic)
- [ ] Request insight on a topic
- [ ] Same topic request returns cached result

---

### 🔴 Phase 5: High-Intensity AI (Test Last, Use Sparingly)

#### Disease Detection (Vision Model - High Quota Cost)
**IMPORTANT**: Limit to 2-3 total tests

- [ ] Prepare a crop/leaf image (JPEG/PNG)
- [ ] Go to Disease Detection page
- [ ] Upload image
- [ ] Select crop type (optional)
- [ ] Submit for analysis
- [ ] View disease diagnosis
- [ ] Check treatment recommendations
- [ ] View organic vs chemical treatments

**Recommendation**: Test only 2-3 images maximum

#### Other AI Features (Use If Quota Remaining)
- [ ] Pest Prevention Advice
- [ ] Soil Analysis
- [ ] Fertilizer Recommendations
- [ ] Irrigation Schedule
- [ ] Harvest Prediction

---

## 📊 Monitoring Quota Usage

### Check Server Console
Look for these messages:

✅ **Cache Working**:
```
✅ Cache HIT: insights|topic:...
✅ Using cached daily tip
```

🤖 **API Call Made**:
```
🤖 Gemini API call (models/gemini-1.5-flash) - Request 3/15
```

⏳ **Rate Limiting**:
```
⏳ Rate limit reached. Waiting 45s...
```

❌ **Quota Exceeded** (If this appears, stop AI testing):
```
❌ Gemini API quota exceeded
```

---

## 💡 Smart Testing Tips

### 1. **Test Non-AI Features Thoroughly First**
Spend most time on:
- Authentication flow
- Farm and crop management
- Weather and market data
- Navigation and UI/UX
- Profile updates
- Notifications

### 2. **Use Caching to Your Advantage**
- Daily tips: One per day automatically
- Recommendations: Request once per farm
- Insights: Ask same topics multiple times (cached)

### 3. **Save AI Quota for Critical Features**
Priority order:
1. Daily tip (auto-cached) ✅
2. Crop recommendations (cached) ✅
3. Chatbot (2-3 questions) ⚠️
4. Disease detection (2-3 images) 🔴

### 4. **Test Edge Cases**
- Empty states (no farms, no crops)
- Form validations
- Error handling
- Responsive design (mobile view)
- Language switching
- Logout and re-login

---

## 🐛 Common Issues & Solutions

### Issue: "Quota Exceeded" Error
**Solution**: 
- Wait for quota reset (midnight UTC)
- Features will work with fallback responses
- Non-AI features work normally

### Issue: Rate Limit Warning
**Solution**:
- System will automatically wait
- This is normal and protects your quota
- Continue testing non-AI features

### Issue: Cached Response
**Solution**:
- This is intentional and saves quota
- Responses are fresh for 24 hours
- Cache clears automatically

### Issue: Disease Detection Not Working
**Solution**:
- Check image format (JPEG/PNG only)
- Image size should be < 5MB
- Try with a clear, well-lit crop image
- Verify Gemini API key is correct

---

## 📈 Success Metrics

### What to Verify:
- [ ] All pages load without errors
- [ ] User can register and login
- [ ] Farms and crops can be added/edited
- [ ] Weather shows real data
- [ ] Market prices are current
- [ ] Daily tip appears (cached)
- [ ] Chatbot responds (when tested)
- [ ] Disease detection analyzes images (when tested)
- [ ] No app crashes or white screens
- [ ] Multi-language works
- [ ] Notifications appear
- [ ] Data persists after logout/login

---

## 🎉 Testing Complete Checklist

After completing all phases:

- [ ] Tested all non-AI features thoroughly
- [ ] Verified caching is working (saw cache HIT messages)
- [ ] Used chatbot sparingly (2-3 messages)
- [ ] Tested disease detection (2-3 images max)
- [ ] Checked mobile responsiveness
- [ ] Verified data persistence
- [ ] Tested all CRUD operations
- [ ] No critical bugs found
- [ ] Ready for demo/presentation

---

## 📞 Support

If you encounter issues:
1. Check server console for error messages
2. Check browser console (F12) for frontend errors
3. Verify .env files have correct API keys
4. Ensure MongoDB connection is active
5. Check QUOTA_OPTIMIZATION.md for API usage details

---

## 🌟 Key Features to Showcase

**Best Features for Demo** (low/no AI usage):
1. ✨ Modern, responsive dashboard
2. 🌤️ Real-time weather integration
3. 💰 Live market prices
4. 🏛️ Government schemes database
5. 🌾 Farm & crop management
6. 🌍 Multi-language support
7. 📊 Analytics and insights
8. 🔔 Real-time notifications

**AI Features to Demo** (use carefully):
1. 🤖 Intelligent chatbot (1-2 questions)
2. 💡 Daily farming tips (cached)
3. 🎯 Crop recommendations (cached)
4. 🔬 Disease detection (1 demo image)

---

**Happy Testing! 🚀**

Remember: Focus on non-AI features first, use AI features sparingly to preserve quota for the most important demonstrations.
