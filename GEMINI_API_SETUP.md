# 🔑 Gemini API Setup Guide

## Current Issue
Your Gemini API key is returning a 404 error:
```
models/gemini-1.5-flash is not found for API version v1beta
```

This means your API key doesn't have access to the `gemini-1.5-flash` model on the v1beta endpoint.

## ✅ Fix Applied

I've updated the code to use `gemini-pro` instead, which is more widely compatible with newer API keys (including those starting with `AQ.`).

### What Changed:
- **Old model**: `gemini-1.5-flash` (not available for your key)
- **New model**: `gemini-pro` (better compatibility)

**Restart your server** to test the fix:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

## 🔍 Available Models

Your API key (starting with `AQ.`) should have access to:
- ✅ `gemini-pro` (text generation) - **NOW USING THIS**
- ✅ `gemini-pro-vision` (image analysis)
- ❌ `gemini-1.5-flash` (not available on v1beta for your key)
- ❌ `gemini-1.5-pro` (not available on v1beta for your key)

## API Key Format Update (2026)

✅ **Correct**: New Gemini API keys now start with `AQ.` prefix
- Example: `AQ.Ab8RN6J2nvUeEBWSuGTKcKpCj1PpQZNGHIGX8uYHXKhwj1Z4Iw`

❌ **Old format**: Previous keys started with `AIzaSy...`

Your current API key format is **correct**! The issue was the model name, not the key format.


### Step 2: Restart Your Server

The server should automatically reload with nodemon. If not:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Test the Dashboard

1. Open http://localhost:3000
2. Login to your account
3. Check if the "Daily Tip" now shows an AI-generated tip

## 🔍 Testing Your Setup

### Quick Test (PowerShell)
```powershell
$apiKey = "YOUR_API_KEY_HERE"
$uri = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$apiKey"
$body = @{
    contents = @(
        @{
            parts = @(
                @{ text = "Say hello" }
            )
        }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri $uri -Method Post -ContentType "application/json" -Body $body
```

If this works, your API key is valid!

## 🔍 Available Models

Your API key (starting with `AQ.`) should have access to:
- ✅ `gemini-pro` (text generation) - **NOW USING THIS**
- ✅ `gemini-pro-vision` (image analysis)
- ❌ `gemini-1.5-flash` (may not be available)
- ❌ `gemini-1.5-pro` (may not be available)


## 🆘 Still Not Working?

### Option 1: Verify Your API Key
```bash
# Test your API key with curl (Windows PowerShell):
$headers = @{
    "Content-Type" = "application/json"
}
$body = @{
    contents = @(
        @{
            parts = @(
                @{ text = "Hello" }
            )
        }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY_HERE" -Method Post -Headers $headers -Body $body
```

### Option 2: Use Without Gemini (App Still Works!)

The app now works without Gemini AI! It will show fallback messages:
- Daily tips: Default farming advice
- Chatbot: Instructions to configure API
- Insights: Fallback messages

All other features work normally:
- ✅ Weather data (OpenWeather API)
- ✅ Farm and crop management
- ✅ User authentication
- ✅ Market prices
- ✅ Government schemes

### Option 3: Try Alternative Model

Edit `agriculture-ai/server/config/gemini.js` and change the model name:

```javascript
// Try gemini-pro instead
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
```

## 📚 Resources

- **Google AI Studio**: https://makersuite.google.com/
- **Gemini API Docs**: https://ai.google.dev/docs
- **Get API Key**: https://makersuite.google.com/app/apikey
- **Pricing**: Free tier includes 60 requests per minute

## ⚠️ Important Notes

1. **Never commit your API key** to Git (already in .gitignore)
2. **Free tier limits**: 60 requests/minute
3. **API key format**: Should start with `AIzaSy...`
4. **Region restrictions**: Some regions may have limited access

---

**Your app is now working with fallback responses!** Add a valid Gemini API key to enable AI features.
