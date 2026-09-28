const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).populate('assignedHall');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        assignedHall: user.assignedHall,
        phone: user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// Quick demo login (by user ID) - for seamless testing
router.post('/demo-login', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).populate('assignedHall');
    if (!user) {
      return res.status(404).json({ message: 'Demo user not found' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        assignedHall: user.assignedHall,
        phone: user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during demo login', error: err.message });
  }
});

// Current user profile
router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      department: req.user.department,
      designation: req.user.designation,
      assignedHall: req.user.assignedHall,
      phone: req.user.phone
    }
  });
});

// Get all demo accounts for quick role-switching in UI
router.get('/demo-users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').populate('assignedHall');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch demo accounts', error: err.message });
  }
});

module.exports = router;
