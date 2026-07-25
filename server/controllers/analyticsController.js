const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const Disease = require('../models/Disease');
const Market = require('../models/Market');

// @desc    Get comprehensive analytics for user
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all user farms and crops
    const farms = await Farm.find({ user_id: userId });
    const crops = await Crop.find({ user_id: userId });
    const diseases = await Disease.find({ user_id: userId });

    // Calculate totals
    const totalFarms = farms.length;
    const totalCrops = crops.length;
    const totalLand = farms.reduce((sum, farm) => sum + (farm.area || 0), 0);
    const totalDiseaseDetections = diseases.length;

    // Crop health distribution
    const healthDistribution = {
      Healthy: crops.filter(c => c.health_status === 'Healthy').length,
      'Needs Attention': crops.filter(c => c.health_status === 'Needs Attention').length,
      Critical: crops.filter(c => c.health_status === 'Critical').length,
      Unknown: crops.filter(c => !c.health_status || c.health_status === 'Unknown').length
    };

    // Growth stage distribution
    const stageDistribution = {};
    crops.forEach(crop => {
      const stage = crop.stage || 'Unknown';
      stageDistribution[stage] = (stageDistribution[stage] || 0) + 1;
    });

    // Crops by type
    const cropsByType = {};
    crops.forEach(crop => {
      const name = crop.crop_name || 'Unknown';
      cropsByType[name] = (cropsByType[name] || 0) + 1;
    });

    // Recent diseases
    const recentDiseases = diseases
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(d => ({
        disease: d.disease_name,
        confidence: d.confidence,
        severity: d.severity,
        date: d.createdAt,
        crop: d.crop_id?.crop_name || 'Unknown'
      }));

    // Monthly crop additions (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const cropsByMonth = {};
    crops.forEach(crop => {
      const date = new Date(crop.planting_date || crop.createdAt);
      if (date >= sixMonthsAgo) {
        const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        cropsByMonth[monthYear] = (cropsByMonth[monthYear] || 0) + 1;
      }
    });

    // Calculate average yield (if available)
    const cropsWithYield = crops.filter(c => c.expected_yield);
    const avgYield = cropsWithYield.length > 0
      ? cropsWithYield.reduce((sum, c) => sum + c.expected_yield, 0) / cropsWithYield.length
      : 0;

    // Soil type distribution
    const soilTypes = {};
    farms.forEach(farm => {
      const soil = farm.soil_type || 'Unknown';
      soilTypes[soil] = (soilTypes[soil] || 0) + 1;
    });

    // Irrigation method distribution
    const irrigationMethods = {};
    farms.forEach(farm => {
      const method = farm.irrigation_method || 'Unknown';
      irrigationMethods[method] = (irrigationMethods[method] || 0) + 1;
    });

    // Calculate productivity score (0-100)
    let productivityScore = 50; // Base score
    if (totalCrops > 0) productivityScore += 10;
    if (healthDistribution.Healthy > healthDistribution.Critical) productivityScore += 20;
    if (totalDiseaseDetections < totalCrops * 0.2) productivityScore += 10;
    if (avgYield > 0) productivityScore += 10;
    productivityScore = Math.min(100, productivityScore);

    // Risk assessment
    const criticalCrops = healthDistribution.Critical || 0;
    const riskLevel = criticalCrops > totalCrops * 0.3 ? 'High' :
                     criticalCrops > totalCrops * 0.1 ? 'Medium' : 'Low';

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalFarms,
          totalCrops,
          totalLand,
          totalDiseaseDetections,
          avgYield: avgYield.toFixed(2),
          productivityScore,
          riskLevel
        },
        charts: {
          healthDistribution,
          stageDistribution,
          cropsByType,
          cropsByMonth,
          soilTypes,
          irrigationMethods
        },
        recentDiseases,
        recommendations: generateRecommendations(
          healthDistribution,
          riskLevel,
          totalCrops,
          criticalCrops
        )
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    next(error);
  }
};

// @desc    Get crop performance analytics
// @route   GET /api/analytics/crops
// @access  Private
exports.getCropAnalytics = async (req, res, next) => {
  try {
    const crops = await Crop.find({ user_id: req.user._id })
      .populate('farm_id', 'name area')
      .sort({ createdAt: -1 });

    // Calculate performance metrics for each crop
    const cropPerformance = crops.map(crop => {
      const daysGrowing = Math.floor(
        (new Date() - new Date(crop.planting_date || crop.createdAt)) / (1000 * 60 * 60 * 24)
      );

      return {
        name: crop.crop_name,
        farm: crop.farm_id?.name || 'Unknown',
        daysGrowing,
        stage: crop.stage,
        health: crop.health_status,
        expectedYield: crop.expected_yield || 0,
        area: crop.area_planted || 0
      };
    });

    res.status(200).json({
      success: true,
      data: cropPerformance
    });
  } catch (error) {
    console.error('Get crop analytics error:', error);
    next(error);
  }
};

// Helper function to generate recommendations
function generateRecommendations(healthDist, riskLevel, totalCrops, criticalCrops) {
  const recommendations = [];

  if (riskLevel === 'High') {
    recommendations.push({
      icon: '⚠️',
      title: 'Urgent: High Risk Detected',
      message: `${criticalCrops} crops need immediate attention. Check disease detection and apply treatments.`,
      priority: 'urgent'
    });
  }

  if (healthDist.Critical > 0) {
    recommendations.push({
      icon: '🦠',
      title: 'Critical Crops Detected',
      message: `${healthDist.Critical} crops are in critical condition. Review and take action.`,
      priority: 'high'
    });
  }

  if (healthDist['Needs Attention'] > 0) {
    recommendations.push({
      icon: '👁️',
      title: 'Monitor These Crops',
      message: `${healthDist['Needs Attention']} crops need attention. Regular monitoring recommended.`,
      priority: 'medium'
    });
  }

  if (totalCrops === 0) {
    recommendations.push({
      icon: '🌱',
      title: 'Get Started',
      message: 'Add your first crop to start tracking growth and receiving AI recommendations.',
      priority: 'low'
    });
  }

  if (healthDist.Healthy > totalCrops * 0.7) {
    recommendations.push({
      icon: '✅',
      title: 'Great Job!',
      message: 'Most of your crops are healthy. Keep up the good farming practices!',
      priority: 'low'
    });
  }

  return recommendations;
}

module.exports = exports;
