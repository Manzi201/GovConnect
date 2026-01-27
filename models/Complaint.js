const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true,
    default: () => 'COMP-' + Date.now()
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: [
      'social-welfare',
      'education',
      'healthcare',
      'infrastructure',
      'water-sanitation',
      'electricity',
      'roads',
      'agriculture',
      'security',
      'other'
    ],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Complaint description is required']
  },
  location: {
    district: String,
    sector: String,
    cell: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  attachments: [
    {
      url: String,
      type: String,
      uploadedAt: Date
    }
  ],
  status: {
    type: String,
    enum: ['submitted', 'in-progress', 'resolved', 'closed', 'rejected'],
    default: 'submitted'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  resolution: {
    description: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  statusUpdates: [
    {
      status: String,
      message: String,
      updatedAt: Date,
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
complaintSchema.index({ userId: 1, createdAt: -1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ category: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
