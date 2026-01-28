const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PerformanceMetric = sequelize.define('PerformanceMetric', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  totalComplaints: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  resolvedComplaints: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  pendingComplaints: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rejectedComplaints: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageResolutionTime: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  resolutionRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  categoryBreakdown: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  priorityBreakdown: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  departmentPerformance: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  districtPerformance: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  satisfactionScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  urgentComplaintsHandled: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = PerformanceMetric;
