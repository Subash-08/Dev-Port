const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const userAuth = require('../middleware/auth')

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public



router.post('/register', async (req, res) => {
  try {
    const { username, firstName, lastName, email, password, avatar, bio } = req.body;

    // Check required fields
    if (!username || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields.' });
    }

    // Check if username or email already exists
    const userExists = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (userExists) {
      return res.status(400).json({ message: 'Username or email already in use.' });
    }

    // Create new user
    const newUser = await User.create({
      username,
      firstName,
      lastName,
      email,
      password,
      avatar,
      bio
    });

    // Generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
res
  .cookie('token', token, {
    httpOnly: true,        // prevents JavaScript access (secure)
    secure: process.env.NODE_ENV === 'production', // true if using HTTPS
    sameSite: 'Lax',       // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })
  .status(201)
  .json({
    token,
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      avatar: newUser.avatar,
      bio: newUser.bio,
    }
  });

  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Send token in cookie
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // false in dev
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      .status(200)
      .json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          bio: user.bio,
        }
      });

  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


//logout
router.post('/logout', (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production', // use HTTPS in prod
    })
    .status(200)
    .json({ message: 'Logged out successfully' });
});


module.exports = router;
