const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

// Protected routes
router.get('/', authenticate, notificationController.getUserNotifications);
router.get('/:id', authenticate, notificationController.getNotificationById);
router.patch('/:id/read', authenticate, notificationController.markAsRead);
router.patch('/mark-all/read', authenticate, notificationController.markAllAsRead);
router.delete('/:id', authenticate, notificationController.deleteNotification);

module.exports = router;
