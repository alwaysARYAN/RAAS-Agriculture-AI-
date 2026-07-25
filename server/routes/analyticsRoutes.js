const express = require('express');
const {
  getDashboardAnalytics,
  getCropAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/dashboard', getDashboardAnalytics);
router.get('/crops', getCropAnalytics);

module.exports = router;
