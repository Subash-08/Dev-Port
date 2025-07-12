const express = require('express');
const router = express.Router();
const User = require('../models/user');
const userAuth = require('../middleware/auth');

//send req
router.post('/request/:id', userAuth, async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.params.id;

  if (senderId.toString() === receiverId) {
    return res.status(400).json({ message: "You can't send a request to yourself." });
  }

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!receiver) return res.status(404).json({ message: 'User not found.' });

  if (sender.friends.includes(receiverId) || receiver.friends.includes(senderId)) {
    return res.status(400).json({ message: 'You are already friends.' });
  }

  if (receiver.friendRequests.includes(senderId)) {
    return res.status(400).json({ message: 'Friend request already sent.' });
  }

  if (sender.friendRequests.includes(receiverId)) {
    return res.status(400).json({ message: 'User has already sent you a request.' });
  }

  receiver.friendRequests.push(senderId);
  await receiver.save();

  res.status(200).json({ message: 'Friend request sent.' });
});

//req recieved
router.get('/requests', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friendRequests', 'username firstName lastName avatar');

    res.status(200).json({
      count: user.friendRequests.length,
      requests: user.friendRequests
    });
  } catch (err) {
    console.error('Error getting requests:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// 🔹 Accept Friend Request
router.put('/accept/:id', userAuth, async (req, res) => {
  const receiverId = req.user._id;
  const senderId = req.params.id;

  const receiver = await User.findById(receiverId);
  const sender = await User.findById(senderId);

  if (!receiver || !sender) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (receiver.friends.includes(senderId)) {
    return res.status(400).json({ message: 'You are already friends.' });
  }

  if (!receiver.friendRequests.includes(senderId)) {
    return res.status(400).json({ message: 'No friend request from this user.' });
  }

  receiver.friends.push(senderId);
  sender.friends.push(receiverId);

  receiver.friendRequests.pull(senderId);
  await receiver.save();
  await sender.save();

  res.status(200).json({ message: 'Friend request accepted.' });
});


// 🔹 Reject Friend Request
router.delete('/reject/:id', userAuth, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.friendRequests.includes(req.params.id)) {
    return res.status(400).json({ message: 'Friend request not found.' });
  }

  user.friendRequests.pull(req.params.id);
  await user.save();

  res.status(200).json({ message: 'Friend request rejected.' });
});

// 🔹 Remove Friend
router.delete('/remove/:id', userAuth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const friend = await User.findById(req.params.id);

  if (!user || !friend) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (!user.friends.includes(friend._id)) {
    return res.status(400).json({ message: 'This user is not your friend.' });
  }

  user.friends.pull(friend._id);
  friend.friends.pull(user._id);

  await user.save();
  await friend.save();

  res.status(200).json({ message: 'Friend removed successfully.' });
});

// 🔹 List Friends
router.get('/list', userAuth, async (req, res) => {
  const user = await User.findById(req.user._id).populate('friends', 'username firstName lastName avatar');

  res.status(200).json({ friends: user.friends });
});

//user/friends/explore?page=1&limit=10
router.get('/explore', userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const currentUser = await User.findById(req.user._id).select('friends friendRequests');

    const excludeIds = [
      req.user._id,                                 // Yourself
      ...currentUser.friends,                       // Your friends
      ...currentUser.friendRequests                 // Users who sent you requests
    ];

    // Find users you haven't sent a request to yet
    const alreadyRequested = await User.find({
      friendRequests: req.user._id
    }).select('_id');

    const alreadyRequestedIds = alreadyRequested.map(u => u._id);

    excludeIds.push(...alreadyRequestedIds);

    const users = await User.find({ _id: { $nin: excludeIds } })
      .select('username firstName lastName avatar')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ _id: { $nin: excludeIds } });

    res.status(200).json({
      page,
      limit,
      total,
      users
    });
  } catch (err) {
    console.error('Explore Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
