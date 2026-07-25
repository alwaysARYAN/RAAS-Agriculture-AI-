// Test direct Gemini API implementation
require('dotenv').config();
const { generateContent, findWorkingModel, MODELS } = require('./config/gemini-direct');

async function testDirect() {
  console.log('🔍 Testing Direct Gemini API Implementation\n');
  console.log('API Key:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 15)}...` : 'NOT SET');
  console.log('');

  try {
    // Find which model works
    console.log('📋 Finding working model...\n');
    const workingModel = await findWorkingModel();
    
    console.log(`\n✅ Success! Using model: ${workingModel}\n`);
    
    // Test with a real farming question
    console.log('📝 Testing with farming question...');
    const response = await generateContent('What is the best time to plant wheat in India?', workingModel);
    console.log(`\n✅ Response:\n${response}\n`);
    
    console.log('🎉 Direct Gemini API is working perfectly!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  The API key may not have access to any Gemini models.');
    console.log('Please check your API key at: https://makersuite.google.com/app/apikey');
  }
}

testDirect();
