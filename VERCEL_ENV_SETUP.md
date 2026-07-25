# 🔧 Vercel Environment Variables Setup

## ⚠️ CRITICAL: Backend CORS Fix

**Problem:** Backend CORS_ORIGIN wrong hai, isliye frontend connect nahi ho pa raha!

---

## 📋 Steps to Fix:

### 1. Go to Vercel Backend Dashboard
```
https://vercel.com/hellofab3-7126s-projects/raas-backend
```

### 2. Click on "Settings" → "Environment Variables"

### 3. Update/Add this variable:

**Variable Name:** `CORS_ORIGIN`  
**Value:** `https://raas-agriculture-final.vercel.app`  
**Environment:** `Production`

---

## 🔄 Alternative: Quick Fix via Vercel CLI

```bash
cd server
vercel env add CORS_ORIGIN production
# When prompted, enter: https://raas-agriculture-final.vercel.app
```

---

## ✅ All Required Backend Environment Variables:

```
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret-key>
GEMINI_API_KEY=<your-gemini-api-key>
OPENWEATHER_API_KEY=<your-openweather-api-key>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
CORS_ORIGIN=https://raas-agriculture-final.vercel.app
NODE_ENV=production
```

---

## 🚀 After Adding Variable:

1. **Redeploy Backend:**
   ```bash
   cd server
   vercel --prod
   ```

2. **Or trigger auto-redeploy:**
   - Make any small change in server code
   - Commit and push to trigger new deployment

---

## 🧪 Test Backend:

```bash
curl https://raas-backend-ten.vercel.app/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Agriculture AI Server is running",
  "timestamp": "...",
  "environment": "production"
}
```

---

## 📝 Frontend Configuration (Already Fixed):

**File:** `client/.env.production`
```
REACT_APP_API_URL=https://raas-backend-ten.vercel.app/api
```

---

## ✅ Success Checklist:

- [ ] CORS_ORIGIN set to frontend URL
- [ ] Backend redeployed
- [ ] Frontend can register/login
- [ ] No CORS errors in browser console
- [ ] Network tab shows successful API calls

---

**After these steps, registration aur login dono kaam karenge!** 🎉
