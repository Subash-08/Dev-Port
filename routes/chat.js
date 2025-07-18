const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Chat = require('../models/chat');
const userAuth = require('../middleware/auth');

// Middleware: ensure user is authenticated
// req.user._id should be available via your auth middleware (e.g., JWT)

router.get('/:targetId', userAuth, async (req, res) => {
  const { targetId } = req.params;
  const userId = req.user?._id;

  if (!userId || !mongoose.Types.ObjectId.isValid(targetId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user IDs" });
  }

  try {
    const chat = await Chat.findOne({
      participants: { $all: [targetId, userId], $size: 2 }
    }).populate('messages.senderId', 'username avatar');

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    console.error("Failed to fetch chat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
