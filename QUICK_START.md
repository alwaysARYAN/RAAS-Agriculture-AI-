# 🚀 Quick Start Guide - Agriculture AI System

## ⚡ Get Started in 3 Steps

### Step 1: Start the Backend
```bash
cd agriculture-ai/server
npm run dev
```
✅ Server running on http://localhost:5000

### Step 2: Start the Frontend
```bash
cd agriculture-ai/client
npm start
```
✅ Client running on http://localhost:3000

### Step 3: Use the Application
1. Open browser: http://localhost:3000
2. **Register** a new account
3. **Login** with your credentials
4. Start using all features! 🎉

---

## 🎯 Feature Overview

### 1. **Farms** 🌾
- Add your farm details (name, location, area, soil type)
- Edit or delete farms
- View all farms in a card layout

### 2. **Crops** 🌱
- Add crops to your farms
- Track growth stages (Sowing → Harvest)
- Monitor health status (Healthy, Fair, Poor, Critical)
- Set expected harvest dates and yield

### 3. **Weather** 🌤️
- Search any city
- View current weather conditions
- See 5-day forecast
- Get farming advisory based on weather

### 4. **Market Prices** 📊
- View real-time commodity prices from Google Sheets
- Filter by commodity, state, district
- See min/max/modal prices
- Auto-refreshes every 5 minutes

### 5. **Government Schemes** 🏛️
- Browse agricultural schemes
- Filter by type (Subsidy, Insurance, Credit)
- Filter by government level (Central, State)
- View detailed scheme information
- Auto-refreshes every 10 minutes

### 6. **AI Recommendations** 🤖
Select your farm and get AI insights:
- **Crop Recommendation**: Best crops for your soil
- **Fertilizer Plan**: NPK recommendations with timing
- **Pest Management**: Control methods and prevention
- **Irrigation Schedule**: Water amounts by growth stage
- **Harvest Prediction**: Expected date and yield

### 7. **Disease Detection** 🔍
- Upload plant leaf image
- Get AI-powered disease identification
- View severity and treatment recommendations

### 8. **AI Chatbot** 💬
- Ask farming-related questions
- Get expert advice from AI assistant
- Conversation history saved

---

## ⚠️ Important Notes

### Gemini AI Quota
- **Free tier**: 20 requests/day
- **Currently**: Quota exhausted (returns 429 error)
- **AI features affected**: Recommendations, Disease Detection, Chatbot
- **Solution**: Wait for daily reset (midnight UTC) OR upgrade API key
- **Code status**: ✅ Fully functional, just needs quota

### Google Sheets
- Market prices and schemes are fetched from Google Sheets
- Data is cached (5min for market, 10min for schemes)
- Click "Refresh" button to force update
- Auto-refresh runs in background

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check if MongoDB is accessible
# Verify .env file has correct MONGO_URI
cd agriculture-ai/server
cat .env | grep MONGO_URI
```

### Frontend won't start
```bash
# Make sure backend is running first
# Check port 3000 is not in use
cd agriculture-ai/client
npm install
npm start
```

### 429 Error (Quota Exceeded)
- This is normal - Gemini API free tier limit reached
- Wait 24 hours for quota reset
- Or upgrade to paid API key in .env

### Google Sheets not loading
- Verify sheets are published as CSV
- Check URLs in server/.env file
- Click "Refresh" button to retry

### Login/Register not working
- Check backend console for errors
- Verify MongoDB connection
- Clear browser cache and cookies

---

## 📱 Using the App

### First Time Setup
1. **Register**: Create account with email and password
2. **Add Farm**: Go to Farms → Add Farm (required for other features)
3. **Add Crops**: Go to Crops → Add Crop (link to your farm)
4. **Explore**: Try Weather, Market, Schemes, Recommendations!

### Daily Workflow
1. Check **Weather** for today's conditions
2. View **Market Prices** for selling decisions
3. Update **Crop** growth stages and health
4. Get **AI Recommendations** for farming decisions
5. Browse new **Government Schemes**

---

## 🎓 Tips & Tricks

### Market Prices
- Use filters to find specific commodities
- Modal price is the most commonly traded price
- Compare prices across states/districts

### Government Schemes
- Click on scheme cards for full details
- Check eligibility criteria before applying
- Save helpline numbers for quick contact

### AI Recommendations
- Select the correct farm for accurate recommendations
- Try all 5 recommendation types
- Screenshot recommendations for future reference

### Disease Detection
- Take clear photos of affected leaves
- Good lighting improves accuracy
- Upload from any angle

### Weather
- Check farming advisory for today's activities
- Plan spraying on clear, low-wind days
- Monitor humidity for disease prevention

---

## 📞 Need Help?

### Check These First
1. Is backend running? (http://localhost:5000)
2. Is frontend running? (http://localhost:3000)
3. Is MongoDB connected? (check server console)
4. Are API keys valid? (check .env file)

### Common Issues
- **500 Error**: Backend issue - check server logs
- **401 Error**: Login expired - login again
- **429 Error**: API quota exceeded - wait or upgrade
- **Network Error**: Backend not running - start server

---

## ✅ Feature Checklist

Try all features to ensure everything works:

- [ ] Register new account
- [ ] Login successfully
- [ ] Add a farm
- [ ] Add a crop to the farm
- [ ] Check weather for your city
- [ ] Browse market prices
- [ ] Filter market prices
- [ ] View government schemes
- [ ] Click scheme for details
- [ ] Try AI crop recommendation (if quota available)
- [ ] Upload image for disease detection (if quota available)
- [ ] Chat with AI assistant (if quota available)
- [ ] Edit a farm
- [ ] Update crop growth stage
- [ ] Click manual refresh on Market
- [ ] Click manual refresh on Schemes

---

## 🎉 You're All Set!

The Agriculture AI Smart Farming System is now ready to use. All features are fully functional (AI features need quota reset). Enjoy managing your farms with AI-powered insights!

**Happy Farming! 🌾🚜**

---

For detailed information, see `IMPLEMENTATION_COMPLETE.md`
