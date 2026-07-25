# 🔧 Authentication Debug Guide

## Current Status

✅ **Backend Auth Endpoints:** WORKING  
✅ **Backend Port 5001:** RUNNING  
❓ **Frontend Connection:** NEEDS TESTING

## Test Results

### Backend Direct Test (PowerShell):
```
Registration: ✅ SUCCESS
Login: ✅ SUCCESS
Token Generation: ✅ WORKING
```

Test user created:
- Phone: 9876543210
- Password: test123
- Name: Test User

## How to Debug Your Issue

### Step 1: Test Backend Directly

Open the test page I created:
```
File: d:\agriculture-ai\test-auth-frontend.html
```

1. Open this file in your browser (double-click it)
2. Click "Test Connection" - should show backend is running
3. Click "Test Registration" - should create a new user
4. Click "Test Login" - should login successfully

If these work, backend is fine. Issue is in React app.

### Step 2: Check Browser Console

1. Open http://localhost:3002
2. Open Browser DevTools (F12)
3. Go to Console tab
4. Try to login
5. Look for:
   - Network errors (ERR_CONNECTION_REFUSED)
   - API URL being called
   - Response status codes

### Step 3: Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for POST request to `/auth/login`
5. Check:
   - Request URL (should be http://192.168.0.119:5001/api/auth/login)
   - Request payload
   - Response status
   - Response body

## Common Issues & Solutions

### Issue 1: "Network Error" or "Failed to Fetch"

**Symptom:** Error message shows network/connection error

**Causes:**
1. Frontend can't reach backend
2. Wrong API URL
3. CORS issues
4. Backend not running

**Solution:**
```bash
# 1. Check backend is running
curl http://localhost:5001/api/auth/me

# 2. Check frontend .env
# Should have: REACT_APP_API_URL=http://192.168.0.119:5001/api

# 3. Restart frontend after .env changes
```

### Issue 2: "Invalid Credentials"

**Symptom:** Error message shows "Invalid credentials"

**Cause:** User doesn't exist in database

**Solution:**
1. Use the test page to register first
2. Or use these test credentials:
   - Phone: 9876543210
   - Password: test123

### Issue 3: 404 Not Found

**Symptom:** 404 error on auth endpoints

**Cause:** Wrong API base URL

**Solution:**
Check API URL in browser console. Should be:
```
http://192.168.0.119:5001/api/auth/login
NOT http://192.168.0.119:5001/auth/login (missing /api)
NOT http://localhost:5000/api/auth/login (wrong port)
```

### Issue 4: CORS Error

**Symptom:** "CORS policy" error in console

**Cause:** Backend CORS not configured for frontend origin

**Solution:**
Backend should allow origin: http://localhost:3002
Check server/server.js CORS configuration.

## Quick Fix Commands

### Restart Everything:
```powershell
# Stop all processes
# Then restart:

# Backend
cd d:\agriculture-ai\server
npm run dev

# Frontend (in new terminal)
cd d:\agriculture-ai\client
$env:PORT=3002; npm start
```

### Clear Browser Data:
```
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Clear storage"
4. Click "Clear site data"
5. Refresh page
```

### Test User for Login:
```
Phone: 9876543210
Password: test123
```

This user was just created and should work.

## Expected Behavior

### Successful Registration:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJ..."
  }
}
```

### Successful Login:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJ..."
  }
}
```

## What to Check in Your Browser

1. **Console Tab:**
   - Look for red errors
   - Check API URL being called
   - Look for "Network Error" or "Failed to fetch"

2. **Network Tab:**
   - Find POST request to /auth/login or /auth/register
   - Check Request URL (should include :5001)
   - Check Response (status code, body)
   - Check Headers (Content-Type should be application/json)

3. **Application Tab:**
   - Check localStorage for any old tokens
   - Clear if needed

## Debug Steps

1. ✅ Open test page (test-auth-frontend.html)
2. ✅ Test connection - should work
3. ✅ Test registration - should work
4. ✅ Test login - should work
5. ❓ If test page works, issue is in React app
6. ❓ Check browser console in React app
7. ❓ Check Network tab in React app
8. ❓ Compare API URLs between test page and React app

## Next Steps

### If Test Page Works:
Problem is in React app configuration. Check:
- src/services/api.js (API URL)
- src/context/AuthContext.js (using api service)
- .env file (REACT_APP_API_URL)
- Frontend needs restart after .env changes

### If Test Page Doesn't Work:
Problem is backend connection. Check:
- Backend running on port 5001
- Firewall not blocking port
- Correct IP address in URL
- CORS configuration

## Contact Points

When asking for help, provide:
1. Screenshot of browser console errors
2. Screenshot of Network tab showing failed request
3. API URL being called (from Network tab)
4. Response body (from Network tab)

This will help identify the exact issue quickly.

---

**Quick Test:** Open test-auth-frontend.html and click all three buttons. If all pass, backend is perfect and issue is only in React app configuration.
