const Farm = require('../models/Farm');
const Crop = require('../models/Crop');

// @desc    Create a new farm
// @route   POST /api/farms
// @access  Private
exports.createFarm = async (req, res, next) => {
  try {
    const {
      farmName,
      location,
      soil_type,
      area,
      areaUnit,
      irrigationType,
      waterSource
    } = req.body;

    // Validate required fields
    if (!farmName || !soil_type || !area || !location?.state) {
      return res.status(400).json({
        success: false,
        message: 'Please provide farm name, soil type, area, and state'
      });
    }

    // Create farm
    const farm = await Farm.create({
      farmer_id: req.user._id,
      farmName,
      location,
      soil_type,
      area,
      areaUnit: areaUnit || 'acres',
      irrigationType: irrigationType || 'Rainfed',
      waterSource: waterSource || 'Rainwater'
    });

    res.status(201).json({
      success: true,
      message: 'Farm created successfully',
      data: farm
    });

  } catch (error) {
    console.error('Create farm error:', error);
    next(error);
  }
};

// @desc    Get all farms for logged in user
// @route   GET /api/farms
// @access  Private
exports.getFarms = async (req, res, next) => {
  try {
    const farms = await Farm.find({
      farmer_id: req.user._id,
      isActive: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: farms.length,
      data: farms
    });

  } catch (error) {
    console.error('Get farms error:', error);
    next(error);
  }
};

// @desc    Get single farm by ID
// @route   GET /api/farms/:id
// @access  Private
exports.getFarmById = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.id,
      farmer_id: req.user._id,
      isActive: true
    }).populate('farmer_id', 'name phone');

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    // Get crops for this farm
    const crops = await Crop.find({
      farm_id: farm._id,
      isActive: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        farm,
        crops
      }
    });

  } catch (error) {
    console.error('Get farm by ID error:', error);
    next(error);
  }
};

// @desc    Update farm
// @route   PUT /api/farms/:id
// @access  Private
exports.updateFarm = async (req, res, next) => {
  try {
    let farm = await Farm.findOne({
      _id: req.params.id,
      farmer_id: req.user._id
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    // Update farm
    farm = await Farm.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Farm updated successfully',
      data: farm
    });

  } catch (error) {
    console.error('Update farm error:', error);
    next(error);
  }
};

// @desc    Delete farm (soft delete)
// @route   DELETE /api/farms/:id
// @access  Private
exports.deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.id,
      farmer_id: req.user._id
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    // Soft delete
    farm.isActive = false;
    await farm.save();

    // Also deactivate all crops in this farm
    await Crop.updateMany(
      { farm_id: farm._id },
      { isActive: false }
    );

    res.status(200).json({
      success: true,
      message: 'Farm deleted successfully'
    });

  } catch (error) {
    console.error('Delete farm error:', error);
    next(error);
  }
};

// @desc    Get farm statistics
// @route   GET /api/farms/stats/summary
// @access  Private
exports.getFarmStats = async (req, res, next) => {
  try {
    const farms = await Farm.find({
      farmer_id: req.user._id,
      isActive: true
    });

    const crops = await Crop.find({
      farmer_id: req.user._id,
      isActive: true
    });

    // Calculate total area
    const totalArea = farms.reduce((sum, farm) => sum + farm.area, 0);

    // Count crops by stage
    const cropsByStage = {};
    crops.forEach(crop => {
      cropsByStage[crop.stage] = (cropsByStage[crop.stage] || 0) + 1;
    });

    // Count crops by health status
    const cropsByHealth = {};
    crops.forEach(crop => {
      cropsByHealth[crop.health_status] = (cropsByHealth[crop.health_status] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        totalFarms: farms.length,
        totalArea: totalArea,
        totalCrops: crops.length,
        activeCrops: crops.filter(c => c.stage !== 'Harvested').length,
        harvestedCrops: crops.filter(c => c.stage === 'Harvested').length,
        cropsByStage,
        cropsByHealth
      }
    });

  } catch (error) {
    console.error('Get farm stats error:', error);
    next(error);
  }
};
