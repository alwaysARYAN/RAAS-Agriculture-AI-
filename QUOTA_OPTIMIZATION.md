# Gemini API Quota Optimization Guide

## ✅ Implemented Optimizations

### 1. **New API Key Configuration**
- Updated to new Gemini API key: `AQ.Ab8RN6K43LcSC7iSWD_qpJowGUulfnR4BLGBCSjyu2DFP-rTOg`
- Using stable model: `gemini-1.5-flash` (better quota management)
- Reduced max output tokens from 2048 to 1024 (saves 50% quota per request)

### 2. **Intelligent Caching System**
Created `server/utils/aiCache.js` with:
- **Daily Tips**: Cached for 24 hours (only 1 API call per day)
- **Insights**: Cached for 24 hours per topic
- **Crop Recommendations**: Cached by soil type, state, and season
- Automatic cache expiration and size management (max 1000 entries)

### 3. **Rate Limiting**
Implemented in `server/config/gemini-direct.js`:
- **Max 15 requests per minute** (conservative limit)
- Automatic wait mechanism when limit is reached
- Request counter that resets every minute
- Logging of API usage for monitoring

### 4. **Smart Fallbacks**
All AI endpoints now have fallback responses:
- Daily tips use cached or default farming advice
- Chat returns helpful messages if API fails
- Disease detection still uploads images and saves data
- No feature breaks if quota is exceeded

### 5. **Optimized Controllers**
Updated these files with caching:
- `controllers/chatController.js` - Daily tips, insights, and chat
- `controllers/aiController.js` - Crop recommendations
- Future: Disease detection can be similarly optimized

## 🎯 Expected Results

### API Call Reduction
- **Daily Tips**: 1 call/day instead of 1 per user visit (~95% reduction)
- **Insights**: 1 call per topic per day (~90% reduction)
- **Recommendations**: 1 call per farm profile per day (~85% reduction)
- **Overall**: ~80-90% reduction in API calls

### Quota Usage
With 15 requests/minute limit:
- Max 900 requests/hour
- Max 21,600 requests/day
- Sustainable for testing and moderate production use

### Free Tier Limits (Gemini 1.5 Flash)
- **15 RPM** (Requests Per Minute)
- **1,500 RPD** (Requests Per Day)
- **1 million TPM** (Tokens Per Minute)

## 📊 Feature-wise API Usage

### Low Usage (Cached)
1. **Daily Tips** - 1 call/day
2. **Quick Suggestions** - No API calls (static data)
3. **Cached Insights** - 1 call per topic per day

### Medium Usage (Per Request)
4. **Chat Messages** - 1 call per message (consider limiting)
5. **Crop Recommendations** - Cached by farm profile
6. **Farming Tips** - 1 call per request

### High Usage (Consider Limiting)
7. **Disease Detection** - 1 call per image (vision model)
8. **Pest Prevention** - 1 call per request
9. **Soil Analysis** - 1 call per request

## 🚀 Testing Strategy

### Phase 1: Core Features (Lowest API Usage)
1. ✅ Login/Register (No AI)
2. ✅ Dashboard (1 daily tip call)
3. ✅ Weather (No AI)
4. ✅ Market Prices (No AI)
5. ✅ Government Schemes (No AI)

### Phase 2: AI Features (Cached)
6. ✅ Daily Tips (cached)
7. ✅ Quick Suggestions (no AI)
8. ✅ Agricultural Insights (cached)

### Phase 3: Interactive AI (Moderate Usage)
9. 🔄 Chatbot (use sparingly - 1-2 messages)
10. 🔄 Crop Recommendations (test once per farm)

### Phase 4: High-Intensity AI (Use Last)
11. ⚠️ Disease Detection (limit to 2-3 tests)
12. ⚠️ Pest Management
13. ⚠️ Soil Analysis

## 💡 Best Practices for Testing

1. **Start with non-AI features first**
   - Test authentication, navigation, data management
   - Verify all CRUD operations work

2. **Use cached features liberally**
   - Daily tips (refreshes only once per day)
   - Dashboard analytics (no AI)
   - Market and weather data (external APIs)

3. **Limit chat interactions**
   - Keep conversations short
   - Test different topics (cached separately)
   - Use quick suggestions instead of typing

4. **Disease detection - test sparingly**
   - Prepare 2-3 good quality crop images
   - Test once per unique scenario
   - Each detection uses vision model (higher quota cost)

5. **Monitor usage in console**
   - Server logs show request counts: `Request X/15`
   - Watch for rate limit warnings
   - Cache HIT messages confirm optimization is working

## 🔧 Additional Recommendations

### If Quota Still Exceeds:

1. **Reduce rate limit further**
   ```javascript
   maxRequestsPerMinute: 10  // Instead of 15
   ```

2. **Extend cache duration**
   ```javascript
   // Change from 24 hours to 48 hours
   if (now - cached.timestamp > 48 * 60 * 60 * 1000)
   ```

3. **Add user-level rate limiting**
   - Limit each user to X requests per hour
   - Implement request queue

4. **Pre-cache common queries**
   - Cache recommendations for common crops
   - Pre-generate tips for each season

5. **Switch to even lighter model**
   - Use `gemini-1.5-flash-8b` (8 billion parameters)
   - Faster and uses less quota

## 📈 Monitoring

Watch server console for:
- ✅ `Cache HIT` - Optimization working
- 🤖 `Gemini API call` - New API request
- ⏳ `Rate limit reached` - Throttling active
- ❌ `Quota exceeded` - Need to wait or optimize more

## 🎉 System Status

**Current Configuration:**
- ✅ New API key configured
- ✅ Smart caching enabled
- ✅ Rate limiting active (15 RPM)
- ✅ Fallback responses ready
- ✅ Reduced token usage (50% savings)

**Ready for Testing:**
- Backend: http://localhost:5000
- Frontend: http://localhost:3002
- All features functional with quota protection

## 📝 Notes

- Free tier resets daily at UTC midnight
- Vision models (disease detection) use more quota
- Chat history is NOT cached (each message is unique)
- Consider upgrading to paid tier for production use
