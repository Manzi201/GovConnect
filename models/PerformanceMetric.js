const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PerformanceMetric = sequelize.define('PerformanceMetric', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  period: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalComplaints: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  resolvedComplaints: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  avgResolutionTime: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  categoryBreakdown: {
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
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = PerformanceMetric;
