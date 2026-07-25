/**
 * Fallback AI Responses
 * Provides static responses when Gemini API quota is exceeded
 * This ensures the application continues to work even without AI
 */

const fallbackResponses = {
  // Crop Recommendations
  cropRecommendations: (soilType, state, season) => ({
    recommendations: [
      {
        crop_name: "Wheat",
        rank: 1,
        suitability_score: 92,
        expected_yield: "25-30 quintals/acre",
        market_price_range: "₹2000-2500 per quintal",
        profit_potential: "High",
        estimated_profit: "₹45,000-55,000 per acre",
        water_requirement: "Medium",
        growing_duration: "120-150 days",
        best_season: "Rabi (Winter)",
        cultivation_tips: [
          "Prepare field with proper ploughing",
          "Use certified seeds for better yield",
          "Apply fertilizers in 3 splits",
          "Ensure proper irrigation at critical stages"
        ],
        advantages: [
          "High demand in market",
          "Well-established cultivation practices",
          "Government MSP support"
        ],
        challenges: [
          "Requires timely irrigation",
          "Vulnerable to rust diseases"
        ]
      },
      {
        crop_name: "Potato",
        rank: 2,
        suitability_score: 88,
        expected_yield: "150-200 quintals/acre",
        market_price_range: "₹800-1200 per quintal",
        profit_potential: "Very High",
        estimated_profit: "₹80,000-1,20,000 per acre",
        water_requirement: "Medium to High",
        growing_duration: "90-120 days",
        best_season: "Rabi (Winter)",
        cultivation_tips: [
          "Select disease-free seed potatoes",
          "Earthing up is crucial for tuber development",
          "Monitor for late blight disease",
          "Harvest when leaves turn yellow"
        ],
        advantages: [
          "High returns per acre",
          "Fast growing crop",
          "Multiple market opportunities"
        ],
        challenges: [
          "Requires cold storage",
          "Disease management needed",
          "Price fluctuations"
        ]
      },
      {
        crop_name: "Mustard",
        rank: 3,
        suitability_score: 85,
        expected_yield: "8-12 quintals/acre",
        market_price_range: "₹5000-6000 per quintal",
        profit_potential: "Medium to High",
        estimated_profit: "₹35,000-50,000 per acre",
        water_requirement: "Low to Medium",
        growing_duration: "90-120 days",
        best_season: "Rabi (Winter)",
        cultivation_tips: [
          "Sow at right time for best yield",
          "Control aphids and caterpillars",
          "Light irrigation is sufficient",
          "Harvest when 75% pods turn brown"
        ],
        advantages: [
          "Low water requirement",
          "Good oil content",
          "Suitable for rainfed areas"
        ],
        challenges: [
          "Aphid attack common",
          "Requires timely sowing"
        ]
      }
    ],
    general_advice: `Based on your ${soilType} soil in ${state}, these crops are well-suited for the ${season || 'current'} season. Focus on proper soil preparation, timely sowing, and regular monitoring for best results. Consider crop rotation to maintain soil health. Always check local market demand before finalizing your crop choice.`
  }),

  // Farming Tips
  farmingTips: (cropName, growthStage) => `
**General Farming Tips for ${cropName}:**

1. **${growthStage || 'Current Stage'} Management:**
   - Monitor crop health daily
   - Check for pest and disease symptoms
   - Maintain optimal soil moisture
   - Remove weeds regularly

2. **Nutrient Management:**
   - Apply balanced NPK fertilizers
   - Use organic manure for soil health
   - Monitor for nutrient deficiency symptoms
   - Ensure proper drainage

3. **Pest & Disease Prevention:**
   - Scout fields regularly
   - Use pheromone traps for monitoring
   - Apply neem-based organic pesticides
   - Practice crop rotation

4. **Irrigation Management:**
   - Water at right time (morning/evening)
   - Avoid water logging
   - Use drip irrigation if possible
   - Monitor soil moisture

5. **Best Practices:**
   - Keep farm records
   - Use certified seeds
   - Follow recommended spacing
   - Harvest at right maturity stage

💡 **Tip:** Always follow Integrated Pest Management (IPM) practices for sustainable farming.
`,

  // Pest Prevention
  pestPrevention: (cropName) => `
**Pest & Disease Management for ${cropName}:**

**Common Pests:**
1. Aphids - Suck plant sap, spread viral diseases
2. Whiteflies - Damage leaves, transmit viruses
3. Caterpillars - Eat leaves and fruits
4. Thrips - Cause leaf curling and stunting

**Prevention Strategies:**
1. **Cultural Methods:**
   - Crop rotation
   - Timely sowing
   - Proper field sanitation
   - Remove alternate hosts

2. **Mechanical Control:**
   - Hand picking of insects
   - Use of light traps
   - Pheromone traps
   - Bird perches in field

3. **Biological Control:**
   - Release natural enemies (Trichogramma)
   - Encourage predators (ladybird beetles)
   - Use Bacillus thuringiensis (Bt)
   - Plant trap crops

4. **Chemical Control (Last Resort):**
   - Use recommended pesticides only
   - Follow safety precautions
   - Rotate chemicals to avoid resistance
   - Respect pre-harvest intervals

**Early Warning Signs:**
- Unusual leaf yellowing
- Holes in leaves
- Sticky honeydew on plants
- Wilting without water stress
- White powder on leaves

**Monitoring Schedule:**
- Check plants 2-3 times per week
- Focus on undersides of leaves
- Monitor during early morning
- Keep records of pest presence

⚠️ **Safety:** Always wear protective equipment when applying any chemicals.
`,

  // Soil Analysis
  soilAnalysis: (soilType) => `
**Soil Health Analysis for ${soilType} Soil:**

**Soil Characteristics:**
- pH Range: Varies by type
- Drainage: Check local conditions
- Organic Matter: Needs regular addition
- Nutrient Status: Test periodically

**Improvement Strategies:**
1. **Organic Matter Addition:**
   - Apply farmyard manure (10-15 tons/acre)
   - Use green manure crops
   - Add compost regularly
   - Incorporate crop residues

2. **Nutrient Management:**
   - Soil test every 2-3 years
   - Apply lime if soil is acidic
   - Use gypsum for sodic soils
   - Balance NPK based on crop needs

3. **Suitable Crops:**
   - Wheat, Rice, Cotton (many soil types)
   - Mustard, Chickpea (lighter soils)
   - Sugarcane (heavy soils)
   - Vegetables (well-drained soils)

4. **Fertilizer Recommendations:**
   - Base application: FYM + fertilizers
   - Split nitrogen applications
   - Apply phosphorus at sowing
   - Potassium for sandy soils

5. **Soil Conservation:**
   - Contour farming on slopes
   - Mulching to reduce erosion
   - Cover crops between seasons
   - Avoid over-tillage

6. **Water Management:**
   - Improve water holding capacity
   - Create drainage channels
   - Use drip irrigation
   - Harvest rainwater

**Soil Health Indicators:**
✅ Good earthworm population
✅ Easy to dig and work
✅ Good crop growth
✅ Proper drainage

💡 **Pro Tip:** Healthy soil is the foundation of successful farming. Invest in soil health for long-term benefits.
`,

  // Chat Responses
  chatResponses: {
    greeting: "🙏 Namaste! I'm your AI farming assistant. I can help you with crop advice, pest management, weather guidance, market information, and government schemes. How can I assist you today?",
    
    disease: "For disease identification, please describe the symptoms you're seeing (leaf color, spots, wilting, etc.) and which crop is affected. I'll provide diagnosis and treatment recommendations. Common diseases include leaf blight, powdery mildew, and root rot.",
    
    weather: "Weather planning is crucial for farming success! I can help you with: irrigation scheduling, pest risk assessment based on weather, crop selection for seasons, and harvest timing. What specific weather-related guidance do you need?",
    
    fertilizer: "Fertilizer management is key to good yields. I recommend: soil testing first, balanced NPK application, organic matter addition, split applications for nitrogen, and proper timing. What crop are you growing?",
    
    market: "For market information, I suggest: checking local mandi prices daily, using e-NAM platform, storing produce if prices are low, direct marketing to consumers, and forming farmer groups. Which crop's price are you inquiring about?",
    
    scheme: "Government schemes available for farmers include: PM-KISAN (₹6000/year), Crop Insurance (PMFBY), Kisan Credit Card, Soil Health Card, and various state schemes. What type of scheme are you interested in?",
    
    irrigation: "Efficient water use is important! Tips: irrigate early morning or evening, use drip/sprinkler for efficiency, mulch to reduce evaporation, check soil moisture before watering, and practice rainwater harvesting. What's your irrigation question?",
    
    pest: "For pest control, follow IPM: monitor regularly, use pheromone traps, release natural enemies, apply neem products, and use chemical only if necessary. Which pest are you dealing with?",
    
    general: "I'm here to help with all your farming questions! You can ask me about: crops to grow, disease management, fertilizers, irrigation, market prices, government schemes, organic farming, and much more. What would you like to know?"
  },

  // Daily Tips
  dailyTips: [
    "🌾 Check your crops every morning for pest and disease symptoms. Early detection saves crops!",
    "💧 Water your plants early morning or late evening to reduce water loss through evaporation.",
    "🌱 Add organic matter to soil regularly. It improves soil structure and nutrient availability.",
    "📊 Keep detailed farm records. Track what works and what doesn't for better decisions.",
    "🔄 Practice crop rotation. It breaks pest cycles and improves soil health naturally.",
    "🌿 Use neem-based products for pest control. They're safe and effective for organic farming.",
    "⏰ Time your fertilizer application right. Split doses work better than single heavy application.",
    "🚜 Maintain your farm equipment regularly. Prevention is cheaper than repair.",
    "📱 Use technology! Weather apps and market price apps help you make informed decisions.",
    "🤝 Join farmer groups. Collective bargaining and knowledge sharing benefit everyone.",
    "🌦️ Monitor weather forecasts daily. Plan farm activities accordingly for best results.",
    "🐛 Install pheromone traps. They help monitor and control pests naturally.",
    "📝 Soil test every 2-3 years. Know what your soil needs for optimal crop growth.",
    "🌳 Plant trees around your farm. They provide shade, windbreaks, and additional income.",
    "💰 Don't forget crop insurance. It protects you from unexpected losses."
  ],

  // Get random daily tip
  getDailyTip: () => {
    const tips = fallbackResponses.dailyTips;
    const randomIndex = Math.floor(Math.random() * tips.length);
    return {
      date: new Date().toDateString(),
      season: getCurrentSeason(),
      tip: tips[randomIndex],
      source: 'Agriculture AI - Smart Farming Tips'
    };
  }
};

