const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const userAuth = require('../middleware/auth')


router.get('/myProfile', userAuth, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.patch('/update', userAuth, async (req, res, next) => {
  try {
    // Allow only certain fields to be updated
    const allowedUpdates = ['firstName', 'lastName', 'avatar', 'bio'];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });

  } catch (err) {
    console.error('Update Error:', err.message);
    next(err);
  }
});


// PATCH /user/change-password
router.patch('/change-password', userAuth, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Validate inputs
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Both old and new passwords are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    // Find the user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare old password
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect.' });
    }

    // Update to new password
    user.password = newPassword;
    await user.save(); // Will trigger `pre('save')` hook for hashing

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Password Change Error:', err.message);
    next(err);
  }
});

//search results
router.get('/search', userAuth, async (req, res) => {
  try {
    const q = req.query.q;

    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Query is required.' });
    }

    const users = await User.find({
      username: { $regex: q, $options: 'i' }
    }).select('username avatar bio');

    // ✅ Always return 200 with either array of users or empty array
    res.status(200).json(users);
    
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /user/:username
router.get('/:username',userAuth, async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password -friendRequests');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});



module.exports = router;
