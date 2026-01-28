const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');

router.get('/:otherUserId', authenticate, messageController.getMessages);
router.post('/', authenticate, messageController.sendMessage);
router.patch('/read/:senderId', authenticate, messageController.markAsRead);

module.exports = router;
