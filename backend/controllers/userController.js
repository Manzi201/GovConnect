const { User, sequelize } = require('../models');
const { Op } = require('sequelize');
const jwtSimple = require('jwt-simple');

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'citizen',
      location: location || 'Kigali'
    });

    // Generate JWT token
    const token = jwtSimple.encode(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      message: 'Urakaza neza! Registration successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: error.errors.map(e => e.message).join(', ')
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'This email or phone number is already registered.' });
    }
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwtSimple.encode(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        complaintsCount: user.complaintsCount,
        resolvedComplaintsCount: user.resolvedComplaintsCount
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        complaintsCount: user.complaintsCount,
        resolvedComplaintsCount: user.resolvedComplaintsCount
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, location, profilePhoto } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ name, phone, location, profilePhoto });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwtSimple.encode(
      { id: user.id, type: 'reset' },
      process.env.JWT_SECRET
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    res.status(200).json({
      message: 'Password reset link sent to your email',
      resetToken
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const decoded = jwtSimple.decode(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.resetPasswordToken !== token || new Date() > user.resetPasswordExpire) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search for officials
exports.searchOfficials = async (req, res) => {
  try {
    const { institution, department, serviceArea, location } = req.query;

    const filter = { role: 'official', isActive: true };
    if (institution) filter.institution = { [Op.iLike]: `%${institution}%` };
    if (department) filter.department = { [Op.iLike]: `%${department}%` };
    if (serviceArea) filter.serviceArea = { [Op.iLike]: `%${serviceArea}%` };
    if (location) filter.location = { [Op.iLike]: `%${location}%` };

    const officials = await User.findAll({
      where: filter,
      attributes: ['id', 'name', 'institution', 'department', 'serviceArea', 'designation', 'location', 'profilePhoto'],
      limit: 50
    });

    res.status(200).json({ officials });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};
