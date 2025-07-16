import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../config/api';
import Loader from '../components/Loader';
import '../style/PostDetails.css';

const ViewUserPost = () => {
    const { userId, postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [showLikes, setShowLikes] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    const navigate = useNavigate()
    // Get post data
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get(`/user/posts/${userId}/${postId}`);
                setPost(res.data);
                setLiked(res.data.likes?.some((like) => like._id === userId)); // optional check
            } catch (err) {
                console.error('Failed to load post:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [userId, postId]);

    // Handle like button
    const handleLike = async () => {
        try {
            const res = await api.put(`/user/posts/${postId}/like`); // assumes POST /posts/:id/like
            setPost((prev) => ({ ...prev, likes: res.data.likes }));
            setLiked(!liked);
        } catch (err) {
            console.error('Failed to toggle like:', err);
        }
    };

    // Helper for relative time
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

    const toggleLikes = () => setShowLikes(!showLikes);
    const toggleComments = () => setShowComments(!showComments);


    if (loading) return <Loader />;
    if (!post) return <p>Post not found</p>;
    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            await api.post(`/user/posts/${postId}/comment`, { text: newComment });

            // Re-fetch post to get updated comments with usernames
            const res = await api.get(`/user/posts/${userId}/${postId}`);
            setPost(res.data);
            setNewComment('');
        } catch (err) {
            console.error('Failed to add comment:', err);
        }
    };


    return (
        <div className="post-details-container">

            <div className="post-details-card">
      
                <div className="post-author-info" style={{ display: "flex", alignItems: "center" }} onClick={() => { navigate(`/user/${post.author.username}`) }}>
                    <img
                        src={
                            post.author?.avatar?.startsWith('/uploads')
                                ? `${api.defaults.baseURL}${post.author.avatar}`
                                : post.author?.avatar || `${api.defaults.baseURL}/uploads/profile.jpg`
                        }
                        alt="author"
                        className="avatar"
                    />
                    <h3>@{post.author?.username}</h3>
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
                            {post.likes?.length || 0}{' '}
                            {post.likes?.length === 1 ? 'like' : 'likes'}
                        </p>
                    </div>

                    <div className="post-actions-div">
                        <button onClick={toggleComments}>
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

                {showComments &&
                    (post.comments?.length > 0 ? (
                        <div className="comments-list">
                            <p>Comments:</p>
                            <ul>
                                {post.comments.map((c, idx) => (
                                    <li key={idx}>
                                        <strong>@{c.user.username}:</strong> {c.text}
                                    </li>
                                ))}
                            </ul>
                            <div className="add-comment">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="comment-input"
                                />
                                <button onClick={handleAddComment} className="comment-btn">
                                    Post
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>

                            <p>No comments</p>

                            <div className="add-comment">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="comment-input"
                                />
                                <button onClick={handleAddComment} className="comment-btn">
                                    Post
                                </button>
                            </div>
                        </div>
                    ))}
         


            </div>
        </div>
    );
};

export default ViewUserPost;
