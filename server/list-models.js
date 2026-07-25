// List available Gemini models
require('dotenv').config();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  console.log('\n🔍 Fetching available Gemini models...\n');
  console.log('API Key:', GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 15) + '...' : 'NOT SET');
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    const response = await axios.get(url);
    
    if (response.data && response.data.models) {
      console.log(`\n✅ Found ${response.data.models.length} available models:\n`);
      
      response.data.models.forEach(model => {
        console.log(`📦 ${model.name}`);
        console.log(`   Display Name: ${model.displayName}`);
        console.log(`   Description: ${model.description}`);
        console.log(`   Supported: ${model.supportedGenerationMethods?.join(', ')}`);
        console.log('');
      });
    } else {
      console.log('❌ No models found in response');
    }
  } catch (error) {
    console.error('\n❌ Error fetching models:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.error?.message || error.message}`);
    } else {
      console.error(`   ${error.message}`);
    }
  }
}

listModels();
