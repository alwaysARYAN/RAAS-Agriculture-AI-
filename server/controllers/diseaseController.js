const Disease = require('../models/Disease');
const Crop = require('../models/Crop');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { generateContentWithImage } = require('../config/gemini-direct');
const axios = require('axios');
const fs = require('fs').promises;

// Helper function to convert image to base64
const fileToGenerativePart = async (filePath, mimeType) => {
  const imageData = await fs.readFile(filePath);
  return {
    inlineData: {
      data: imageData.toString('base64'),
      mimeType
    }
  };
};

// @desc    Detect crop disease using AI
// @route   POST /api/disease/detect
// @access  Private
exports.detectDisease = async (req, res, next) => {
  try {
    const { crop_id } = req.body;

    // Check if image file is uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const imageFile = req.files.image;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(imageFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Only JPEG, JPG, and PNG images are allowed'
      });
    }

    // Optional: Verify crop belongs to user if crop_id provided and not 'general'
    let crop = null;
    let cropInfo = {
      crop_name: 'General Crop',
      variety: '',
      stage: 'Unknown',
      farm_id: { soil_type: 'Unknown' }
    };

    if (crop_id && crop_id !== 'general' && crop_id !== 'demo') {
      crop = await Crop.findOne({
        _id: crop_id,
        farmer_id: req.user._id,
        isActive: true
      }).populate('farm_id', 'farmName soil_type');

      if (crop) {
        cropInfo = crop;
      }
    }

    // Upload image to Cloudinary
    console.log('📤 Uploading image to Cloudinary...');
    const cloudinaryResult = await uploadToCloudinary(imageFile, 'agriculture-ai/diseases');

    // Analyze image with Gemini Vision
    console.log('🤖 Analyzing image with Gemini AI...');

    // Convert image to base64
    const imageData = await fs.readFile(imageFile.tempFilePath);
    const imageBase64 = imageData.toString('base64');

    const prompt = `You are an expert agricultural pathologist. Analyze this plant/crop leaf image and provide a detailed disease diagnosis.

Please provide your response in the following JSON format:
{
  "disease_name": "Name of the disease or 'Healthy' if no disease detected",
  "confidence_score": confidence percentage as a number between 0-100,
  "severity": "Low", "Medium", "High", or "Critical",
  "affected_area": "Leaves", "Stem", "Roots", "Fruits", "Flowers", or "Entire Plant",
  "treatment": "Detailed treatment recommendations",
  "organic_treatment": "Organic/natural treatment options",
  "chemical_treatment": "Chemical treatment options with specific pesticide/fungicide names",
  "preventive_measures": ["List", "of", "preventive", "measures"]
}

Crop information: ${cropInfo.crop_name}${cropInfo.variety ? ' - ' + cropInfo.variety : ''}
Soil type: ${cropInfo.farm_id.soil_type}
Growth stage: ${cropInfo.stage}

Provide accurate, practical advice for farmers. If the plant appears healthy, indicate so with confidence score.`;

    const analysisText = await generateContentWithImage(prompt, imageBase64, imageFile.mimetype);

    console.log('✅ AI Analysis completed');

    // Parse AI response
    let diseaseData;
    try {
      // Try to extract JSON from response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        diseaseData = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback parsing if JSON not found
        diseaseData = {
          disease_name: 'Analysis Completed',
          confidence_score: 75,
          severity: 'Medium',
          affected_area: 'Leaves',
          treatment: analysisText,
          organic_treatment: 'Please consult the full analysis',
          chemical_treatment: 'Please consult the full analysis',
          preventive_measures: ['Regular monitoring', 'Proper irrigation', 'Good field hygiene']
        };
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      diseaseData = {
        disease_name: 'Analysis Completed',
        confidence_score: 70,
        severity: 'Medium',
        affected_area: 'Leaves',
        treatment: analysisText,
        organic_treatment: analysisText.substring(0, 500),
        chemical_treatment: 'Consult local agricultural expert',
        preventive_measures: ['Regular monitoring', 'Proper irrigation']
      };
    }

    // Create disease record (only if crop exists in database)
    let disease;
    if (crop && crop._id) {
      disease = await Disease.create({
        crop_id: crop._id,
        farmer_id: req.user._id,
        image_url: cloudinaryResult.url,
        cloudinary_public_id: cloudinaryResult.public_id,
        disease_name: diseaseData.disease_name,
        confidence_score: diseaseData.confidence_score,
        severity: diseaseData.severity || 'Medium',
        treatment: diseaseData.treatment,
        organic_treatment: diseaseData.organic_treatment || '',
        chemical_treatment: diseaseData.chemical_treatment || '',
        preventive_measures: diseaseData.preventive_measures || [],
        affected_area: diseaseData.affected_area || 'Leaves',
        ai_analysis: {
          raw_response: analysisText,
          model_used: 'gemini-2.5-flash',
          analysis_timestamp: new Date()
        }
      });

      // Update crop health status
      if (diseaseData.disease_name.toLowerCase() !== 'healthy') {
        crop.health_status = 'Diseased';
        await crop.save();
      }

      // Populate crop details
      await disease.populate('crop_id', 'crop_name variety stage');
    }

    // Return analysis results (whether or not saved to database)
    res.status(201).json({
      success: true,
      message: 'Disease detection completed successfully',
      data: disease || {
        image_url: cloudinaryResult.url,
        disease_name: diseaseData.disease_name,
        confidence_score: diseaseData.confidence_score,
        severity: diseaseData.severity || 'Medium',
        treatment: diseaseData.treatment,
        organic_treatment: diseaseData.organic_treatment || '',
        chemical_treatment: diseaseData.chemical_treatment || '',
        preventive_measures: diseaseData.preventive_measures || [],
        affected_area: diseaseData.affected_area || 'Leaves',
        crop_info: cropInfo.crop_name
      }
    });

  } catch (error) {
    console.error('Detect disease error:', error);
    next(error);
  }
};

