const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI with proper configuration and error handling
let genAI;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
  } else if (!apiKey.startsWith('AIzaSy')) {
    console.warn('⚠️  WARNING: Gemini API key format may be incorrect. Keys should start with "AIzaSy"');
    console.warn('⚠️  Current key starts with:', apiKey.substring(0, 5));
    console.warn('⚠️  Get a valid key from: https://makersuite.google.com/app/apikey');
  }
  
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('✅ Gemini AI initialized');
} catch (error) {
  console.error('❌ Error initializing Gemini AI:', error.message);
}

// Get Gemini model for text generation with error handling
const getGeminiProModel = () => {
  try {
    if (!genAI) {
      throw new Error('Gemini AI not initialized. Check API key configuration.');
    }
    
    return genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    });
  } catch (error) {
    console.error('❌ Error initializing Gemini model:', error.message);
    throw new Error('Gemini API not available. Please check your API key and quota.');
  }
};

// Get Gemini Pro Vision model for image analysis
const getGeminiProVisionModel = () => {
  try {
    if (!genAI) {
      throw new Error('Gemini AI not initialized. Check API key configuration.');
    }
    
    return genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash'  // Flash supports vision
    });
  } catch (error) {
    console.error('❌ Error initializing Gemini vision model:', error.message);
    throw new Error('Gemini Vision API not available. Please check your API key and quota.');
  }
};

module.exports = {
  genAI,
  getGeminiProModel,
  getGeminiProVisionModel
};
