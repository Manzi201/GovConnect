const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, chatController.sendMessage);
router.get('/:otherUserId', authenticate, chatController.getMessages);
router.patch('/read/:senderId', authenticate, chatController.markAsRead);

module.exports = router;
