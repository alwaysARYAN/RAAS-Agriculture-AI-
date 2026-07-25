// Quick test script for Gemini API
require('dotenv').config({ path: './.env' });
const { generateContent } = require('./config/gemini-direct');

async function testGemini() {
  console.log('🧪 Testing Gemini API...');
  console.log('API Key:', process.env.GEMINI_API_KEY ? 'Found' : 'Missing');
  
  try {
    const response = await generateContent('Say "Hello from Agriculture AI" in one sentence.');
    console.log('✅ SUCCESS!');
    console.log('Response:', response);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

testGemini();
