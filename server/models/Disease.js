const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  crop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: [true, 'Crop ID is required'],
    index: true
  },
  farmer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farmer ID is required'],
    index: true
  },
  image_url: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  cloudinary_public_id: {
    type: String,
    trim: true
  },
  disease_name: {
    type: String,
    required: [true, 'Disease name is required'],
    trim: true,
    maxlength: [200, 'Disease name cannot exceed 200 characters']
  },
  confidence_score: {
    type: Number,
    required: [true, 'Confidence score is required'],
    min: [0, 'Confidence score cannot be negative'],
    max: [100, 'Confidence score cannot exceed 100']
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  treatment: {
    type: String,
    required: [true, 'Treatment information is required'],
    maxlength: [2000, 'Treatment information cannot exceed 2000 characters']
  },
  preventive_measures: {
    type: [String],
    default: []
  },
  organic_treatment: {
    type: String,
    maxlength: [2000, 'Organic treatment information cannot exceed 2000 characters'],
    default: ''
  },
  chemical_treatment: {
    type: String,
    maxlength: [2000, 'Chemical treatment information cannot exceed 2000 characters'],
    default: ''
  },
  affected_area: {
    type: String,
    enum: ['Leaves', 'Stem', 'Roots', 'Fruits', 'Flowers', 'Entire Plant', 'Multiple Parts'],
    default: 'Leaves'
  },
  detection_date: {
    type: Date,
    default: Date.now,
    required: true
  },
  status: {
    type: String,
    enum: ['Detected', 'Under Treatment', 'Resolved', 'Worsened'],
    default: 'Detected'
  },
  ai_analysis: {
    raw_response: {
      type: String,
      default: ''
    },
    model_used: {
      type: String,
      default: 'gemini-pro-vision'
    },
    analysis_timestamp: {
      type: Date,
      default: Date.now
    }
  },
  farmer_notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient queries
diseaseSchema.index({ farmer_id: 1, detection_date: -1 });
diseaseSchema.index({ crop_id: 1, detection_date: -1 });
diseaseSchema.index({ status: 1 });

module.exports = mongoose.model('Disease', diseaseSchema);
