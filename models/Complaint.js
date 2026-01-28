const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Complaint = sequelize.define('Complaint', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  complaintId: {
    type: DataTypes.STRING,
    unique: true,
    defaultValue: () => 'COMP-' + Date.now()
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM(
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
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  location: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('submitted', 'in-progress', 'resolved', 'closed', 'rejected'),
    defaultValue: 'submitted'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  isUrgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: true
  },
  resolution: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  feedback: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  statusUpdates: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  timestamps: true
});

module.exports = Complaint;
