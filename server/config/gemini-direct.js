// Direct HTTP implementation for Gemini API
// Works with both AIzaSy and AQ format API keys

const axios = require('axios');
const https = require('https');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Always use v1beta endpoint (works for both key formats)
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

// Available models for v1beta endpoint (using correct stable versions)
const MODELS = {
  FLASH: 'gemini-2.0-flash',           // Gemini 2.0 Flash (Works with Auth Keys)
  FLASH_LATEST: 'gemini-flash-latest', // Auto-updates to latest
  PRO: 'gemini-2.5-pro',               // Pro model
  FLASH_LITE: 'gemini-2.0-flash-lite', // Lighter version
};

// Use Gemini 2.0 Flash (compatible with Auth Keys)
const DEFAULT_MODEL = MODELS.FLASH;

// Configuration check
if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
  console.error('⚠️  WARNING: GEMINI_API_KEY not configured!');
  console.error('   AI features will be disabled until API key is set.');
} else {
  console.log('✅ Gemini API key found:', GEMINI_API_KEY.substring(0, 10) + '...');
}

// Rate limiting tracker with longer intervals
const rateLimiter = {
  requestCount: 0,
  lastReset: Date.now(),
  maxRequestsPerMinute: 10, // Conservative limit (Gemini allows 15)
  requestQueue: [],
  
  async canMakeRequest() {
    const now = Date.now();
    const minuteElapsed = now - this.lastReset;
    
    // Reset counter every minute
    if (minuteElapsed > 60000) {
      this.requestCount = 0;
      this.lastReset = now;
      console.log('🔄 Rate limiter reset - new minute started');
      return true;
    }
    
    // Check if under limit
    if (this.requestCount < this.maxRequestsPerMinute) {
      this.requestCount++;
      const remaining = this.maxRequestsPerMinute - this.requestCount;
      console.log(`📊 API Request ${this.requestCount}/${this.maxRequestsPerMinute} (${remaining} remaining this minute)`);
      return true;
    }
    
    // Rate limit exceeded - wait
    const waitMs = 60000 - minuteElapsed;
    console.log(`⏳ Rate limit reached (${this.requestCount}/${this.maxRequestsPerMinute}). Waiting ${Math.ceil(waitMs/1000)}s...`);
    await new Promise(resolve => setTimeout(resolve, waitMs + 1000));
    
    // Reset and allow request
    this.requestCount = 1;
    this.lastReset = Date.now();
    return true;
  }
};

// Create axios instance with better defaults
const axiosInstance = axios.create({
  timeout: 60000, // Increased timeout
  httpsAgent: new https.Agent({
    keepAlive: true,
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  })
});

/**
 * Detect if API key is Auth Key (OAuth) or Standard Key
 * Auth keys start with: AQ., SQ., while Standard keys start with: AIzaSy
 */
function isAuthKey(apiKey) {
  return apiKey && (apiKey.startsWith('AQ.') || apiKey.startsWith('SQ.'));
}

/**
 * Generate content using Gemini API
 * Supports both Auth Keys (OAuth) and Standard API Keys
 * @param {string} prompt - The text prompt
 * @param {string} modelName - Model name to use
 * @returns {Promise<string>} Generated text
 */
