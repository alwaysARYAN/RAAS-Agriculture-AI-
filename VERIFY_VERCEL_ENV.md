# ⚠️ CRITICAL: Verify Vercel Environment Variables

**Issue:** Nothing is working in production

**Root Cause:** Environment variables not properly set in Vercel

---

## 🔍 Issue Analysis

### What's Happening:
1. ❌ Socket errors still appearing
2. ❌ Gemini API not responding
3. ❌ AI features not working
4. ❌ Backend deployed but env vars missing

### Root Problem:
**GEMINI_API_KEY not set in Vercel production environment!**

---

## ✅ SOLUTION: Set Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard

**Backend Project:**
1. Open: https://vercel.com/dashboard
2. Click on: `raas-backend-ten` project
3. Go to: Settings → Environment Variables

### Step 2: Add GEMINI_API_KEY

**Variable Details:**
```
Name: GEMINI_API_KEY
Value: AQ.Ab8RN6Keix... (your full key)
Environment: Production, Preview, Development (ALL)
```

**How to Add:**
1. Click "Add New" button
2. Enter variable name: `GEMINI_API_KEY`
3. Enter value: (your full AQ.Ab8RN6Keix... key from server/.env file)
4. Select ALL environments (Production, Preview, Development)
5. Click "Save"

### Step 3: Verify Other Variables

**Required Backend Environment Variables:**

1. **MONGODB_URI**
   ```
   mongodb+srv://alwaysaryan49:RAASTechMates@cluster0.gn0r4ti.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

2. **JWT_SECRET**
   ```
   8f9e2b1c4d7a6e3f5b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k1l2
   ```

3. **GEMINI_API_KEY** (MOST IMPORTANT!)
   ```
   AQ.Ab8RN6Keix... (use your full key)
   ```

4. **OPENWEATHER_API_KEY**
   ```
   28bdcbb5821ac3d40c443a5ba270548d
   ```

5. **CLOUDINARY_CLOUD_NAME**
   ```
   qt2s0cym
   ```

6. **CLOUDINARY_API_KEY**
   ```
   698772989194482
   ```

7. **CLOUDINARY_API_SECRET**
   ```
   RMv0oMFTMVdBM-IjauA7GU5PuPs
   ```

8. **NODE_ENV**
   ```
   production
   ```

---

## 🚀 After Adding Environment Variables

### Step 4: Redeploy Backend

**Option A: From Vercel Dashboard**
1. Go to Deployments tab
2. Click on latest deployment
3. Click "Redeploy" button
4. Select "Use existing Build Cache" = NO
5. Click "Redeploy"

**Option B: From Git (Trigger Auto-Deploy)**
1. Make any small change (add comment to any file)
2. Git commit and push
3. Vercel will auto-deploy

---

## 🧪 How to Verify Variables are Set

### Method 1: Check Vercel Dashboard
1. Go to Settings → Environment Variables
2. You should see ALL variables listed
3. Each should show: Production ✓ Preview ✓ Development ✓

### Method 2: Test Backend Health with Env Check

Create a test endpoint to verify (temporary):

**Add to server.js:**
```javascript
app.get('/api/test-env', (req, res) => {
  res.json({
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    keyPrefix: process.env.GEMINI_API_KEY?.substring(0, 5),
    hasMongoDB: !!process.env.MONGODB_URI,
    hasJWT: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV
  });
});
```

Then test:
```
https://raas-backend-ten.vercel.app/api/test-env
```

Expected Response:
```json
{
  "hasGeminiKey": true,
  "keyPrefix": "AQ.Ab",
  "hasMongoDB": true,
  "hasJWT": true,
  "nodeEnv": "production"
}
```

---

## ⚠️ Common Mistakes

### Mistake 1: Only Set for Production
- ❌ Only selecting "Production" environment
- ✅ Select ALL environments (Production, Preview, Development)

### Mistake 2: Wrong Key Format
- ❌ Adding quotes around value: `"AQ.Ab8..."`
- ✅ Raw value without quotes: `AQ.Ab8...`

### Mistake 3: Typo in Variable Name
- ❌ `GEMINI_KEY` or `GOOGLE_API_KEY`
- ✅ Exact name: `GEMINI_API_KEY`

### Mistake 4: Not Redeploying
- ❌ Adding variables but not redeploying
- ✅ Must redeploy after adding/changing env vars

---

## 🎯 Complete Setup Checklist

### Backend Environment Variables:
- [ ] MONGODB_URI - Database connection
- [ ] JWT_SECRET - Authentication
- [ ] GEMINI_API_KEY - AI features (CRITICAL!)
- [ ] OPENWEATHER_API_KEY - Weather data
- [ ] CLOUDINARY_CLOUD_NAME - Image storage
- [ ] CLOUDINARY_API_KEY - Image storage
- [ ] CLOUDINARY_API_SECRET - Image storage
- [ ] NODE_ENV=production - Environment

### Frontend Environment Variables:
- [ ] REACT_APP_API_URL=https://raas-backend-ten.vercel.app/api

### Post-Setup:
- [ ] All variables visible in Vercel dashboard
- [ ] Redeployed backend after adding variables
- [ ] Tested health endpoint (200 OK)
- [ ] Tested AI endpoint (working)

---

## 🔧 Quick Fix Commands

### If You Have Vercel CLI:

```powershell
# Login to Vercel
vercel login

