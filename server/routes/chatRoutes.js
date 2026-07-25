const express = require('express');
const {
  sendMessage,
  getChatHistory,
  getChatSession,
  deleteChatSession,
  clearChatHistory,
  getQuickSuggestions,
  getAgriculturalInsights,
  getDailyTip
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/message', sendMessage);
router.get('/history', getChatHistory);
router.delete('/history', clearChatHistory);
router.get('/session/:sessionId', getChatSession);
router.delete('/session/:sessionId', deleteChatSession);
router.get('/suggestions', getQuickSuggestions);
router.post('/insights', getAgriculturalInsights);
router.get('/daily-tip', getDailyTip);

module.exports = router;
