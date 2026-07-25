const express = require('express');
const {
  getSchemes,
  getEligibleSchemes,
  getSchemeById,
  searchSchemes,
  createScheme
} = require('../controllers/schemeController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getSchemes);
router.get('/eligible', getEligibleSchemes);
router.get('/search', searchSchemes);
router.get('/:id', getSchemeById);

// Admin only
router.post('/', authorize('admin'), createScheme);

module.exports = router;
