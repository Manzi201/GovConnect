const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/', complaintController.getAllComplaints);
router.get('/:id', complaintController.getComplaintById);
router.post('/', complaintController.submitComplaint);

// Protected routes
router.patch('/:id', authenticate, complaintController.updateComplaint);
router.delete('/:id', authenticate, complaintController.deleteComplaint);
router.post('/:id/feedback', authenticate, complaintController.submitFeedback);
router.get('/user/:userId', authenticate, complaintController.getUserComplaints);

module.exports = router;
