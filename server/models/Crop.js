const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farm_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: [true, 'Farm ID is required'],
    index: true
  },
  farmer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farmer ID is required'],
    index: true
  },
  crop_name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true,
    maxlength: [100, 'Crop name cannot exceed 100 characters']
  },
  variety: {
    type: String,
    trim: true,
    default: ''
  },
  sowing_date: {
    type: Date,
    required: [true, 'Sowing date is required']
  },
  expected_harvest_date: {
    type: Date
  },
  actual_harvest_date: {
    type: Date
  },
  area_planted: {
    type: Number,
    required: [true, 'Planted area is required'],
    min: [0.01, 'Area must be greater than 0']
  },
  areaUnit: {
    type: String,
    enum: ['acres', 'hectares', 'bigha'],
    default: 'acres'
  },
  stage: {
    type: String,
    enum: ['Sowing', 'Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity', 'Harvested'],
    default: 'Sowing'
  },
  health_status: {
    type: String,
    enum: ['Healthy', 'At Risk', 'Diseased', 'Poor', 'Unknown'],
    default: 'Unknown'
  },
  season: {
    type: String,
    enum: ['Kharif', 'Rabi', 'Zaid', 'Perennial'],
    required: [true, 'Season is required']
  },
  expected_yield: {
    type: Number,
    min: 0,
    default: 0
  },
  actual_yield: {
    type: Number,
    min: 0,
    default: 0
  },
  yieldUnit: {
    type: String,
    enum: ['quintals', 'tons', 'kg'],
    default: 'quintals'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate growth stage based on sowing date
cropSchema.methods.calculateGrowthDays = function() {
  const today = new Date();
  const sowingDate = new Date(this.sowing_date);
  const diffTime = Math.abs(today - sowingDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Index for efficient queries
cropSchema.index({ farmer_id: 1, isActive: 1 });
cropSchema.index({ farm_id: 1, isActive: 1 });
cropSchema.index({ sowing_date: 1 });

module.exports = mongoose.model('Crop', cropSchema);
