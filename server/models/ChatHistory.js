const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  farmer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farmer ID is required'],
    index: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [5000, 'Message content cannot exceed 5000 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  session_id: {
    type: String,
    required: true
    // index: true removed - defined in compound index below
  },
  topic: {
    type: String,
    trim: true,
    default: 'General Query'
  },
  language: {
    type: String,
    default: 'en'
  },
  is_active: {
    type: Boolean,
    default: true
  },
  last_interaction: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update last interaction on message push
chatHistorySchema.pre('save', function(next) {
  this.last_interaction = Date.now();
  next();
});

// Index for efficient queries
chatHistorySchema.index({ farmer_id: 1, last_interaction: -1 });
chatHistorySchema.index({ session_id: 1 });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
