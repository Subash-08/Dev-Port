const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // ✅ Needed for ObjectId validation
const Post = require('../models/posts');
const User = require('../models/user');
const userAuth = require('../middleware/auth');
const upload = require('../middleware/upload');

// ----------------------- POST CREATION -----------------------
router.post('/post', userAuth, upload.single('image'), async (req, res) => {
  try {
    const { text, caption } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Must include at least text or image
    if (!text && !image) {
      return res.status(400).json({ message: 'Post must include text or image.' });
    }

    const post = await Post.create({
      text,
      image,
      caption,
      author: req.user._id
    });

    const populated = await post.populate('author', 'username avatar');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Post creation error:', err);
    res.status(500).json({ message: 'Server error while creating post.' });
  }
});


// ----------------------- GET  FEED -----------------------
router.get('/feed', userAuth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).select('friends');
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    const friendIds = currentUser.friends;

    const posts = await Post.find({ author: { $in: friendIds } })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar')
      .populate('comments.user', 'username avatar');

    res.status(200).json(posts);
  } catch (err) {
    console.error('Error fetching friends posts:', err);
    res.status(500).json({ message: 'Failed to fetch friends posts' });
  }
});

// ----------------------- GET USER POSTS BY ID -----------------------
router.get('/user/:userId', userAuth, async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar')
      .populate('comments.user', 'username avatar');

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error loading user posts:", err.message);
    res.status(500).json({ message: 'Could not load user posts' });
  }
});

// ----------------------- GET MY POSTS -----------------------
router.get('/my', userAuth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar')
      .populate('comments.user', 'username avatar');

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error loading my posts:", err.message);
    res.status(500).json({ message: 'Could not load your posts' });
  }
});

// ----------------------- LIKE OR UNLIKE A POST -----------------------
router.put('/:id/like', userAuth, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ message: alreadyLiked ? 'Unliked' : 'Liked' });
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).json({ message: 'Error liking post' });
  }
});

// ----------------------- ADD COMMENT -----------------------
router.post('/:id/comment', userAuth, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: 'Comment text is required' });
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: req.user._id, text });
    await post.save();

    res.status(201).json({ message: 'Comment added' });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// ----------------------- GET SINGLE POST BY USER & POST ID -----------------------
router.get('/:userId/:postId', userAuth, async (req, res) => {
  const { userId, postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid user or post ID' });
  }

  try {
    const post = await Post.findOne({ _id: postId, author: userId })
      .populate('author', 'username avatar')
      .populate('comments.user', 'username avatar');

    if (!post) {
      return res.status(404).json({ message: 'Post not found for this user' });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error('Error fetching post by user:', err);
    res.status(500).json({ message: 'Error fetching post' });
  }
});

// ----------------------- DELETE POST -----------------------
router.delete('/delete/:id', userAuth, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const post = await Post.findOneAndDelete({ _id: id, author: req.user._id });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Error deleting post' });
  }
});


module.exports = router;
