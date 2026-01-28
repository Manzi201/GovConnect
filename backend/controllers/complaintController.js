const { Complaint, User } = require('../models');

// Submit complaint
exports.submitComplaint = async (req, res) => {
  try {
    const { category, title, description, location, attachments, isAnonymous, isUrgent } = req.body;

    const complaint = await Complaint.create({
      userId: req.user.id,
      category,
      title,
      description,
      location,
      attachments: attachments || [],
      isAnonymous: isAnonymous || false,
      isUrgent: isUrgent || false,
      priority: isUrgent ? 'urgent' : 'medium'
    });

    // Update user complaint count
    await User.increment('complaintsCount', { by: 1, where: { id: req.user.id } });

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all complaints (with filters)
exports.getAllComplaints = async (req, res) => {
  try {
    const { category, status, priority, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const { count, rows: complaints } = await Complaint.findAndCountAll({
      where: filter,
      include: [
        { model: User, as: 'citizen', attributes: ['name', 'email', 'phone'] }
      ],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      complaints,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id, {
      include: [
        { model: User, as: 'citizen', attributes: ['name', 'email', 'phone', 'location'] },
        { model: User, as: 'official', attributes: ['name', 'email', 'department'] }
      ]
    });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Increment views
    await complaint.increment('views', { by: 1 });

    res.status(200).json({ complaint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update complaint
exports.updateComplaint = async (req, res) => {
  try {
    const { status, priority, assignedTo, resolution } = req.body;

    const complaint = await Complaint.findByPk(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const oldStatus = complaint.status;

    await complaint.update({
      status,
      priority,
      assignedTo,
      resolution
    });

    // If newly resolved, update user resolved complaints count
    if (status === 'resolved' && oldStatus !== 'resolved') {
      await User.increment('resolvedComplaintsCount', { by: 1, where: { id: complaint.userId } });
    }

    res.status(200).json({
      message: 'Complaint updated successfully',
      complaint
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const userId = complaint.userId;
    await complaint.destroy();

    // Decrease user complaint count
    await User.increment('complaintsCount', { by: -1, where: { id: userId } });

    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit feedback for complaint
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const complaint = await Complaint.findByPk(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    await complaint.update({
      feedback: {
        rating,
        comment,
        submittedAt: new Date()
      }
    });

    res.status(200).json({
      message: 'Feedback submitted successfully',
      complaint
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's complaints
exports.getUserComplaints = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const { count, rows: complaints } = await Complaint.findAndCountAll({
      where: { userId: req.params.userId },
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      complaints,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
