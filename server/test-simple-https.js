// Simple HTTPS test without axios to diagnose network issues
require('dotenv').config();
const https = require('https');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'models/gemini-2.5-flash';

console.log('🔍 Testing Gemini API with native HTTPS...\n');
console.log(`API Key: ${GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 15) + '...' : 'NOT SET'}\n`);

const requestData = JSON.stringify({
  contents: [{
    parts: [{ text: 'Say hello' }]
  }]
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  port: 443,
  path: `/v1beta/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': requestData.length
  }
};

console.log('📡 Making request to:', `https://${options.hostname}${options.path.substring(0, 100)}...`);
console.log('');

const req = https.request(options, (res) => {
  console.log(`✅ Response Status: ${res.statusCode}`);
  console.log(`✅ Response Headers:`, res.headers);
  console.log('');

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📥 Response received!\n');
    
    try {
      const jsonData = JSON.parse(data);
      
      if (jsonData.candidates && jsonData.candidates[0]) {
        const text = jsonData.candidates[0].content.parts[0].text;
        console.log('✅ SUCCESS! Gemini API Response:');
        console.log(`   "${text}"\n`);
        console.log('🎉 Your Gemini API is working perfectly!\n');
      } else {
        console.log('⚠️  Unexpected response format:');
        console.log(JSON.stringify(jsonData, null, 2));
      }
    } catch (error) {
      console.log('⚠️  Response (not JSON):');
      console.log(data.substring(0, 500));
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  console.error('');
  
  if (error.code === 'ECONNREFUSED') {
    console.error('🔴 Connection refused. Check:');
    console.error('   1. Firewall settings');
    console.error('   2. Antivirus blocking Node.js');
    console.error('   3. Corporate proxy settings');
  } else if (error.code === 'ENOTFOUND') {
    console.error('🔴 DNS resolution failed. Check internet connection.');
  } else if (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
    console.error('🔴 SSL certificate error. Try:');
    console.error('   set NODE_TLS_REJECT_UNAUTHORIZED=0');
    console.error('   (Only for testing!)');
  } else {
    console.error('🔴 Error code:', error.code);
    console.error('🔴 Full error:', error);
  }
});

req.on('timeout', () => {
  console.error('❌ Request timed out');
  req.destroy();
});

req.setTimeout(30000);

req.write(requestData);
req.end();

console.log('⏳ Waiting for response...\n');
