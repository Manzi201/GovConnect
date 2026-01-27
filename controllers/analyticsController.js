const Complaint = require('../models/Complaint');
const PerformanceMetric = require('../models/PerformanceMetric');

// Get analytics dashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const pendingComplaints = await Complaint.countDocuments({ status: { $in: ['submitted', 'in-progress'] } });
    const urgentComplaints = await Complaint.countDocuments({ priority: 'urgent' });

    const avgResolutionTime = await Complaint.aggregate([
      { $match: { status: 'resolved' } },
      {
        $group: {
          _id: null,
          avgTime: { $avg: { $subtract: ['$resolution.resolvedAt', '$submittedAt'] } }
        }
      }
    ]);

    const categoryCounts = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const resolutionRate = ((resolvedComplaints / totalComplaints) * 100).toFixed(2);

    res.status(200).json({
      dashboard: {
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        urgentComplaints,
        resolutionRate: resolutionRate + '%',
        averageResolutionTime: avgResolutionTime[0]?.avgTime || 0,
        categoryBreakdown: categoryCounts
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get performance metrics
exports.getPerformanceMetrics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = {};
    if (startDate && endDate) {
      filter.submittedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const metrics = await Complaint.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $in: ['$status', ['submitted', 'in-progress']] }, 1, 0] }
          },
          avgTime: { $avg: { $subtract: ['$resolution.resolvedAt', '$submittedAt'] } }
        }
      }
    ]);

    res.status(200).json({
      metrics: metrics[0] || {
        total: 0,
        resolved: 0,
        pending: 0,
        avgTime: 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get complaints by category
exports.getComplaintsByCategory = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get complaints by priority
exports.getComplaintsByPriority = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get district performance
exports.getDistrictPerformance = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $group: {
          _id: '$location.district',
          totalComplaints: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $in: ['$status', ['submitted', 'in-progress']] }, 1, 0] }
          }
        }
      },
      { $sort: { totalComplaints: -1 } }
    ]);

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get satisfaction score
exports.getSatisfactionScore = async (req, res) => {
  try {
    const scores = await Complaint.aggregate([
      {
        $match: { 'feedback.rating': { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$feedback.rating' },
          totalFeedback: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      satisfactionScore: scores[0] || {
        averageScore: 0,
        totalFeedback: 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
