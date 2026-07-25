# ⚡ RAAS - Quick Deploy Guide

**Get your app live in 10 minutes!**

---

## 🎯 **What You Need**

1. GitHub account (free) - https://github.com
2. Vercel account (free) - https://vercel.com
3. Your code (already ready!)

---

## 🚀 **3-Step Deployment**

### **STEP 1: Push to GitHub** (2 min)

```powershell
# Create repo at: https://github.com/new
# Name it: raas-agriculture-ai
# Then run:

cd d:\agriculture-ai
git remote add origin https://github.com/YOUR-USERNAME/raas-agriculture-ai.git
git push -u origin main
```

---

### **STEP 2: Deploy Backend** (4 min)

**Option A - Automated Script:**
```powershell
.\deploy-backend.ps1
```

**Option B - Manual:**
```powershell
npm install -g vercel
cd server
vercel login
vercel --prod
```

**Add Environment Variables in Vercel Dashboard:**

Go to: Project → Settings → Environment Variables

```
MONGODB_URI=mongodb://alwaysaryan49:RAASTechMates@ac-ijtrk2i-shard-00-00.gn0r4ti.mongodb.net:27017,ac-ijtrk2i-shard-00-01.gn0r4ti.mongodb.net:27017,ac-ijtrk2i-shard-00-02.gn0r4ti.mongodb.net:27017/?ssl=true&replicaSet=atlas-5w07vj-shard-0&authSource=admin&appName=Cluster0

JWT_SECRET=8f9e2b1c4d7a6e3f5b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k1l2

GEMINI_API_KEY=AQ.Ab8RN6I0evctp6yhFD_UHzXw2VO0ZLyI2hiUzgctzGJ2t_QTcg

OPENWEATHER_API_KEY=28bdcbb5821ac3d40c443a5ba270548d

CLOUDINARY_CLOUD_NAME=qt2s0cym
CLOUDINARY_API_KEY=698772989194482
CLOUDINARY_API_SECRET=RMv0oMFTMVdBM-IjauA7GU5PuPs

NODE_ENV=production
```

**Copy your backend URL!** (e.g., https://raas-backend-abc123.vercel.app)

---

### **STEP 3: Deploy Frontend** (4 min)

**Option A - Automated Script:**
```powershell
.\deploy-frontend.ps1
# Enter your backend URL when prompted
```

**Option B - Manual:**
```powershell
cd client
vercel --prod
# Add env var in Vercel: REACT_APP_API_URL=https://your-backend-url.vercel.app/api
```

---

## ✅ **Final Step: Update CORS**

1. Go to Vercel Dashboard → Backend Project
2. Settings → Environment Variables
3. Add/Edit: `CORS_ORIGIN` = `https://your-frontend-url.vercel.app`
4. Deployments → Three dots → Redeploy

---

## 🌐 **Configure MongoDB Atlas**

⚠️ **Required for backend to work:**

1. Go to https://cloud.mongodb.com
2. Network Access → Add IP Address
3. Allow Access from Anywhere (0.0.0.0/0)
4. Confirm

---

## 🎉 **You're Live!**

**Your URLs:**
- Frontend: `https://raas-frontend-xyz.vercel.app`
- Backend: `https://raas-backend-xyz.vercel.app`

**Test:**
1. Open frontend URL
2. Register new account
3. Login
4. Test features!

---

## ❓ **Common Issues**

**Backend 500 error?**
→ Check MongoDB network access (0.0.0.0/0)

**Frontend can't connect?**
→ Verify REACT_APP_API_URL in frontend env vars
→ Check CORS_ORIGIN in backend env vars

**Build failed?**
→ Run `npm install` in client/server folders

---

## 📚 **Full Documentation**

See `DEPLOY_NOW.md` for detailed instructions, troubleshooting, and advanced features.

---

**Questions? Check:**
- DEPLOY_NOW.md - Complete guide
- MONGODB_ATLAS_SETUP.md - Database setup
- DEPLOYMENT_GUIDE.md - All deployment options

🌾 **Happy Farming with RAAS!**
