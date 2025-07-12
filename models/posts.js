const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  text: { type: String },
  image: { type: String },
  caption: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  sharedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // for reposts
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
