const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  commodity: {
    type: String,
    required: [true, 'Commodity name is required'],
    trim: true,
    maxlength: [100, 'Commodity name cannot exceed 100 characters']
  },
  variety: {
    type: String,
    trim: true,
    default: 'General'
  },
  market_name: {
    type: String,
    required: [true, 'Market name is required'],
    trim: true,
    maxlength: [200, 'Market name cannot exceed 200 characters']
  },
  mandi_name: {
    type: String,
    trim: true,
    default: ''
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true
  },
  price_data: {
    min_price: {
      type: Number,
      required: [true, 'Minimum price is required'],
      min: [0, 'Price cannot be negative']
    },
    max_price: {
      type: Number,
      required: [true, 'Maximum price is required'],
      min: [0, 'Price cannot be negative']
    },
    modal_price: {
      type: Number,
      required: [true, 'Modal price is required'],
      min: [0, 'Price cannot be negative']
    }
  },
  price_unit: {
    type: String,
    enum: ['per quintal', 'per kg', 'per ton'],
    default: 'per quintal'
  },
  arrival_quantity: {
    type: Number,
    min: 0,
    default: 0
  },
  price_date: {
    type: Date,
    required: [true, 'Price date is required'],
    default: Date.now
  },
  price_trend: {
    type: String,
    enum: ['Up', 'Down', 'Stable'],
    default: 'Stable'
  },
  change_percentage: {
    type: Number,
    default: 0
  },
  season: {
    type: String,
    enum: ['Kharif', 'Rabi', 'Zaid', 'All'],
    default: 'All'
  },
  source: {
    type: String,
    enum: ['Government API', 'Manual Entry', 'Web Scraping', 'Market Feed'],
    default: 'Manual Entry'
  },
  is_verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
marketPriceSchema.index({ commodity: 1, state: 1, price_date: -1 });
marketPriceSchema.index({ district: 1, price_date: -1 });
marketPriceSchema.index({ price_date: -1 });

// Method to get average price
marketPriceSchema.methods.getAveragePrice = function() {
  return (this.price_data.min_price + this.price_data.max_price + this.price_data.modal_price) / 3;
};

module.exports = mongoose.model('Market', marketPriceSchema);
