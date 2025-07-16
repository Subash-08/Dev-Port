import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '../config/api';
import Loader from '../components/Loader';
import '../style/Feed.css';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleComments, setVisibleComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [firstLoadDone, setFirstLoadDone] = useState(false);
  const observer = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts(); // Initial fetch only once
    }
  }, []);

 const fetchPosts = async () => {
  setLoading(true);

  const currentSkip = skip; // use current skip directly
  try {
    const res = await api.get(`/user/posts/feed?skip=${currentSkip}&limit=10&showOld=true`, {
      withCredentials: true,
    });

    if (res.data.length === 0) {
      setHasMore(false);
    } else {
      const likesState = {};
      res.data.forEach((p) => {
        likesState[p._id] = p.likes?.some((like) => like._id === p.author._id);
      });

      setLikedPosts((prev) => ({ ...prev, ...likesState }));

      setPosts((prev) => {
        const combined = [...prev, ...res.data];
        const uniqueMap = new Map();
        combined.forEach((p) => uniqueMap.set(p._id, p));
        return Array.from(uniqueMap.values()).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      });

      setSkip(currentSkip + 10); // update after successful fetch
    }

    if (!firstLoadDone) setFirstLoadDone(true);
  } catch (err) {
    console.error('Feed error:', err);
  } finally {
    setLoading(false);
  }
};


  const observeLastPost = useCallback(
    (node) => {
      if (loading || !hasMore || !firstLoadDone) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, firstLoadDone]
  );

  const handleLike = async (postId) => {
    try {
      const res = await api.put(`/user/posts/${postId}/like`, {}, { withCredentials: true });
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, likes: res.data.likes } : post
        )
      );
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  const toggleComments = (postId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = async (postId) => {
    const text = newComments[postId];
    if (!text?.trim()) return;

    try {
      await api.post(`/user/posts/${postId}/comment`, { text });

      const authorId = posts.find((p) => p._id === postId)?.author?._id;
      const res = await api.get(`/user/posts/${authorId}/${postId}`);
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data : p))
      );
      setNewComments((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Failed to comment', err);
    }
  };

  const getRelativeTime = (dateString) => {
    const diff = Date.now() - new Date(dateString);
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="feed-container">
      {posts.length === 0 && !loading ? (
        <p className="no-posts-message">Your friends haven't posted anything yet.</p>
      ) : (
        posts.map((post, index) => {
          const isTriggerPoint = index === posts.length - 6;

          return (
            <div
              key={post._id}
              ref={isTriggerPoint ? observeLastPost : null}
              className="post-details-card"
            >
              <div
                className="post-author-info"
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => navigate(`/user/${post.author.username}`)}
              >
                <img
                  src={
                    post.author.avatar?.startsWith('/uploads')
                      ? `${api.defaults.baseURL}${post.author.avatar}`
                      : post.author.avatar || `${api.defaults.baseURL}/uploads/profile.jpg`
                  }
                  alt="author"
                  className="avatar"
                />
                <h3>@{post.author.username}</h3>
              </div>

              {post.image ? (
                <div>
                  <img
                    src={
                      post.image.startsWith('/uploads')
                        ? `${api.defaults.baseURL}${post.image}`
                        : post.image
                    }
                    alt="post"
                    className="post-image-large"
                  />
                  {post.caption && (
                    <p className="post-image-caption">{post.caption}</p>
                  )}
                </div>
              ) : (
                <div className="post-text-box-large">
                  <p>{post.caption || post.text || 'No content'}</p>
                </div>
              )}

              <div className="post-actions">
                <div className="post-actions-div">
                  <button
                    onClick={() => handleLike(post._id)}
                    style={{
                      fontSize: '16px',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      color: likedPosts[post._id] ? 'red' : 'black',
                    }}
                  >
                    {likedPosts[post._id] ? '❤️ Like' : '🤍 Like'}
                  </button>
                  <p style={{ cursor: 'pointer' }} onClick={() => toggleComments(post._id)}>
                    {post.likes?.length || 0}{' '}
                    {post.likes?.length === 1 ? 'like' : 'likes'}
                  </p>
                </div>

                <div className="post-actions-div">
                  <button onClick={() => toggleComments(post._id)}>
                    💬 {post.comments?.length || 0}{' '}
                    {post.comments?.length === 1 ? 'comment' : 'comments'}
                  </button>
                </div>

                <div className="post-actions-div">
                  <button className="share-btn">🔗 Share</button>
                </div>
              </div>

              <div className="post-meta">
                <p>🕒 {getRelativeTime(post.createdAt)}</p>
              </div>

              {visibleComments[post._id] && (
                <div className="comments-section">
                  {post.comments?.length > 0 ? (
                    <ul className="comments-list">
                      {post.comments.map((c, i) => (
                        <li key={i}>
                          <strong>@{c.user.username}:</strong> {c.text}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No comments yet</p>
                  )}

                  <div className="add-comment">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComments[post._id] || ''}
                      onChange={(e) =>
                        setNewComments((prev) => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                      className="comment-input"
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className="comment-btn"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      {loading && <Loader />}
      {!hasMore && posts.length > 0 && (
        <div className="end-message">🎉 You're all caught up!</div>
      )}
    </div>
  );
};

export default Feed;
