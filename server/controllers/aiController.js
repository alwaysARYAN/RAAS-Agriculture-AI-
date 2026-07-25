const { generateContent } = require('../config/gemini-direct');
const { fallbackResponses } = require('../utils/fallbackAI');
const Farm = require('../models/Farm');
const axios = require('axios');
const aiCache = require('../utils/aiCache');

// @desc    Get AI crop recommendations
// @route   POST /api/ai/recommend-crops
// @access  Private
exports.recommendCrops = async (req, res, next) => {
  try {
    const { farm_id, season, budget } = req.body;

    let farmData;
    
    if (farm_id) {
      // Get specific farm data
      farmData = await Farm.findOne({
        _id: farm_id,
        farmer_id: req.user._id,
        isActive: true
      });

      if (!farmData) {
        return res.status(404).json({
          success: false,
          message: 'Farm not found'
        });
      }
    } else {
      // Use user profile data
      if (!req.user.state || !req.user.soilType) {
        return res.status(400).json({
          success: false,
          message: 'Please complete your profile with state and soil type information'
        });
      }
      
      farmData = {
        soil_type: req.user.soilType,
        location: { state: req.user.state },
        area: req.user.landSize
      };
    }

    // Check cache
    const cacheKey = aiCache.generateKey('crop-rec', {
      soil: farmData.soil_type,
      state: farmData.location.state,
      season: season || 'current'
    });
    const cachedRec = aiCache.get(cacheKey);
    if (cachedRec) {
      return res.status(200).json({
        success: true,
        message: 'Crop recommendations retrieved from cache',
        data: cachedRec
      });
    }

    // Get weather data for the location
    let weatherContext = '';
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${farmData.location.state},IN&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
      const weatherResponse = await axios.get(weatherUrl);
      const weather = weatherResponse.data;
      
      weatherContext = `Current weather: Temperature ${weather.main.temp}°C, Humidity ${weather.main.humidity}%, ${weather.weather[0].description}`;
    } catch (error) {
      console.log('Could not fetch weather data for recommendations');
      weatherContext = 'Weather data unavailable';
    }

    // Generate AI recommendations
    const prompt = `You are an expert agricultural consultant in India. Provide crop recommendations based on the following information:

Farm Details:
- Soil Type: ${farmData.soil_type}
- Location: ${farmData.location.state}, India
- Farm Area: ${farmData.area || 'Not specified'} acres
- Season: ${season || 'Current season'}
- Budget: ${budget || 'Not specified'}
- ${weatherContext}

Please recommend the TOP 3 most profitable and suitable crops for this farm. For each crop, provide:

1. Crop name
2. Expected yield per acre
3. Market price range (per quintal)
4. Expected profit margin
5. Water requirements
6. Growing duration
7. Key cultivation tips

Respond in the following JSON format:
{
  "recommendations": [
    {
      "crop_name": "Crop Name",
      "rank": 1,
      "suitability_score": 95,
      "expected_yield": "20-25 quintals/acre",
      "market_price_range": "₹2000-2500 per quintal",
      "profit_potential": "High",
      "estimated_profit": "₹30,000-40,000 per acre",
      "water_requirement": "Medium",
      "growing_duration": "90-120 days",
      "best_season": "Kharif/Rabi/Zaid",
      "cultivation_tips": ["Tip 1", "Tip 2", "Tip 3"],
      "advantages": ["Advantage 1", "Advantage 2"],
      "challenges": ["Challenge 1", "Challenge 2"]
    }
  ],
  "general_advice": "Additional farming advice based on soil and location"
}

Focus on crops that are:
1. Suitable for ${farmData.soil_type} soil
2. Profitable in current market conditions
3. Appropriate for ${farmData.location.state} climate
4. Realistic for small to medium farmers`;

    let recommendationText;
    let recommendations;
    
    try {
      recommendationText = await generateContent(prompt);
      
      // Parse AI response
      try {
        const jsonMatch = recommendationText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.log('JSON parse error, using fallback');
        recommendations = fallbackResponses.cropRecommendations(
          farmData.soil_type,
          farmData.location.state,
          season
        );
      }
    } catch (aiError) {
      console.error('AI generation failed, using fallback:', aiError.message);
      recommendations = fallbackResponses.cropRecommendations(
        farmData.soil_type,
        farmData.location.state,
        season
      );
    }

    const responseData = {
      farm_context: {
        soil_type: farmData.soil_type,
        location: farmData.location.state,
        area: farmData.area,
        season: season || 'Current'
      },
      ...recommendations,
      timestamp: new Date()
    };

    // Cache the recommendation
    aiCache.set(cacheKey, responseData);

    res.status(200).json({
      success: true,
      message: 'Crop recommendations generated successfully',
      data: responseData
    });

  } catch (error) {
    console.error('Recommend crops error:', error);
    next(error);
  }
};

