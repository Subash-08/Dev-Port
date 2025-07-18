const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const userAuth = require('../middleware/auth');
const upload = require('../middleware/upload');
const mongoose = require('mongoose');

router.get('/myProfile', userAuth, async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// PATCH /user/update
router.patch('/update', userAuth, upload.single('avatar'), async (req, res, next) => {
  try {
    // Step 1: Whitelisted fields
    const allowedUpdates = ['firstName', 'lastName', 'bio'];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Step 2: Handle uploaded file (avatar)
    if (req.file) {
      updates.avatar = `/uploads/${req.file.filename}`; // saved public path
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    // Step 3: Update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    return res.status(200).json({
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
// GET /user/search?q=query
router.get('/search', userAuth, async (req, res) => {
  try {
    const q = req.query.q;

    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Query is required.' });
    }

    const users = await User.find({
      username: { $regex: q, $options: 'i' },
      _id: { $ne: req.user._id } // 👈 exclude current user
    }).select('username avatar bio');

    res.status(200).json(users);
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /user/:username

// @route   GET /user/friends/status/:userId
// @desc    Check friendship status with a user
// @access  Private
// routes/userRoutes.js or wherever your user routes are defined
router.get('/friends/status/:id', userAuth, async (req, res) => {
  const currentUserId = req.user._id;
  const targetUserId = req.params.id;

  if (currentUserId.toString() === targetUserId) {
    return res.json({ status: 'self' });
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) return res.status(404).json({ message: 'User not found' });

  if (
    currentUser.friends.includes(targetUserId) ||
    targetUser.friends.includes(currentUserId)
  ) {
    return res.json({ status: 'friends' });
  }

  if (targetUser.friendRequests.includes(currentUserId)) {
    return res.json({ status: 'pending' }); // sent request
  }

  if (currentUser.friendRequests.includes(targetUserId)) {
    return res.json({ status: 'received' }); // received request
  }

  return res.json({ status: 'not_friends' });
});


// ----------------------- GET FRIENDS LIST FOR A USER -----------------------
router.get('/friends/list/:userId', userAuth, async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId).populate('friends', 'username avatar');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ friends: user.friends });
  } catch (err) {
    console.error('Error fetching friends list:', err);
    res.status(500).json({ message: 'Failed to fetch friends list' });
  }
});

router.get('/:username', userAuth, async (req, res, next) => {
  try {
    // If the username matches current user's, redirect (or block)
    if (req.params.username === req.user.username) {
      return res.status(400).json({ message: 'You cannot view your own profile here.' });
      // Or optionally return your own profile data:
      // return res.status(200).json(req.user);
    }

    const user = await User.findOne({ username: req.params.username }).select('-password -friendRequests');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/id/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('username name avatar');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
