const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: {
    type: String,
    unique: true,
    default: () => 'NOTIF-' + Date.now()
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true
  },
  type: {
    type: String,
    enum: ['status-update', 'new-comment', 'feedback-request', 'escalation', 'system'],
    default: 'status-update'
  },
  channel: {
    type: String,
    enum: ['email', 'sms', 'in-app', 'push'],
    default: 'in-app'
  },
  subject: String,
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  actionUrl: String,
  sentAt: {
    type: Date,
    default: Date.now
  },
  deliveredAt: Date,
  failureReason: String,
  retryCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