// @desc    Get all disease detections for user
// @route   GET /api/disease
// @access  Private
exports.getDiseases = async (req, res, next) => {
  try {
    const { crop_id, status, severity } = req.query;

    // Build query
    const query = { farmer_id: req.user._id };

    if (crop_id) query.crop_id = crop_id;
    if (status) query.status = status;
    if (severity) query.severity = severity;

    const diseases = await Disease.find(query)
      .populate('crop_id', 'crop_name variety stage')
      .sort({ detection_date: -1 });

    res.status(200).json({
      success: true,
      count: diseases.length,
      data: diseases
    });

  } catch (error) {
    console.error('Get diseases error:', error);
    next(error);
  }
};

// @desc    Get single disease detection by ID
// @route   GET /api/disease/:id
// @access  Private
exports.getDiseaseById = async (req, res, next) => {
  try {
    const disease = await Disease.findOne({
      _id: req.params.id,
      farmer_id: req.user._id
    })
      .populate('crop_id', 'crop_name variety stage health_status')
      .populate('farmer_id', 'name phone');

    if (!disease) {
      return res.status(404).json({
        success: false,
        message: 'Disease record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: disease
    });

  } catch (error) {
    console.error('Get disease by ID error:', error);
    next(error);
  }
};

// @desc    Update disease status
// @route   PATCH /api/disease/:id/status
// @access  Private
exports.updateDiseaseStatus = async (req, res, next) => {
  try {
    const { status, farmer_notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const disease = await Disease.findOne({
      _id: req.params.id,
      farmer_id: req.user._id
    });

    if (!disease) {
      return res.status(404).json({
        success: false,
        message: 'Disease record not found'
      });
    }

    disease.status = status;
    if (farmer_notes) disease.farmer_notes = farmer_notes;

    await disease.save();

    // Update crop health if disease is resolved
    if (status === 'Resolved') {
      const crop = await Crop.findById(disease.crop_id);
      if (crop) {
        crop.health_status = 'Healthy';
        await crop.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Disease status updated successfully',
      data: disease
    });

  } catch (error) {
    console.error('Update disease status error:', error);
    next(error);
  }
};

// @desc    Delete disease record
// @route   DELETE /api/disease/:id
// @access  Private
exports.deleteDisease = async (req, res, next) => {
  try {
    const disease = await Disease.findOne({
      _id: req.params.id,
      farmer_id: req.user._id
    });

    if (!disease) {
      return res.status(404).json({
        success: false,
        message: 'Disease record not found'
      });
    }

    // Delete image from Cloudinary
    if (disease.cloudinary_public_id) {
      try {
        await deleteFromCloudinary(disease.cloudinary_public_id);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
      }
    }

    // Delete disease record
    await disease.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Disease record deleted successfully'
    });

  } catch (error) {
    console.error('Delete disease error:', error);
    next(error);
  }
};

// @desc    Get disease statistics
// @route   GET /api/disease/stats/summary
// @access  Private
exports.getDiseaseStats = async (req, res, next) => {
  try {
    const diseases = await Disease.find({ farmer_id: req.user._id });

    // Count by status
    const statusCounts = {};
    diseases.forEach(disease => {
      statusCounts[disease.status] = (statusCounts[disease.status] || 0) + 1;
    });

    // Count by severity
    const severityCounts = {};
    diseases.forEach(disease => {
      severityCounts[disease.severity] = (severityCounts[disease.severity] || 0) + 1;
    });

    // Most common diseases
    const diseaseCounts = {};
    diseases.forEach(disease => {
      diseaseCounts[disease.disease_name] = (diseaseCounts[disease.disease_name] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        totalDetections: diseases.length,
        statusCounts,
        severityCounts,
        commonDiseases: diseaseCounts,
        recentDetections: diseases.slice(0, 5)
      }
    });

  } catch (error) {
    console.error('Get disease stats error:', error);
    next(error);
  }
};