async function generateContent(prompt, modelName = DEFAULT_MODEL) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  // Wait if rate limit reached
  await rateLimiter.canMakeRequest();

  // Check key type and build URL accordingly
  const useAuthKey = isAuthKey(GEMINI_API_KEY);
  
  // Auth keys (AQ., SQ.) use X-Goog-Api-Key header, Standard keys use query param
  const url = useAuthKey 
    ? `${API_BASE_URL}/models/${modelName}:generateContent`
    : `${API_BASE_URL}/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      topP: 0.95,
      topK: 40
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_NONE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_NONE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_NONE"
      }
    ]
  };

  // Build headers - Auth keys use X-Goog-Api-Key header (case-sensitive!)
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (useAuthKey) {
    headers['X-Goog-Api-Key'] = GEMINI_API_KEY;
    console.log('🔐 Using NEW Auth Key with X-Goog-Api-Key header');
  } else {
    console.log('🔑 Using Standard API Key (query parameter)');
  }

  try {
    console.log(`🤖 Calling Gemini ${modelName}...`);
    
    const response = await axiosInstance.post(url, requestBody, { headers });

    if (response.data && response.data.candidates && response.data.candidates[0]) {
      const candidate = response.data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
        console.log('✅ Gemini response received successfully');
        return candidate.content.parts[0].text;
      }
    }

    throw new Error('Unexpected response format from Gemini API');

  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      const message = errorData?.error?.message || error.message;
      
      console.error(`❌ Gemini API Error (${status}):`, message);
      
      // Handle different error codes
      if (status === 429) {
        console.error('💡 QUOTA EXCEEDED - Solutions:');
        console.error('   1. Wait a few minutes');
        console.error('   2. Using fallback responses for now');
        console.error('   3. Get new API key: https://aistudio.google.com/app/apikey');
        throw new Error('QUOTA_EXCEEDED');
      } else if (status === 400) {
        console.error('💡 INVALID REQUEST - Check:');
        console.error('   1. API key format:', GEMINI_API_KEY.substring(0, 10) + '...');
        console.error('   2. Model name:', modelName);
        console.error('   3. Request format');
        throw new Error('INVALID_REQUEST');
      } else if (status === 403) {
        console.error('💡 ACCESS DENIED - Check:');
        console.error('   1. API key is valid');
        console.error('   2. API is enabled in Google Cloud');
        console.error('   3. Billing is set up (for higher quota)');
        throw new Error('ACCESS_DENIED');
      } else if (status === 401) {
        console.error('💡 AUTHENTICATION FAILED - Solutions:');
        console.error('   1. Check API key is correct');
        console.error('   2. Auth keys need Bearer token authorization');
        console.error('   3. Standard keys need ?key= parameter');
        throw new Error('AUTHENTICATION_FAILED');
      } else if (status === 404) {
        console.error('💡 MODEL NOT FOUND - Trying alternative model...');
        // Try flash model as fallback
        if (modelName !== MODELS.FLASH) {
          return generateContent(prompt, MODELS.FLASH);
        }
        throw new Error('MODEL_NOT_FOUND');
      }
      
      throw new Error(`API_ERROR_${status}`);
    } else if (error.request) {
      console.error('❌ Network error:', error.message);
      throw new Error('NETWORK_ERROR');
    } else {
      console.error('❌ Unexpected error:', error.message);
      throw error;
    }
  }
}

/**
 * Generate content with vision (image + text)
 * Supports both Auth Keys (OAuth) and Standard API Keys
 */
async function generateContentWithImage(prompt, imageBase64, mimeType = 'image/jpeg') {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  await rateLimiter.canMakeRequest();

  // Check key type and build URL accordingly
  const useAuthKey = isAuthKey(GEMINI_API_KEY);
  const url = useAuthKey 
    ? `${API_BASE_URL}/models/${DEFAULT_MODEL}:generateContent`
    : `${API_BASE_URL}/models/${DEFAULT_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const requestBody = {
    contents: [{
      parts: [
        { text: prompt },
        {
          inline_data: {
            mime_type: mimeType,
            data: imageBase64
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2048,
      topP: 0.95,
      topK: 40
    }
  };

  try {
    console.log(`🖼️ Calling Gemini Vision...`);
    
    // Build headers - Auth keys use X-Goog-Api-Key header
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (useAuthKey) {
      headers['X-Goog-Api-Key'] = GEMINI_API_KEY;
      console.log('🔐 Using Auth Key for vision API');
    }
    
    const response = await axiosInstance.post(url, requestBody, { headers });

    if (response.data && response.data.candidates && response.data.candidates[0]) {
      const candidate = response.data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
        console.log('✅ Gemini vision response received');
        return candidate.content.parts[0].text;
      }
    }

    throw new Error('Unexpected response format');

  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      console.error(`❌ Gemini Vision Error (${status}):`, error.response.data?.error?.message || 'Unknown error');
      if (status === 429) throw new Error('QUOTA_EXCEEDED');
      if (status === 400) throw new Error('INVALID_REQUEST');
      if (status === 401) throw new Error('AUTHENTICATION_FAILED');
      if (status === 403) throw new Error('ACCESS_DENIED');
      throw new Error(`API_ERROR_${status}`);
    }
    throw error;
  }
}

/**
 * Test if Gemini API is working
 */
async function testConnection() {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
      console.log('⚠️  Gemini API key not configured - skipping test');
      return false;
    }
    
    console.log(`🧪 Testing Gemini API connection...`);
    console.log('📋 API Key format:', GEMINI_API_KEY.substring(0, 10) + '...');
    console.log('📋 API Endpoint:', API_BASE_URL);
    console.log('📋 Model:', DEFAULT_MODEL);
    
    const result = await generateContent('Say "Hello! Gemini AI is working!" in one sentence.');
    console.log('✅ Gemini API test PASSED');
    console.log('📨 Response:', result.substring(0, 100));
    return true;
  } catch (error) {
    console.error('❌ Gemini API test FAILED:', error.message);
    console.error('   AI features will work but may have reduced functionality');
    return false;
  }
}

module.exports = {
  generateContent,
  generateContentWithImage,
  testConnection,
  MODELS,
  DEFAULT_MODEL
};
