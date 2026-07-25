const express = require('express');
const {
  getCurrentWeather,
  getForecast,
  getFarmWeather,
  getIrrigationRecommendation,
  getWeatherAlerts
} = require('../controllers/weatherController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/current', getCurrentWeather);
router.get('/forecast', getForecast);
router.get('/alerts', getWeatherAlerts);
router.get('/farm/:farmId', getFarmWeather);
router.get('/irrigation/:farmId', getIrrigationRecommendation);

module.exports = router;
