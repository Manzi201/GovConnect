const Complaint = require('../models/Complaint');
const User = require('../models/User');

// Submit complaint
exports.submitComplaint = async (req, res) => {
  try {
    const { category, title, description, location, attachments, isAnonymous, isUrgent } = req.body;

    const complaint = new Complaint({
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

    await complaint.save();

    // Update user complaint count
    await User.findByIdAndUpdate(req.user.id, { $inc: { complaintsCount: 1 } });

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: complaint
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

    const complaints = await Complaint.find(filter)
      .populate('userId', 'name email phone')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ submittedAt: -1 });

    const total = await Complaint.countDocuments(filter);

    res.status(200).json({
      complaints,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email phone location')
      .populate('assignedTo', 'name email department');

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Increment views
    complaint.views += 1;
    await complaint.save();

    res.status(200).json({ complaint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update complaint
exports.updateComplaint = async (req, res) => {
  try {
    const { status, priority, assignedTo, resolution } = req.body;
    
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status,
        priority,
        assignedTo,
        resolution,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // If resolved, update user resolved complaints count
    if (status === 'resolved') {
      await User.findByIdAndUpdate(complaint.userId, { $inc: { resolvedComplaintsCount: 1 } });
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
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Decrease user complaint count
    await User.findByIdAndUpdate(complaint.userId, { $inc: { complaintsCount: -1 } });

    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit feedback for complaint
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        feedback: {
          rating,
          comment,
          submittedAt: new Date()
        }
      },
      { new: true }
    );

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
    
    const complaints = await Complaint.find({ userId: req.params.userId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ submittedAt: -1 });

    const total = await Complaint.countDocuments({ userId: req.params.userId });

    res.status(200).json({
      complaints,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
