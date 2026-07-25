// List available Gemini models for the current API key
require('dotenv').config();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function listAvailableModels() {
  console.log('🔍 Listing Available Gemini Models\n');
  console.log('API Key:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 15)}...` : 'NOT SET');
  console.log('');

  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
    console.error('❌ GEMINI_API_KEY is not set!');
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;

  try {
    const response = await axios.get(url);
    
    if (response.data && response.data.models) {
      console.log(`✅ Found ${response.data.models.length} available models:\n`);
      
      response.data.models.forEach((model, index) => {
        console.log(`${index + 1}. ${model.name}`);
        console.log(`   Display Name: ${model.displayName || 'N/A'}`);
        console.log(`   Description: ${model.description || 'N/A'}`);
        console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        console.log('');
      });
      
      // Find models that support generateContent
      const generateContentModels = response.data.models.filter(m => 
        m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')
      );
      
      if (generateContentModels.length > 0) {
        console.log(`\n✅ Models that support generateContent (${generateContentModels.length}):`);
        generateContentModels.forEach(model => {
          console.log(`   - ${model.name}`);
        });
      } else {
        console.log('\n❌ No models support generateContent with this API key');
      }
      
    } else {
      console.log('❌ No models found or unexpected response format');
    }

  } catch (error) {
    console.error('❌ Error fetching models:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

listAvailableModels();