# Link to backend project
cd d:\agriculture-ai\server
vercel link

# Add environment variable
vercel env add GEMINI_API_KEY production

# When prompted, paste your full AQ.Ab8RN6Keix... key

# Redeploy
vercel --prod
```

---

## 📊 Expected Timeline

```
Time 0:00 - Add env variables in Vercel
Time 0:02 - Click Redeploy
Time 2:00 - Build starts
Time 4:00 - Deployment completes
Time 5:00 - Ready to test
```

---

## ✅ How to Confirm It's Working

### Test 1: Backend Health
```powershell
curl https://raas-backend-ten.vercel.app/health
```
Expected: `{"success":true,...}`

### Test 2: Check Environment (if test endpoint added)
```powershell
curl https://raas-backend-ten.vercel.app/api/test-env
```
Expected: `{"hasGeminiKey":true,"keyPrefix":"AQ.Ab",...}`

### Test 3: Try AI Chat
1. Login to frontend
2. Go to chatbot
3. Ask question
4. Should get AI response!

---

## 🚨 If Still Not Working

### Debug Steps:

1. **Check Vercel Build Logs:**
   - Go to Vercel Dashboard
   - Click on latest deployment
   - Check "Build Logs"
   - Look for errors

2. **Check Runtime Logs:**
   - Go to deployment
   - Click "View Function Logs"
   - Check for errors when AI is called

3. **Verify Key is Actually There:**
   - Add temporary test endpoint (see above)
   - Call it and verify `hasGeminiKey: true`

4. **Test Gemini API Directly:**
   - Go to: https://aistudio.google.com/app/apikey
   - Test your key in their playground
   - Verify quota is not exceeded

---

## 📝 Important Notes

### About Environment Variables:
- Environment variables are ONLY loaded at build time for serverless functions
- You MUST redeploy after adding/changing env vars
- Changes don't take effect until redeployment completes
- Vercel caches builds, so use "Redeploy" not just "Rebuild"

### About Gemini API Key:
- New format starts with `AQ.` (not `AIzaSy`)
- Must be from: https://aistudio.google.com/app/apikey
- Check quota/billing if key valid but not working
- Free tier: 15 requests per minute

---

## 🎉 Success Indicators

**You'll know it's working when:**

✅ Vercel dashboard shows all env vars  
✅ Backend redeploy completes successfully  
✅ Health endpoint responds  
✅ Test env endpoint shows `hasGeminiKey: true`  
✅ **AI Chatbot responds to questions**  
✅ **Disease detection analyzes images**  

**The two in bold are the ultimate test!**

---

**NEXT STEP: Go to Vercel dashboard and verify/add GEMINI_API_KEY!**
