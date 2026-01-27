const mongoose = require('mongoose');

const performanceMetricSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  totalComplaints: {
    type: Number,
    default: 0
  },
  resolvedComplaints: {
    type: Number,
    default: 0
  },
  pendingComplaints: {
    type: Number,
    default: 0
  },
  rejectedComplaints: {
    type: Number,
    default: 0
  },
  averageResolutionTime: {
    type: Number,
    default: 0
  },
  resolutionRate: {
    type: Number,
    default: 0
  },
  categoryBreakdown: {
    type: Map,
    of: Number,
    default: new Map()
  },
  priorityBreakdown: {
    type: Map,
    of: Number,
    default: new Map()
  },
  departmentPerformance: [
    {
      department: String,
      totalHandled: Number,
      resolved: Number,
      averageTime: Number
    }
  ],
  districtPerformance: [
    {
      district: String,
      totalComplaints: Number,
      resolved: Number,
      pendingResolution: Number
    }
  ],
  satisfactionScore: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  urgentComplaintsHandled: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PerformanceMetric', performanceMetricSchema);
