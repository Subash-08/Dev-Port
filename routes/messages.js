const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const User = require('../models/user');
const userAuth = require('../middleware/auth');

router.get('/chats', userAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch user with populated friends
    const user = await User.findById(userId).populate('friends', 'username avatar');

    // Get all chats where the user is a participant
    const allChats = await Chat.find({ participants: userId })
      .populate('participants', 'username avatar')
      .sort({ updatedAt: -1 });

    // Prepare response: only chats with friends
    const chatsWithFriends = [];

    for (let chat of allChats) {
      const friend = chat.participants.find(p => p._id.toString() !== userId);
      if (user.friends.some(f => f._id.toString() === friend._id.toString())) {
        const lastMessage = chat.messages[chat.messages.length - 1];
        chatsWithFriends.push({
          friend,
          lastMessage
        });
      }
    }

    res.json({ chats: chatsWithFriends });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

module.exports = router;
