const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  scheme_name: {
    type: String,
    required: [true, 'Scheme name is required'],
    trim: true,
    unique: true,
    maxlength: [300, 'Scheme name cannot exceed 300 characters']
  },
  scheme_code: {
    type: String,
    trim: true,
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  scheme_type: {
    type: String,
    enum: ['Subsidy', 'Loan', 'Insurance', 'Training', 'Equipment', 'Seeds', 'Fertilizer', 'Market Support', 'Other'],
    default: 'Subsidy'
  },
  government_level: {
    type: String,
    enum: ['Central', 'State', 'District', 'Combined'],
    default: 'Central'
  },
  eligible_states: {
    type: [String],
    default: []
  },
  eligibility_criteria: {
    min_land_size: {
      type: Number,
      min: 0,
      default: 0
    },
    max_land_size: {
      type: Number,
      default: null
    },
    crop_types: {
      type: [String],
      default: []
    },
    farmer_category: {
      type: [String],
      enum: ['Small', 'Marginal', 'Medium', 'Large', 'All'],
      default: ['All']
    },
    age_limit: {
      min: {
        type: Number,
        default: 18
      },
      max: {
        type: Number,
        default: null
      }
    },
    income_limit: {
      type: Number,
      default: null
    }
  },
  benefits: {
    type: String,
    required: [true, 'Benefits information is required'],
    maxlength: [2000, 'Benefits information cannot exceed 2000 characters']
  },
  subsidy_amount: {
    type: Number,
    min: 0,
    default: 0
  },
  subsidy_percentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  application_process: {
    type: String,
    maxlength: [1500, 'Application process cannot exceed 1500 characters'],
    default: ''
  },
  required_documents: {
    type: [String],
    default: []
  },
  official_website: {
    type: String,
    trim: true,
    default: ''
  },
  helpline_number: {
    type: String,
    trim: true,
    default: ''
  },
  start_date: {
    type: Date,
    default: null
  },
  end_date: {
    type: Date,
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
  },
  last_updated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to check if scheme is applicable for a farmer
schemeSchema.methods.isEligible = function(farmerState, landSize) {
  if (!this.is_active) return false;
  
  // Check state eligibility
  if (this.eligible_states.length > 0 && !this.eligible_states.includes(farmerState)) {
    return false;
  }
  
  // Check land size eligibility
  const criteria = this.eligibility_criteria;
  if (criteria.min_land_size && landSize < criteria.min_land_size) {
    return false;
  }
  if (criteria.max_land_size && landSize > criteria.max_land_size) {
    return false;
  }
  
  return true;
};

// Index for efficient queries
schemeSchema.index({ is_active: 1 });
schemeSchema.index({ eligible_states: 1 });
schemeSchema.index({ scheme_type: 1 });

module.exports = mongoose.model('Scheme', schemeSchema);
