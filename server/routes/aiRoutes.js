const express = require('express');
const {
  recommendCrops,
  getFarmingTips,
  getPestPrevention,
  getSoilAnalysis,
  getHarvestTiming,
  fertilizerRecommendation,
  pestManagement,
  irrigationSchedule,
  harvestPrediction
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Original routes
router.post('/recommend-crops', recommendCrops);
router.post('/farming-tips', getFarmingTips);
router.post('/pest-prevention', getPestPrevention);
router.post('/soil-analysis', getSoilAnalysis);
router.post('/harvest-timing', getHarvestTiming);

// Additional routes for Recommendations component
router.post('/fertilizer-recommendation', fertilizerRecommendation);
router.post('/pest-management', pestManagement);
router.post('/irrigation-schedule', irrigationSchedule);
router.post('/harvest-prediction', harvestPrediction);

module.exports = router;
