const Crop = require('../models/Crop');
const Farm = require('../models/Farm');
const Disease = require('../models/Disease');

// @desc    Create a new crop
// @route   POST /api/crops
// @access  Private
exports.createCrop = async (req, res, next) => {
  try {
    const {
      farm_id,
      crop_name,
      variety,
      sowing_date,
      expected_harvest_date,
      area_planted,
      areaUnit,
      season,
      stage,
      expected_yield,
      notes
    } = req.body;

    // Validate required fields
    if (!farm_id || !crop_name || !sowing_date || !area_planted || !season) {
      return res.status(400).json({
        success: false,
        message: 'Please provide farm, crop name, sowing date, area, and season'
      });
    }

    // Verify farm belongs to user
    const farm = await Farm.findOne({
      _id: farm_id,
      farmer_id: req.user._id,
      isActive: true
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found or does not belong to you'
      });
    }

    // Create crop
    const crop = await Crop.create({
      farm_id,
      farmer_id: req.user._id,
      crop_name,
      variety: variety || '',
      sowing_date,
      expected_harvest_date,
      area_planted,
      areaUnit: areaUnit || 'acres',
      season,
      stage: stage || 'Sowing',
      expected_yield: expected_yield || 0,
      notes: notes || ''
    });

    // Populate farm details
    await crop.populate('farm_id', 'farmName soil_type');

    res.status(201).json({
      success: true,
      message: 'Crop added successfully',
      data: crop
    });

  } catch (error) {
    console.error('Create crop error:', error);
    next(error);
  }
};

// @desc    Get all crops for logged in user
// @route   GET /api/crops
// @access  Private
exports.getCrops = async (req, res, next) => {
  try {
    const { farm_id, stage, season, isActive } = req.query;

    // Build query
    const query = { farmer_id: req.user._id };

    if (farm_id) query.farm_id = farm_id;
    if (stage) query.stage = stage;
    if (season) query.season = season;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    else query.isActive = true;

    const crops = await Crop.find(query)
      .populate('farm_id', 'farmName soil_type location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops
    });

  } catch (error) {
    console.error('Get crops error:', error);
    next(error);
  }
};

// @desc    Get single crop by ID
// @route   GET /api/crops/:id
// @access  Private
exports.getCropById = async (req, res, next) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer_id: req.user._id
    })
      .populate('farm_id', 'farmName soil_type location irrigationType')
      .populate('farmer_id', 'name phone');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Get disease history for this crop
    const diseases = await Disease.find({
      crop_id: crop._id
    }).sort({ detection_date: -1 });

    // Calculate growth days
    const growthDays = crop.calculateGrowthDays();

    res.status(200).json({
      success: true,
      data: {
        crop,
        diseases,
        growthDays
      }
    });

  } catch (error) {
    console.error('Get crop by ID error:', error);
    next(error);
  }
};

// @desc    Update crop
// @route   PUT /api/crops/:id
// @access  Private
exports.updateCrop = async (req, res, next) => {
  try {
    let crop = await Crop.findOne({
      _id: req.params.id,
      farmer_id: req.user._id
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Update crop
    crop = await Crop.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('farm_id', 'farmName soil_type');

    res.status(200).json({
      success: true,
      message: 'Crop updated successfully',
      data: crop
    });

  } catch (error) {
    console.error('Update crop error:', error);
    next(error);
  }
};

// @desc    Update crop stage
// @route   PATCH /api/crops/:id/stage
// @access  Private
exports.updateCropStage = async (req, res, next) => {
  try {
    const { stage, health_status } = req.body;

    if (!stage) {
      return res.status(400).json({
        success: false,
        message: 'Please provide stage'
      });
    }

    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer_id: req.user._id
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    crop.stage = stage;
    if (health_status) crop.health_status = health_status;

    // If harvested, set actual harvest date
    if (stage === 'Harvested' && !crop.actual_harvest_date) {
      crop.actual_harvest_date = new Date();
    }

    await crop.save();

    res.status(200).json({
      success: true,
      message: 'Crop stage updated successfully',
      data: crop
    });

  } catch (error) {
    console.error('Update crop stage error:', error);
    next(error);
  }
};

// @desc    Record harvest
// @route   POST /api/crops/:id/harvest
// @access  Private
exports.recordHarvest = async (req, res, next) => {
  try {
    const { actual_yield, yieldUnit, actual_harvest_date } = req.body;

    if (!actual_yield) {
      return res.status(400).json({
        success: false,
        message: 'Please provide actual yield'
      });
    }

    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer_id: req.user._id
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    crop.actual_yield = actual_yield;
    if (yieldUnit) crop.yieldUnit = yieldUnit;
    crop.actual_harvest_date = actual_harvest_date || new Date();
    crop.stage = 'Harvested';

    await crop.save();

    res.status(200).json({
      success: true,
      message: 'Harvest recorded successfully',
      data: crop
    });

  } catch (error) {
    console.error('Record harvest error:', error);
    next(error);
  }
};

// @desc    Delete crop (soft delete)
// @route   DELETE /api/crops/:id
// @access  Private
exports.deleteCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer_id: req.user._id
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Soft delete
    crop.isActive = false;
    await crop.save();

    res.status(200).json({
      success: true,
      message: 'Crop deleted successfully'
    });

  } catch (error) {
    console.error('Delete crop error:', error);
    next(error);
  }
};

// @desc    Get crop statistics
// @route   GET /api/crops/stats/summary
// @access  Private
exports.getCropStats = async (req, res, next) => {
  try {
    const crops = await Crop.find({
      farmer_id: req.user._id,
      isActive: true
    });

    // Group by crop name
    const cropCounts = {};
    crops.forEach(crop => {
      cropCounts[crop.crop_name] = (cropCounts[crop.crop_name] || 0) + 1;
    });

    // Calculate total planted area
    const totalPlantedArea = crops.reduce((sum, crop) => sum + crop.area_planted, 0);

    // Harvest statistics
    const harvestedCrops = crops.filter(c => c.stage === 'Harvested' && c.actual_yield > 0);
    const totalYield = harvestedCrops.reduce((sum, crop) => sum + crop.actual_yield, 0);

    res.status(200).json({
      success: true,
      data: {
        totalCrops: crops.length,
        activeCrops: crops.filter(c => c.stage !== 'Harvested').length,
        harvestedCrops: harvestedCrops.length,
        totalPlantedArea,
        totalYield,
        cropCounts,
        recentCrops: crops.slice(0, 5)
      }
    });

  } catch (error) {
    console.error('Get crop stats error:', error);
    next(error);
  }
};
