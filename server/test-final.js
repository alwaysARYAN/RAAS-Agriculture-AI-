// Final test of working Gemini API
require('dotenv').config();
const { generateContent, testConnection, DEFAULT_MODEL } = require('./config/gemini-direct');

async function runFinalTest() {
  console.log('🚀 Final Gemini API Test\n');
  console.log(`Using model: ${DEFAULT_MODEL}\n`);
  
  try {
    // Test 1: Connection test
    console.log('1️⃣  Testing connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Connection test failed');
    }
    console.log('✅ Connection successful!\n');
    
    // Test 2: Farming tip
    console.log('2️⃣  Generating daily farming tip...');
    const tip = await generateContent('Provide a practical farming tip for Indian farmers in 2-3 sentences.');
    console.log(`✅ Daily Tip:\n${tip}\n`);
    
    // Test 3: Crop recommendation
    console.log('3️⃣  Getting crop recommendation...');
    const cropAdvice = await generateContent('What crops are best to plant in North India during monsoon season? Give 3 recommendations.');
    console.log(`✅ Crop Recommendations:\n${cropAdvice}\n`);
    
    // Test 4: Pest management
    console.log('4️⃣  Testing pest management advice...');
    const pestAdvice = await generateContent('How can I prevent aphids in my tomato crop? Give organic solutions.');
    console.log(`✅ Pest Management:\n${pestAdvice}\n`);
    
    console.log('🎉 ALL TESTS PASSED! Gemini AI is fully functional!\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runFinalTest();
