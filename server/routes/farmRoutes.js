const express = require('express');
const {
  createFarm,
  getFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
  getFarmStats
} = require('../controllers/farmController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getFarms)
  .post(createFarm);

router.get('/stats/summary', getFarmStats);

router.route('/:id')
  .get(getFarmById)
  .put(updateFarm)
  .delete(deleteFarm);

module.exports = router;
