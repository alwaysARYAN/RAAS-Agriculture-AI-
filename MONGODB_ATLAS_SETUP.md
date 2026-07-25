# 🍃 MongoDB Atlas Production Setup Guide

## ✅ **Your Current Database Status**

You already have a MongoDB Atlas connection configured!

**Connection String:**
```
mongodb://alwaysaryan49:RAASTechMates@ac-ijtrk2i-shard-00-00.gn0r4ti.mongodb.net:27017,ac-ijtrk2i-shard-00-01.gn0r4ti.mongodb.net:27017,ac-ijtrk2i-shard-00-02.gn0r4ti.mongodb.net:27017/?ssl=true&replicaSet=atlas-5w07vj-shard-0&authSource=admin&appName=Cluster0
```

**Cluster:** Cluster0  
**Username:** alwaysaryan49  
**Password:** RAASTechMates

---

## 🔧 **Production Database Checklist**

### **1. Verify Network Access (Important for Vercel)**

Your database needs to allow connections from Vercel servers:

1. Go to https://cloud.mongodb.com
2. Login with your credentials
3. Select your project
4. Click **"Network Access"** in the left sidebar
5. Click **"Add IP Address"**
6. Click **"Allow Access from Anywhere"** (for Vercel)
   - Or add: `0.0.0.0/0`
7. Click **"Confirm"**

⚠️ **Important:** This is required for Vercel serverless functions to connect to your database.

---

### **2. Verify Database User Access**

1. Go to **"Database Access"** in MongoDB Atlas
2. Verify user `alwaysaryan49` exists and has:
   - ✅ **Read and write to any database** (atlasAdmin or readWriteAnyDatabase)
3. If not, click **"Edit"** and update privileges

---

### **3. Database Connection for Production**

Your current connection string is already production-ready! Just ensure:

- ✅ Network access allows Vercel IPs (0.0.0.0/0)
- ✅ User has proper permissions
- ✅ SSL is enabled (already set in your connection string)

---

## 🆕 **Alternative: Create New Production Database**

If you want a separate production database:

### **Option 1: New Database in Same Cluster**

1. Go to MongoDB Atlas Dashboard
2. Click **"Browse Collections"**
3. Click **"Create Database"**
4. Database Name: `raas_production`
5. Collection Name: `users`
6. Click **"Create"**

**New Connection String:**
```
mongodb://alwaysaryan49:RAASTechMates@ac-ijtrk2i-shard-00-00.gn0r4ti.mongodb.net:27017,ac-ijtrk2i-shard-00-01.gn0r4ti.mongodb.net:27017,ac-ijtrk2i-shard-00-02.gn0r4ti.mongodb.net:27017/raas_production?ssl=true&replicaSet=atlas-5w07vj-shard-0&authSource=admin&appName=Cluster0
```

### **Option 2: New Cluster for Production**

1. Go to MongoDB Atlas
2. Click **"Build a Cluster"**
3. Choose **"Shared"** (Free tier)
4. Select cloud provider and region closest to your users
5. Cluster Name: `Production-Cluster`
6. Click **"Create Cluster"** (takes 3-5 minutes)

After cluster is ready:
1. Click **"Connect"**
2. Add connection IP (0.0.0.0/0 for Vercel)
3. Create new database user
4. Choose **"Connect your application"**
5. Copy connection string
6. Replace `<password>` with actual password

---

## 🔐 **Security Best Practices**

### **1. Use Environment Variables**

Never hardcode database credentials in code. Always use:

```javascript
// In server code
const MONGODB_URI = process.env.MONGODB_URI;
```

### **2. Rotate Passwords Regularly**

1. Go to **"Database Access"**
2. Click **"Edit"** on user
3. Click **"Edit Password"**
4. Generate new password
5. Update in Vercel environment variables

### **3. Enable Database Auditing**

1. Go to cluster settings
2. Enable **"Advanced Security"**
3. Enable **"Database Auditing"** (paid tier)

### **4. Set Up Backup**

1. Go to cluster settings
2. Enable **"Cloud Backup"**
3. Configure retention policy

---

## 📊 **Monitor Your Database**

### **Atlas Dashboard Metrics**

Monitor these in MongoDB Atlas:

- **Connections:** Should stay under 500 (free tier limit)
- **Operations:** Read/Write operations per second
- **Storage:** Data size and index size
- **Network:** Data transfer in/out

### **Set Up Alerts**

1. Go to **"Alerts"** in Atlas
2. Create alerts for:
   - High connection count (> 400)
   - Low available storage (< 10%)
   - High CPU usage (> 80%)
   - Authentication failures

---

## 🚀 **Connection String Formats**

### **Standard Connection (Your Current):**
```
mongodb://username:password@host1:27017,host2:27017,host3:27017/?options
```

### **SRV Connection (Recommended for New Clusters):**
```
mongodb+srv://username:password@cluster-name.mongodb.net/database?retryWrites=true&w=majority
```

---

## ✅ **Quick Verification Test**

Test your database connection locally before deploying:

```bash
# In server directory
cd d:\agriculture-ai\server
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ MongoDB Connected!')).catch(err => console.error('❌ Error:', err));"
```

---

## 🎯 **For Vercel Deployment**

Add these environment variables in Vercel Dashboard:

**Variable Name:** `MONGODB_URI`  
**Value:**
```
mongodb://alwaysaryan49:RAASTechMates@ac-ijtrk2i-shard-00-00.gn0r4ti.mongodb.net:27017,ac-ijtrk2i-shard-00-01.gn0r4ti.mongodb.net:27017,ac-ijtrk2i-shard-00-02.gn0r4ti.mongodb.net:27017/?ssl=true&replicaSet=atlas-5w07vj-shard-0&authSource=admin&appName=Cluster0
```

**Environment:** Production, Preview, Development (select all)

---

## 📝 **Database Collections in RAAS**

Your application uses these collections:

1. **users** - User accounts and profiles
2. **farms** - Farm information
3. **crops** - Crop data
4. **diseasedetections** - Disease detection history
5. **chatmessages** - Chat history
6. **notifications** - User notifications
7. **analytics** - Analytics data

These will be created automatically when the app runs.

---

## 🔧 **Troubleshooting**

### **"Authentication Failed"**
- Check username and password
- Verify user has database permissions
- Check authSource parameter

### **"Connection Timeout"**
- Verify IP whitelist (add 0.0.0.0/0)
- Check firewall settings
- Verify cluster is running

### **"Too Many Connections"**
- Free tier limit: 500 connections
- Upgrade to M10+ for more connections
- Optimize connection pooling in code

---

## 🎉 **You're All Set!**

Your MongoDB Atlas database is ready for production deployment!

**Next Steps:**
1. ✅ Verify network access allows 0.0.0.0/0
2. ✅ Keep your connection string secure
3. ✅ Add it to Vercel environment variables
4. ✅ Test connection before deploying

---

**MongoDB Atlas Dashboard:** https://cloud.mongodb.com  
**Documentation:** https://docs.atlas.mongodb.com
