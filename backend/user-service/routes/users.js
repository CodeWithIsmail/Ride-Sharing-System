const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Verify token endpoint for other services
router.get('/verify', auth, async (req, res) => {
  try {
    res.json({
      userId: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user details by ID
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      userId: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin endpoints
// GET /api/users/admin/all - Get all users (admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    const userList = users.map(user => ({
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt
    }));

    res.json(userList);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/users/admin/:userId/deactivate - Deactivate user (admin only)
router.patch('/admin/:userId/deactivate', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    res.json({
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 