// @desc    Get farming tips and best practices
// @route   POST /api/ai/farming-tips
// @access  Private
exports.getFarmingTips = async (req, res, next) => {
  try {
    const { crop_name, growth_stage, issue } = req.body;

    if (!crop_name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide crop name'
      });
    }

    const prompt = `You are an expert agricultural advisor. Provide practical farming tips and best practices for:

Crop: ${crop_name}
Growth Stage: ${growth_stage || 'All stages'}
Specific Issue: ${issue || 'General guidance'}

Provide comprehensive advice covering:
1. Current stage management
2. Nutrient requirements
3. Pest and disease prevention
4. Irrigation management
5. Common mistakes to avoid
6. Expected challenges and solutions

Format your response in clear, actionable points that farmers can easily follow.`;

    let tipsText;
    try {
      tipsText = await generateContent(prompt);
    } catch (aiError) {
      console.error('AI generation failed, using fallback:', aiError.message);
      tipsText = fallbackResponses.farmingTips(crop_name, growth_stage);
    }

    res.status(200).json({
      success: true,
      data: {
        crop: crop_name,
        growth_stage: growth_stage || 'General',
        tips: tipsText,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Get farming tips error:', error);
    next(error);
  }
};

// @desc    Get pest and disease prevention advice
// @route   POST /api/ai/pest-prevention
// @access  Private
exports.getPestPrevention = async (req, res, next) => {
  try {
    const { crop_name, season, soil_type } = req.body;

    if (!crop_name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide crop name'
      });
    }

    const prompt = `As an agricultural pest management expert, provide comprehensive pest and disease prevention strategies for:

Crop: ${crop_name}
Season: ${season || 'Current'}
Soil Type: ${soil_type || 'Not specified'}

Include:
1. Common pests and diseases for this crop
2. Early warning signs
3. Preventive measures (organic and chemical)
4. Integrated Pest Management (IPM) practices
5. Monitoring schedule
6. Emergency response actions

Provide practical, cost-effective solutions suitable for small to medium farmers.`;

    let preventionText;
    try {
      preventionText = await generateContent(prompt);
    } catch (aiError) {
      console.error('AI generation failed, using fallback:', aiError.message);
      preventionText = fallbackResponses.pestPrevention(crop_name);
    }

    res.status(200).json({
      success: true,
      data: {
        crop: crop_name,
        prevention_guide: preventionText,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Get pest prevention error:', error);
    next(error);
  }
};

// @desc    Get soil health analysis and recommendations
// @route   POST /api/ai/soil-analysis
// @access  Private
exports.getSoilAnalysis = async (req, res, next) => {
  try {
    const { soil_type, ph_level, organic_matter, crops_grown } = req.body;

    if (!soil_type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide soil type'
      });
    }

    const prompt = `As a soil health expert, analyze and provide recommendations for:

Soil Type: ${soil_type}
pH Level: ${ph_level || 'Not tested'}
Organic Matter: ${organic_matter || 'Not measured'}
Previous Crops: ${crops_grown || 'Not specified'}

Provide:
1. Soil characteristics and properties
2. Nutrient management recommendations
3. Soil improvement strategies
4. Suitable crops for this soil
5. Fertilizer recommendations (organic and chemical)
6. Soil conservation practices
7. Water management for this soil type

Give practical advice for improving and maintaining soil health.`;

    let analysisText;
    try {
      analysisText = await generateContent(prompt);
    } catch (aiError) {
      console.error('AI generation failed, using fallback:', aiError.message);
      analysisText = fallbackResponses.soilAnalysis(soil_type);
    }

    res.status(200).json({
      success: true,
      data: {
        soil_type,
        analysis: analysisText,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Get soil analysis error:', error);
    next(error);
  }
};

// @desc    Get harvest timing recommendations
// @route   POST /api/ai/harvest-timing
// @access  Private
exports.getHarvestTiming = async (req, res, next) => {
  try {
    const { crop_name, sowing_date, variety } = req.body;

    if (!crop_name || !sowing_date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide crop name and sowing date'
      });
    }

    const model = getGeminiProModel();

    const sowingDateObj = new Date(sowing_date);
    const today = new Date();
    const daysGrown = Math.floor((today - sowingDateObj) / (1000 * 60 * 60 * 24));

    const prompt = `As a crop harvesting expert, provide harvest timing recommendations for:

Crop: ${crop_name}
Variety: ${variety || 'Standard'}
Sowing Date: ${sowing_date}
Days Since Sowing: ${daysGrown} days

Provide:
1. Expected harvest date range
2. Maturity indicators to look for
3. Optimal harvesting time of day
4. Harvesting methods and techniques
5. Post-harvest handling guidelines
6. Storage recommendations
7. Quality factors affecting market price

Give specific, actionable advice for maximizing yield quality and market value.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const timingText = response.text();

    res.status(200).json({
      success: true,
      data: {
        crop: crop_name,
        sowing_date,
        days_grown: daysGrown,
        harvest_recommendations: timingText,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Get harvest timing error:', error);
    next(error);
  }
};


// @desc    Get fertilizer recommendations
// @route   POST /api/ai/fertilizer-recommendation
// @access  Private
exports.fertilizerRecommendation = async (req, res, next) => {
  try {
    const { soilType, cropType, nitrogen, phosphorus, potassium } = req.body;

    const prompt = `You are an agricultural expert specializing in soil nutrition. Provide fertilizer recommendations for:

Soil Type: ${soilType}
Crop Type: ${cropType}
Current Nutrient Levels:
- Nitrogen (N): ${nitrogen || 'Unknown'}
- Phosphorus (P): ${phosphorus || 'Unknown'}
- Potassium (K): ${potassium || 'Unknown'}

Respond in JSON format:
{
  "fertilizer_plan": [
    {
      "fertilizer": "Fertilizer Name (NPK ratio)",
      "quantity": "Amount per acre",
      "timing": "When to apply",
      "method": "How to apply"
    }
  ],
  "advice": "General fertilization advice"
}

Provide specific, practical recommendations for Indian farmers.`;

    const responseText = await generateContent(prompt);
    
    let recommendation;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      recommendation = jsonMatch ? JSON.parse(jsonMatch[0]) : { 
        fertilizer_plan: [], 
        advice: responseText 
      };
    } catch {
      recommendation = { fertilizer_plan: [], advice: responseText };
    }

    res.status(200).json({
      success: true,
      data: recommendation
    });

  } catch (error) {
    console.error('Fertilizer recommendation error:', error);
    next(error);
  }
};

// @desc    Get pest management recommendations
// @route   POST /api/ai/pest-management
// @access  Private
exports.pestManagement = async (req, res, next) => {
  try {
    const { cropType, symptoms, season } = req.body;

    const prompt = `You are a pest management expert. Provide pest control recommendations for:

Crop: ${cropType}
Symptoms: ${symptoms}
Season: ${season}

Respond in JSON format:
{
  "management_plan": [
    {
      "pest_type": "Pest Name",
      "control_method": "Control approach",
      "prevention": "Prevention tips"
    }
  ]
}`;

    const responseText = await generateContent(prompt);
    
    let recommendation;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      recommendation = jsonMatch ? JSON.parse(jsonMatch[0]) : { 
        management_plan: [], 
        advice: responseText 
      };
    } catch {
      recommendation = { management_plan: [], advice: responseText };
    }

    res.status(200).json({
      success: true,
      data: recommendation
    });

  } catch (error) {
    console.error('Pest management error:', error);
    next(error);
  }
};

// @desc    Get irrigation schedule
// @route   POST /api/ai/irrigation-schedule
// @access  Private
exports.irrigationSchedule = async (req, res, next) => {
  try {
    const { cropType, soilType, season, farmSize } = req.body;

    const prompt = `You are an irrigation expert. Provide irrigation schedule for:

Crop: ${cropType}
Soil: ${soilType}
Season: ${season}
Farm Size: ${farmSize} acres

Respond in JSON format:
{
  "schedule": [
    {
      "stage": "Growth Stage",
      "frequency": "How often",
      "water_amount": "Amount",
      "duration": "Duration",
      "notes": "Important notes"
    }
  ]
}`;

    const responseText = await generateContent(prompt);
    
    let recommendation;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      recommendation = jsonMatch ? JSON.parse(jsonMatch[0]) : { 
        schedule: [], 
        advice: responseText 
      };
    } catch {
      recommendation = { schedule: [], advice: responseText };
    }

    res.status(200).json({
      success: true,
      data: recommendation
    });

  } catch (error) {
    console.error('Irrigation schedule error:', error);
    next(error);
  }
};

// @desc    Get harvest prediction
// @route   POST /api/ai/harvest-prediction
// @access  Private
exports.harvestPrediction = async (req, res, next) => {
  try {
    const { cropType, plantingDate, weather } = req.body;

    const prompt = `You are an agricultural forecasting expert. Predict harvest details for:

Crop: ${cropType}
Planting Date: ${plantingDate}
Weather: ${weather}

Respond in JSON format:
{
  "prediction": {
    "harvest_date": "Expected date",
    "expected_yield": "Yield estimate",
    "quality": "Quality grade",
    "factors": ["Factor 1", "Factor 2"]
  }
}`;

    const responseText = await generateContent(prompt);
    
    let recommendation;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      recommendation = jsonMatch ? JSON.parse(jsonMatch[0]) : { 
        prediction: {}, 
        advice: responseText 
      };
    } catch {
      recommendation = { prediction: {}, advice: responseText };
    }

    res.status(200).json({
      success: true,
      data: recommendation
    });

  } catch (error) {
    console.error('Harvest prediction error:', error);
    next(error);
  }
};
