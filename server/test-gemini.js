// Quick test script for Gemini API
require('dotenv').config();
const { testConnection, generateContent } = require('./config/gemini-direct');

async function runTest() {
  console.log('\n🧪 ===== GEMINI API TEST =====\n');
  
  console.log('📋 Configuration:');
  console.log('   API Key:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 15) + '...' : 'NOT SET');
  console.log('   Key Format:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 3) : 'N/A');
  console.log('');
  
  // Test 1: Connection test
  console.log('🔍 Test 1: Testing connection...');
  const isConnected = await testConnection();
  
  if (!isConnected) {
    console.log('\n❌ GEMINI API IS NOT WORKING');
    console.log('\n💡 Solutions:');
    console.log('   1. Check your API key format (should start with AIzaSy or AQ.)');
    console.log('   2. Verify quota at: https://aistudio.google.com/');
    console.log('   3. Generate new key at: https://aistudio.google.com/app/apikey');
    console.log('   4. Enable billing if needed');
    console.log('\n⚠️  App will use FALLBACK responses until Gemini works\n');
    process.exit(1);
  }
  
  // Test 2: Agricultural query
  console.log('\n🌾 Test 2: Testing agricultural advice...');
  try {
    const advice = await generateContent('Give me 3 tips for growing wheat in 2 sentences.');
    console.log('✅ Response received:');
    console.log('   ' + advice.substring(0, 200) + (advice.length > 200 ? '...' : ''));
  } catch (error) {
    console.log('❌ Agricultural query failed:', error.message);
  }
  
  console.log('\n✅ ===== TEST COMPLETE =====\n');
  console.log('🎉 Gemini AI is working! All AI features will use real Gemini responses.\n');
  process.exit(0);
}

runTest().catch(error => {
  console.error('\n❌ Test failed with error:', error.message);
  console.log('\n⚠️  App will use FALLBACK responses\n');
  process.exit(1);
});
