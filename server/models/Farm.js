const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  farmer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farmer ID is required'],
    index: true
  },
  farmName: {
    type: String,
    required: [true, 'Farm name is required'],
    trim: true,
    maxlength: [200, 'Farm name cannot exceed 200 characters']
  },
  location: {
    address: {
      type: String,
      trim: true,
      default: ''
    },
    village: {
      type: String,
      trim: true,
      default: ''
    },
    district: {
      type: String,
      trim: true,
      default: ''
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      trim: true,
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    }
  },
  soil_type: {
    type: String,
    required: [true, 'Soil type is required'],
    enum: ['Clay', 'Sandy', 'Loamy', 'Silty', 'Peaty', 'Chalky', 'Red', 'Black', 'Alluvial']
  },
  area: {
    type: Number,
    required: [true, 'Farm area is required'],
    min: [0.01, 'Area must be greater than 0'],
    max: [100000, 'Area cannot exceed 100,000 acres']
  },
  areaUnit: {
    type: String,
    enum: ['acres', 'hectares', 'bigha'],
    default: 'acres'
  },
  irrigationType: {
    type: String,
    enum: ['Drip', 'Sprinkler', 'Flood', 'Rainfed', 'Mixed'],
    default: 'Rainfed'
  },
  waterSource: {
    type: String,
    enum: ['Well', 'Borewell', 'Canal', 'River', 'Pond', 'Rainwater', 'Mixed'],
    default: 'Rainwater'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
farmSchema.index({ farmer_id: 1, isActive: 1 });

module.exports = mongoose.model('Farm', farmSchema);
