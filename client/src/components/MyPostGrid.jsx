import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import '../style/Profile.css'; // optional CSS for styling
import Loader from './Loader';

const MyPostGrid = ({ posts }) => {
  const navigate = useNavigate();

  if (!posts || posts.length === 0) {
    return "No posts";
  }

  return (
    <div className="my-posts-section">
      <div className="post-grid">
        {posts.map((post) => (
          <div
            key={post._id}
            className="post-card"
            onClick={() => navigate(`/myProfile/post/${post._id}`)}
            style={{ cursor: 'pointer' }}
          >
            {post.image ? (
              <img
                src={
                  post.image.startsWith('/uploads')
                    ? `${api.defaults.baseURL}${post.image}`
                    : post.image
                }
                alt="post"
                className="post-image"
              />
            ) : (
              <div className="post-text-box">
                <p>{post.caption || post.text || 'No content'}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPostGrid;
