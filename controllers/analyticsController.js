const { Complaint, sequelize } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// Get analytics dashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalComplaints = await Complaint.count();
    const resolvedComplaints = await Complaint.count({ where: { status: 'resolved' } });
    const pendingComplaints = await Complaint.count({
      where: {
        status: { [Op.in]: ['submitted', 'in-progress'] }
      }
    });
    const urgentComplaints = await Complaint.count({ where: { priority: 'urgent' } });

    // Average resolution time (PostgreSQL interval difference logic)
    const avgTimeResult = await sequelize.query(`
      SELECT AVG(EXTRACT(EPOCH FROM ((resolution->>'resolvedAt')::timestamp - "createdAt"))) as "avgTime"
      FROM "Complaints"
      WHERE status = 'resolved'
    `, { type: sequelize.QueryTypes.SELECT });

    const categoryCounts = await Complaint.findAll({
      attributes: [
        ['category', '_id'],
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['category'],
      raw: true
    });

    const resolutionRate = totalComplaints > 0
      ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2)
      : "0.00";

    res.status(200).json({
      dashboard: {
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        urgentComplaints,
        resolutionRate: resolutionRate + '%',
        averageResolutionTime: avgTimeResult[0]?.avgTime || 0,
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

    const where = {};
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const metrics = await Complaint.findAll({
      where,
      attributes: [
        [fn('COUNT', col('id')), 'total'],
        [
          fn('SUM', literal("CASE WHEN status = 'resolved' THEN 1 ELSE 0 END")),
          'resolved'
        ],
        [
          fn('SUM', literal("CASE WHEN status IN ('submitted', 'in-progress') THEN 1 ELSE 0 END")),
          'pending'
        ],
        [
          fn('AVG', literal("EXTRACT(EPOCH FROM ((resolution->>'resolvedAt')::timestamp - \"createdAt\"))")),
          'avgTime'
        ]
      ],
      raw: true
    });

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
    const data = await Complaint.findAll({
      attributes: [
        ['category', '_id'],
        [fn('COUNT', col('id')), 'count'],
        [
          fn('SUM', literal("CASE WHEN status = 'resolved' THEN 1 ELSE 0 END")),
          'resolved'
        ]
      ],
      group: ['category'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      raw: true
    });

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get complaints by priority
exports.getComplaintsByPriority = async (req, res) => {
  try {
    const data = await Complaint.findAll({
      attributes: [
        ['priority', '_id'],
        [fn('COUNT', col('id')), 'count'],
        [
          fn('SUM', literal("CASE WHEN status = 'resolved' THEN 1 ELSE 0 END")),
          'resolved'
        ]
      ],
      group: ['priority'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      raw: true
    });

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get district performance
exports.getDistrictPerformance = async (req, res) => {
  try {
    const data = await Complaint.findAll({
      attributes: [
        [literal("location->>'district'"), '_id'],
        [fn('COUNT', col('id')), 'totalComplaints'],
        [
          fn('SUM', literal("CASE WHEN status = 'resolved' THEN 1 ELSE 0 END")),
          'resolved'
        ],
        [
          fn('SUM', literal("CASE WHEN status IN ('submitted', 'in-progress') THEN 1 ELSE 0 END")),
          'pending'
        ]
      ],
      group: [literal("location->>'district'")],
      order: [[fn('COUNT', col('id')), 'DESC']],
      raw: true
    });

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get satisfaction score
exports.getSatisfactionScore = async (req, res) => {
  try {
    const scores = await Complaint.findAll({
      attributes: [
        [fn('AVG', literal("(feedback->>'rating')::float")), 'averageScore'],
        [fn('COUNT', literal("feedback->>'rating'")), 'totalFeedback']
      ],
      where: {
        feedback: {
          [Op.ne]: null
        }
      },
      raw: true
    });

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
