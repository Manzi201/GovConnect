const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes (admin/official only)
router.get('/dashboard', authenticate, authorize(['admin', 'official']), analyticsController.getDashboard);
router.get('/performance', authenticate, authorize(['admin', 'official']), analyticsController.getPerformanceMetrics);
router.get('/complaints-by-category', authenticate, authorize(['admin', 'official']), analyticsController.getComplaintsByCategory);
router.get('/complaints-by-priority', authenticate, authorize(['admin', 'official']), analyticsController.getComplaintsByPriority);
router.get('/district-performance', authenticate, authorize(['admin', 'official']), analyticsController.getDistrictPerformance);
router.get('/satisfaction-score', authenticate, authorize(['admin', 'official']), analyticsController.getSatisfactionScore);

module.exports = router;
