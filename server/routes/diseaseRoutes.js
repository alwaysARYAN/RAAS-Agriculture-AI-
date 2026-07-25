const express = require('express');
const {
  detectDisease,
  getDiseases,
  getDiseaseById,
  updateDiseaseStatus,
  deleteDisease,
  getDiseaseStats
} = require('../controllers/diseaseController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getDiseases);

router.post('/detect', detectDisease);
router.get('/stats/summary', getDiseaseStats);

router.route('/:id')
  .get(getDiseaseById)
  .delete(deleteDisease);

router.patch('/:id/status', updateDiseaseStatus);

module.exports = router;
