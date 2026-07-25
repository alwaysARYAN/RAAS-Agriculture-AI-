const express = require('express');
const {
  getMarketPrices,
  comparePrices,
  addMarketPrice,
  getTrendingCommodities,
  getPriceHistory
} = require('../controllers/marketController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/prices')
  .get(getMarketPrices)
  .post(addMarketPrice);

router.get('/compare/:commodity', comparePrices);
router.get('/trending', getTrendingCommodities);
router.get('/history/:commodity', getPriceHistory);

module.exports = router;