// Helper function to get current season
function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 6 && month <= 9) return 'Kharif (Monsoon)';
  if (month >= 10 || month <= 2) return 'Rabi (Winter)';
  return 'Zaid (Summer)';
}

// Generate chat response based on keywords
function generateChatResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.match(/hello|hi|namaste|hey/)) {
    return fallbackResponses.chatResponses.greeting;
  }
  
  if (lowerMessage.match(/disease|pest|insect|bug|infection/)) {
    return fallbackResponses.chatResponses.pest;
  }
  
  if (lowerMessage.match(/weather|rain|temperature|climate/)) {
    return fallbackResponses.chatResponses.weather;
  }
  
  if (lowerMessage.match(/fertilizer|nutrient|npk|manure/)) {
    return fallbackResponses.chatResponses.fertilizer;
  }
  
  if (lowerMessage.match(/price|market|mandi|sell/)) {
    return fallbackResponses.chatResponses.market;
  }
  
  if (lowerMessage.match(/scheme|subsidy|government|yojana/)) {
    return fallbackResponses.chatResponses.scheme;
  }
  
  if (lowerMessage.match(/water|irrigation|drip/)) {
    return fallbackResponses.chatResponses.irrigation;
  }
  
  return fallbackResponses.chatResponses.general;
}

module.exports = {
  fallbackResponses,
  generateChatResponse
};
