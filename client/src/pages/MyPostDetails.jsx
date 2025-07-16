import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../config/api';
import Loader from '../components/Loader';
import '../style/PostDetails.css';
import { useSelector } from 'react-redux'; // Add this



const MyPostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.user); // Add inside component
  const [liked, setLiked] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const toggleLikes = () => setShowLikes(!showLikes);
  const toggleComments = () => setShowComments(!showComments);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/user/posts/myProfile/post/${postId}`, {
          withCredentials: true,
        });
        const fetchedPost = res.data;
        setPost(fetchedPost);

        // ✅ Check if user liked the post
        const userHasLiked = fetchedPost.likes?.some(
          (u) => u._id === user?._id
        );
        setLiked(userHasLiked);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [postId, user]);

  const handleLike = async () => {
    try {
      const res = await api.put(`user/posts/${postId}/like`, {}, { withCredentials: true });
      const updatedLikes = res.data.likes;

      setPost((prev) => ({
        ...prev,
        likes: updatedLikes,
      }));

      // ✅ Re-check if user is in updated likes
      const userHasLiked = updatedLikes.some((u) => u._id === user._id);
      setLiked(userHasLiked);
    } catch (error) {
      console.error('Failed to like/unlike post', error);
    }
  };




  if (loading) return <Loader />;
  if (!post) return <p>Post not found</p>;
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const posted = new Date(timestamp);
    const seconds = Math.floor((now - posted) / 1000);

    const intervals = [
      { label: 'year', secs: 31536000 },
      { label: 'month', secs: 2592000 },
      { label: 'week', secs: 604800 },
      { label: 'day', secs: 86400 },
      { label: 'hour', secs: 3600 },
      { label: 'minute', secs: 60 },
      { label: 'second', secs: 1 },
    ];

    for (const { label, secs } of intervals) {
      const count = Math.floor(seconds / secs);
      if (count > 0) {
        return `${count} ${label}${count > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  };


  return (
    <div className="post-details-container">
      <div className="post-details-card">
        {post.image ? (
          <div>
             {post.caption && (
              <p className="post-image-caption">{post.caption}</p>
            )}
            <img
              src={
                post.image.startsWith('/uploads')
                  ? `${api.defaults.baseURL}${post.image}`
                  : post.image
              }
              alt="post"
              className="post-image-large"
            />

           
          </div>



        ) : (
          <div className="post-text-box-large">
            <p>{post.caption || post.text}</p>
          </div>
        )}




        <div className="post-actions">
          <div className='post-actions-div'>
            <button
              onClick={handleLike}
              style={{
                fontSize: '16px',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                color: liked ? 'red' : 'black',
              }}
            >
              {liked ? '❤️ Like' : '🤍 Like'}
            </button>



            <p style={{ cursor: 'pointer' }} onClick={toggleLikes}>
              {post.likes?.length || 0} {post.likes?.length === 1 ? 'like' : 'likes'}
            </p>
          </div>

          <div className='post-actions-div'>
            <button onClick={toggleComments}>
              💬 {post.comments?.length || 0} {post.comments?.length === 1 ? 'comment' : 'comments'}
            </button>
          </div>

          <div className='post-actions-div'>
            <button className="share-btn">
              🔗 Share
            </button>
          </div>
        </div>

        <div className="post-meta">
          <p>🕒 {getRelativeTime(post.createdAt)}</p>
        </div>


    
        {showLikes && post.likes?.length > 0 && (
          <div className="likes-list">
            <p>Liked by:</p>
            <ul>
              {post.likes.map((u) => (
                <li key={u._id}>@{u.username}</li>
              ))}
            </ul>
          </div>
        )}

        {showComments && (
          post.comments?.length > 0 ? (
            <div className="comments-list">
              <p>Comments:</p>
              <ul>
                {post.comments.map((c, idx) => (
                  <li key={idx}>
                    <strong>@{c.user.username}:</strong> {c.text}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No comments</p>
          )
        )}

      </div>

    </div>
  );
};

export default MyPostDetails;
