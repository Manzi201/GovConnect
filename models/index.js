const { sequelize } = require('../config/database');
const User = require('./User');
const Complaint = require('./Complaint');
const Notification = require('./Notification');
const PerformanceMetric = require('./PerformanceMetric');
const Message = require('./Message');

// Associations
User.hasMany(Complaint, { foreignKey: 'userId', as: 'complaints' });
Complaint.belongsTo(User, { foreignKey: 'userId', as: 'citizen' });

User.hasMany(Complaint, { foreignKey: 'assignedTo', as: 'assignedComplaints' });
Complaint.belongsTo(User, { foreignKey: 'assignedTo', as: 'official' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Complaint.hasMany(Notification, { foreignKey: 'complaintId', as: 'notifications' });
Notification.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });

// Message Associations
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

Message.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });
Complaint.hasMany(Message, { foreignKey: 'complaintId', as: 'messages' });

module.exports = {
    sequelize,
    User,
    Complaint,
    Notification,
    PerformanceMetric,
    Message
};
