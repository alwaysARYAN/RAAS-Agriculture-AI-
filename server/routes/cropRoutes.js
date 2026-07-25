const express = require('express');
const {
  createCrop,
  getCrops,
  getCropById,
  updateCrop,
  updateCropStage,
  recordHarvest,
  deleteCrop,
  getCropStats
} = require('../controllers/cropController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getCrops)
  .post(createCrop);

router.get('/stats/summary', getCropStats);

router.route('/:id')
  .get(getCropById)
  .put(updateCrop)
  .delete(deleteCrop);

router.patch('/:id/stage', updateCropStage);
router.post('/:id/harvest', recordHarvest);

module.exports = router;
