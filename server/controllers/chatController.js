const ChatHistory = require('../models/ChatHistory');
const { generateContent } = require('../config/gemini-direct');
const { generateChatResponse, fallbackResponses } = require('../utils/fallbackAI');
const crypto = require('crypto');
const aiCache = require('../utils/aiCache');

// Generate unique session ID
const generateSessionId = () => {
  return crypto.randomUUID();
};

// System prompt for agricultural chatbot
const SYSTEM_CONTEXT = `You are an expert agricultural advisor AI assistant for Indian farmers. Your role is to provide accurate, practical, and culturally appropriate agricultural advice in a friendly and supportive manner.

Your expertise includes:
- Crop cultivation practices
- Pest and disease management
- Soil health and fertilization
- Irrigation and water management
- Weather-based farming decisions
- Government schemes and subsidies
- Market prices and selling strategies
- Organic farming methods
- Sustainable agriculture practices

Guidelines:
1. Provide clear, actionable advice that farmers can implement
2. Consider Indian agricultural context, climate, and practices
3. Use simple language, avoid complex technical jargon
4. Be encouraging and supportive
5. When discussing pesticides or chemicals, always mention safety precautions
6. Suggest both organic and conventional solutions when appropriate
7. If you're unsure about something specific, acknowledge it and suggest consulting local agricultural experts
8. Keep responses concise but comprehensive (aim for 150-300 words unless more detail is requested)

Always prioritize farmer safety, environmental sustainability, and economic viability in your recommendations.`;

// @desc    Send message to AI chatbot
// @route   POST /api/chat/message
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { message, session_id } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }

    // Check if Gemini API is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
      return res.status(200).json({
        success: true,
        data: {
          session_id: session_id || generateSessionId(),
          user_message: message,
          ai_response: 'AI Chatbot is not configured. Please add your GEMINI_API_KEY in the .env file to enable AI-powered farming assistance.',
          timestamp: new Date()
        }
      });
    }

    // Use existing session or create new one
    const sessionId = session_id || generateSessionId();

    // Get chat history for context
    let chatHistory = await ChatHistory.findOne({
      farmer_id: req.user._id,
      session_id: sessionId,
      is_active: true
    });

    // If no history exists, create new chat session
    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        farmer_id: req.user._id,
        session_id: sessionId,
        messages: [],
        topic: 'New Conversation'
      });
    }

    // Build conversation context for AI
    let conversationHistory = SYSTEM_CONTEXT + '\n\nConversation History:\n';
    
    // Include last 10 messages for context
    const recentMessages = chatHistory.messages.slice(-10);
    recentMessages.forEach(msg => {
      conversationHistory += `${msg.role === 'user' ? 'Farmer' : 'AI'}: ${msg.content}\n`;
    });

    // Add current user message
    conversationHistory += `\nFarmer: ${message}\nAI:`;

    let aiReply;
    
    try {
      // Get AI response using direct API
      aiReply = await generateContent(conversationHistory);
    } catch (aiError) {
      console.error('AI generation error, using fallback:', aiError.message);
      // Use fallback response based on message keywords
      aiReply = generateChatResponse(message);
    }

    // Save user message
    chatHistory.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Save AI response
    chatHistory.messages.push({
      role: 'assistant',
      content: aiReply,
      timestamp: new Date()
    });

    // Auto-detect topic from first user message
    if (chatHistory.messages.length <= 2) {
      const topicKeywords = {
        'Disease': ['disease', 'pest', 'infection', 'fungus', 'insect', 'leaf', 'spot'],
        'Weather': ['weather', 'rain', 'temperature', 'climate', 'drought', 'flood'],
        'Irrigation': ['water', 'irrigation', 'drip', 'sprinkler', 'watering'],
        'Fertilizer': ['fertilizer', 'nutrient', 'NPK', 'manure', 'compost'],
        'Market': ['price', 'market', 'sell', 'mandi', 'buyer'],
        'Scheme': ['scheme', 'subsidy', 'government', 'yojana', 'loan'],
        'Crop': ['crop', 'sowing', 'planting', 'harvest', 'variety']
      };

      const lowerMessage = message.toLowerCase();
      for (const [topic, keywords] of Object.entries(topicKeywords)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
          chatHistory.topic = topic + ' Query';
          break;
        }
      }
    }

    await chatHistory.save();

    res.status(200).json({
      success: true,
      data: {
        session_id: sessionId,
        user_message: message,
        ai_response: aiReply,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Send message error:', error);
    next(error);
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
exports.getChatHistory = async (req, res, next) => {
  try {
    const { session_id, limit = 10 } = req.query;

    let query = {
      farmer_id: req.user._id,
      is_active: true
    };

    if (session_id) {
      query.session_id = session_id;
    }

    const chatHistories = await ChatHistory.find(query)
      .sort({ last_interaction: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: chatHistories.length,
      data: chatHistories
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    next(error);
  }
};

// @desc    Get single chat session
// @route   GET /api/chat/session/:sessionId
// @access  Private
exports.getChatSession = async (req, res, next) => {
  try {
    const chatHistory = await ChatHistory.findOne({
      farmer_id: req.user._id,
      session_id: req.params.sessionId
    });

    if (!chatHistory) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    res.status(200).json({
      success: true,
      data: chatHistory
    });

  } catch (error) {
    console.error('Get chat session error:', error);
    next(error);
  }
};

// @desc    Delete chat session
// @route   DELETE /api/chat/session/:sessionId
// @access  Private
exports.deleteChatSession = async (req, res, next) => {
  try {
    const chatHistory = await ChatHistory.findOne({
      farmer_id: req.user._id,
      session_id: req.params.sessionId
    });

    if (!chatHistory) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    // Soft delete
    chatHistory.is_active = false;
    await chatHistory.save();

    res.status(200).json({
      success: true,
      message: 'Chat session deleted successfully'
    });

  } catch (error) {
    console.error('Delete chat session error:', error);
    next(error);
  }
};

// @desc    Clear all chat history
// @route   DELETE /api/chat/history
// @access  Private
exports.clearChatHistory = async (req, res, next) => {
  try {
    await ChatHistory.updateMany(
      { farmer_id: req.user._id },
      { is_active: false }
    );

    res.status(200).json({
      success: true,
      message: 'All chat history cleared successfully'
    });

  } catch (error) {
    console.error('Clear chat history error:', error);
    next(error);
  }
};

// @desc    Get quick help suggestions
// @route   GET /api/chat/suggestions
// @access  Private
exports.getQuickSuggestions = async (req, res, next) => {
  try {
    const suggestions = [
      {
        category: 'Crop Cultivation',
        questions: [
          'What is the best time to sow wheat?',
          'How can I improve crop yield?',
          'Which crops are suitable for my soil type?'
        ]
      },
      {
        category: 'Disease Management',
        questions: [
          'How do I identify and treat leaf blight?',
          'What are organic pest control methods?',
          'How to prevent fungal diseases in crops?'
        ]
      },
      {
        category: 'Water Management',
        questions: [
          'How often should I water my crops?',
          'What is drip irrigation and its benefits?',
          'How to conserve water during drought?'
        ]
      },
      {
        category: 'Fertilizers',
        questions: [
          'What is the right NPK ratio for my crop?',
          'How to make organic compost at home?',
          'When should I apply fertilizers?'
        ]
      },
      {
        category: 'Government Schemes',
        questions: [
          'What government schemes am I eligible for?',
          'How to apply for PM-KISAN?',
          'What is crop insurance and how does it work?'
        ]
      },
      {
        category: 'Market & Selling',
        questions: [
          'Where can I get the best price for my crops?',
          'How to use e-NAM platform?',
          'What is the current market price for wheat?'
        ]
      }
    ];

    res.status(200).json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    console.error('Get suggestions error:', error);
    next(error);
  }
};

// @desc    Get AI agricultural insights
// @route   POST /api/chat/insights
// @access  Private
exports.getAgriculturalInsights = async (req, res, next) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a topic'
      });
    }

    // Check cache first
    const cacheKey = aiCache.generateKey('insights', { topic });
    const cachedInsight = aiCache.get(cacheKey);
    if (cachedInsight) {
      return res.status(200).json({
        success: true,
        data: cachedInsight
      });
    }

    // Check if Gemini API is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
      return res.status(200).json({
        success: true,
        data: {
          topic,
          insight: 'Gemini AI is not configured. Please add your GEMINI_API_KEY to get AI-powered insights.',
          timestamp: new Date()
        }
      });
    }

    const prompt = `Provide a brief, practical agricultural insight or tip about: ${topic}

The insight should be:
1. Specific and actionable
2. Relevant for Indian farmers
3. Based on best practices
4. 2-3 sentences maximum
5. Include a "Did you know?" fact if relevant

Topic: ${topic}`;

    const insight = await generateContent(prompt);

    const insightData = {
      topic,
      insight,
      timestamp: new Date()
    };

    // Cache the insight
    aiCache.set(cacheKey, insightData);

    res.status(200).json({
      success: true,
      data: insightData
    });

  } catch (error) {
    console.error('Get insights error:', error.message);
    
    // Return fallback insight
    res.status(200).json({
      success: true,
      data: {
        topic: req.body.topic,
        insight: 'AI insights are temporarily unavailable. Please check your Gemini API configuration or try again later.',
        timestamp: new Date()
      }
    });
  }
};

