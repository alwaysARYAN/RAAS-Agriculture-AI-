# 🌐 Network Access Guide - Agriculture AI

## 📱 Access URLs

### For Other Devices (Phone, Tablet, Other Computers)
```
http://192.168.0.144:3002
```

### For This Computer
```
http://localhost:3002
```

## 🔧 Backend API URLs

### Network Access
```
http://192.168.0.119:5001/api
```

### Local Access
```
http://localhost:5001/api
```

## ✅ What's Already Configured

1. ✅ **Backend Server**: Running on port 5001, listening on all network interfaces (0.0.0.0)
2. ✅ **Frontend Server**: Running on port 3002, accessible via network IP
3. ✅ **CORS Configuration**: Allows requests from any origin
4. ✅ **Windows Firewall**: Rules added for ports 3002 and 5001
5. ✅ **API Configuration**: Frontend configured to use network IP for backend

## 📋 Requirements

### For Other Devices to Access:
- ✅ All devices must be on the **SAME Wi-Fi network**
- ✅ Your computer (server) must stay on and connected
- ✅ Windows Firewall configured (already done)
- ✅ Both servers running (already done)

## 🎯 How to Access from Phone/Tablet

1. **Connect your phone/tablet to the SAME Wi-Fi network** as this computer
2. **Open any browser** (Chrome, Safari, Firefox, etc.)
3. **Type in the address bar**: `192.168.0.144:3002`
4. **Press Enter/Go**
5. You should see the Agriculture AI login page!

## 🧪 Testing Steps

1. **Register a new account**
   - Click "Sign up"
   - Fill in name, phone (10 digits), password
   - Submit

2. **Login**
   - Use your registered phone number and password
   - You should be taken to the dashboard

3. **Test Language Switching**
   - Look for the language selector (🌐 icon)
   - Switch between English, Hindi (हिंदी), Gujarati (ગુજરાતી)
   - Go to Market and Schemes pages
   - Verify ALL text translates

4. **Test Features**
   - Dashboard
   - My Farms
   - My Crops
   - Market Prices (with filters and search)
   - Government Schemes (with filters)
   - Weather
   - AI Chatbot

## 🔍 Troubleshooting

### Cannot Access from Phone
1. **Check Wi-Fi**: Ensure phone and computer are on same network
2. **Check Firewall**: Try temporarily disabling Windows Firewall
3. **Check IP**: Your computer's IP might have changed. Run this command:
   ```powershell
   (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" | Select-Object -First 1).IPAddress
   ```
4. **Restart Servers**: Stop and restart both backend and frontend

### Cannot Login
1. **Check Backend**: Visit `http://192.168.0.144:5001/health` to verify backend is running
2. **Register First**: You need to create an account before logging in
3. **Check Browser Console**: Open browser dev tools (F12) and check for errors

### Language Not Switching
1. **Clear Browser Cache**: Clear cache and reload
2. **Check Translation Files**: Ensure all 3 translation files exist (en.json, hi.json, gu.json)

## 📊 Server Status

### Backend Server
- **Port**: 5001
- **Status**: ✅ Running
- **Network URL**: http://192.168.0.119:5001
- **Local URL**: http://localhost:5001

### Frontend Server
- **Port**: 3002
- **Status**: ✅ Running
- **Network URL**: http://192.168.0.144:3002
- **Local URL**: http://localhost:3002

## 🎨 QR Code for Easy Sharing

You can create a QR code for this URL to easily share with others:
```
http://192.168.0.144:3002
```

Use any QR code generator website like:
- https://qr-code-generator.com
- https://www.qr-code-generator.org

## 📝 Notes

- The network IP (192.168.0.144) may change if you restart your computer or router
- Both servers must remain running for the app to work
- This setup is for **local network only** - not accessible from the internet
- For production deployment, you would need proper hosting (AWS, Azure, Heroku, etc.)

## 🚀 Quick Start Commands

### Start Backend Server
```bash
cd d:\agriculture-ai\server
npm run dev
```

### Start Frontend Server
```bash
cd d:\agriculture-ai\client
$env:PORT=3002; npm start
```

### Check Your Network IP
```powershell
(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" | Select-Object -First 1).IPAddress
```

---

**Last Updated**: January 2025
**Agriculture AI © 2026**
