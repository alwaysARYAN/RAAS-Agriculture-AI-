# 🚀 START HERE - Deploy RAAS to Production

**Your app is 100% ready to go live!**

---

## ⚡ **Quick Deploy (10 Minutes)**

### **Step 1: Push to GitHub**
```powershell
# Create repo at: https://github.com/new (name it: raas-agriculture-ai)

git remote add origin https://github.com/YOUR-USERNAME/raas-agriculture-ai.git
git push -u origin main
```

### **Step 2: Deploy Backend**
```powershell
.\deploy-backend.ps1
```
**Then:** Add environment variables in Vercel Dashboard (copy from below)

### **Step 3: Deploy Frontend**
```powershell
.\deploy-frontend.ps1
```
**Enter your backend URL when prompted**

### **Step 4: Configure Database**
1. Go to https://cloud.mongodb.com
2. Network Access → Add IP → Allow 0.0.0.0/0

### **Step 5: Update CORS**
1. Go to Vercel → Backend Project → Settings → Environment Variables
2. Edit `CORS_ORIGIN` to your frontend URL
3. Redeploy backend

---

## 🔑 **Environment Variables to Add in Vercel**

### **Backend Variables:**
```
NODE_ENV=production
MONGODB_URI=mongodb://alwaysaryan49:RAASTechMates@ac-ijtrk2i-shard-00-00.gn0r4ti.mongodb.net:27017,ac-ijtrk2i-shard-00-01.gn0r4ti.mongodb.net:27017,ac-ijtrk2i-shard-00-02.gn0r4ti.mongodb.net:27017/?ssl=true&replicaSet=atlas-5w07vj-shard-0&authSource=admin&appName=Cluster0
JWT_SECRET=8f9e2b1c4d7a6e3f5b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k1l2
GEMINI_API_KEY=AQ.Ab8RN6I0evctp6yhFD_UHzXw2VO0ZLyI2hiUzgctzGJ2t_QTcg
OPENWEATHER_API_KEY=28bdcbb5821ac3d40c443a5ba270548d
CLOUDINARY_CLOUD_NAME=qt2s0cym
CLOUDINARY_API_KEY=698772989194482
CLOUDINARY_API_SECRET=RMv0oMFTMVdBM-IjauA7GU5PuPs
MANDI_SHEET_URL=https://docs.google.com/spreadsheets/d/e/2PACX-1vR5VYq2Uupjo8xaykMyNgu60VS1PyimzbzQNqjG3X5Wm6c5rEQ0n1xRt-aTsUGCdRcOeiYp9AXKW1Vq/pub?gid=0&single=true&output=csv
SCHEMES_SHEET_URL=https://docs.google.com/spreadsheets/d/e/2PACX-1vR5VYq2Uupjo8xaykMyNgu60VS1PyimzbzQNqjG3X5Wm6c5rEQ0n1xRt-aTsUGCdRcOeiYp9AXKW1Vq/pub?gid=1778472122&single=true&output=csv
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### **Frontend Variable:**
```
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
```

---

## 📚 **Documentation**

| Guide | Purpose | Time |
|-------|---------|------|
| **`QUICK_DEPLOY.md`** | Quick deployment reference | 10 min |
| **`DEPLOY_NOW.md`** | Detailed step-by-step guide | 15 min |
| **`MONGODB_ATLAS_SETUP.md`** | Database configuration | 5 min |
| **`DEPLOYMENT_COMPLETE.md`** | What's been prepared | Reference |

---

## 🎯 **What's Ready**

✅ Frontend built (364KB)  
✅ Backend configured  
✅ Security enabled  
✅ Database ready  
✅ Git initialized  
✅ Deployment scripts ready  

---

## 🆘 **Issues?**

**Backend not working?**  
→ Check MongoDB allows 0.0.0.0/0 in Network Access

**Frontend can't connect?**  
→ Verify REACT_APP_API_URL is correct  
→ Check CORS_ORIGIN in backend

**Build failed?**  
→ Run `npm install` in client and server folders

---

## 🎉 **Let's Go Live!**

Choose your path:

1. **Automated:** Run `.\deploy-backend.ps1` and `.\deploy-frontend.ps1`
2. **Quick:** Follow `QUICK_DEPLOY.md`
3. **Detailed:** Follow `DEPLOY_NOW.md`

**Time to production:** 10-15 minutes ⏱️

---

**🌾 RAAS - Roots AI Agriculture Solutions**  
**Ready to serve farmers worldwide! 🌍**