// @desc    Get daily farming tip
// @route   GET /api/chat/daily-tip
// @access  Private
exports.getDailyTip = async (req, res, next) => {
  try {
    // Check cache first
    const cachedTip = aiCache.getDailyTip();
    if (cachedTip) {
      return res.status(200).json({
        success: true,
        data: cachedTip
      });
    }

    // Check if Gemini API is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
      const fallbackTip = fallbackResponses.getDailyTip();
      aiCache.setDailyTip(fallbackTip);
      return res.status(200).json({
        success: true,
        data: fallbackTip
      });
    }

    const today = new Date();
    const month = today.toLocaleString('default', { month: 'long' });
    const season = today.getMonth() >= 6 && today.getMonth() <= 9 ? 'Kharif (Monsoon)' : 
                   today.getMonth() >= 10 || today.getMonth() <= 2 ? 'Rabi (Winter)' : 
                   'Zaid (Summer)';

    const prompt = `Provide a practical, seasonal farming tip for Indian farmers.

Current Context:
- Month: ${month}
- Season: ${season}

The tip should be:
1. Relevant to current season
2. Immediately actionable
3. 2-3 sentences
4. Include specific tasks farmers should do now
5. Mention any important precautions

Format: Start with an emoji relevant to the tip, then the advice.`;

    let tip;
    let tipData;
    
    try {
      tip = await generateContent(prompt);
      tipData = {
        date: today.toDateString(),
        season,
        tip,
        source: 'AI Agricultural Advisor'
      };
    } catch (aiError) {
      console.error('AI generation failed, using fallback:', aiError.message);
      tipData = fallbackResponses.getDailyTip();
    }

    // Cache the tip for the day
    aiCache.setDailyTip(tipData);

    res.status(200).json({
      success: true,
      data: tipData
    });

  } catch (error) {
    console.error('Get daily tip error:', error.message);
    
    // Return a fallback tip instead of failing
    const fallbackTip = fallbackResponses.getDailyTip();
    aiCache.setDailyTip(fallbackTip);

    res.status(200).json({
      success: true,
      data: fallbackTip
    });
  }
};
