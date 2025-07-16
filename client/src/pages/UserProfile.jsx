import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserByUsername } from '../actions/userActions';
import Loader from '../components/Loader';
import api from '../config/api';
import { useSelector } from 'react-redux';
import '../style/Profile.css';
import { toast } from 'react-toastify';


const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.user);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [friendStatus, setFriendStatus] = useState('');
  const [friendsList, setFriendsList] = useState([]);
const { loaded } = useSelector((state) => state.auth);

  useEffect(() => {
  if (!loaded) return;
    if (profile && username === profile.username) {
      navigate('/profile');
      return;
    }

    (async () => {
      try {
        const userData = await getUserByUsername(username)();
        setUser(userData);

        const res = await api.get(`/user/posts/${userData._id}`);
        setPosts(res.data);
        
const statusRes = await api.get(`/user/friends/status/${userData._id}`);
setFriendStatus(statusRes.data.status || 'not_friends');


        const friendListRes = await api.get(`/user/friends/list/${userData._id}`);
        setFriendsList(friendListRes.data.friends || []);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [username, profile, navigate]);

const handleSendRequest = async () => {
  try {
    const res = await api.post(`/user/friends/request/${user._id}`, {}, { withCredentials: true });
    setFriendStatus('pending');
    toast.success(res.data.message || 'Friend request sent.');
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to send friend request.';
    toast.error(message);

    // Set friendStatus only if request already sent
    if (message.toLowerCase().includes('already')) {
      setFriendStatus('pending');
    }
  }
};

const handleAcceptRequest = async () => {
  try {
    const res = await api.put(`/user/friends/accept/${user._id}`, {}, { withCredentials: true });
    toast.success(res.data.message || 'Friend added');
    setFriendStatus('friends');
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to accept friend request.';
    toast.error(message);
  }
};

const handleRejectRequest = async () => {
  try {
    const res = await api.delete(`/user/friends/reject/${user._id}`, { withCredentials: true });
    toast.success(res.data.message || 'Friend request rejected');
    setFriendStatus('not_friends');
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to reject friend request.';
    toast.error(message);
  }
};

 
console.log('profile:', profile);
if (!loaded) return <Loader />;


  if (loading) return <Loader />;
  if (!user) return <p>User not found</p>;

  return (
    <div className="insta-profile-container">
      <div className="profile-header">
        <img
          src={
            user.avatar?.startsWith('/uploads')
              ? `${api.defaults.baseURL}${user.avatar}`
              : user.avatar || `${api.defaults.baseURL}/uploads/profile.jpg`
          }
          alt="avatar"
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2>@{user.username}</h2>
          <p className="bio">{user.bio}</p>

         {profile && user && profile._id !== user._id && (
  <div className="friend-status-btn">
    {friendStatus === 'friends' && <button disabled>✔️ Friends</button>}
    {friendStatus === 'pending' && <button disabled>⏳ Pending</button>}
    {friendStatus === 'not_friends' && (
      <button onClick={handleSendRequest}>➕ Add Friend</button>
    )}
 {friendStatus === 'received' && (
  <div className="friend-status-actions">
    <button onClick={handleAcceptRequest}>✅ Accept</button>
    <button onClick={handleRejectRequest}>❌ Reject</button>
  </div>
)}

  </div>
)}



        </div>
      </div>

      <div className="profile-tabs">
        <button onClick={() => setActiveTab('posts')} className={activeTab === 'posts' ? 'active' : ''}>Posts</button>
        <button onClick={() => setActiveTab('friends')} className={activeTab === 'friends' ? 'active' : ''}>Friends {friendsList.length}</button>
      </div>

      {activeTab === 'posts' ? (
        <div className="my-posts-section">
  <div className="post-grid">
    {posts.length > 0 ? (
      posts.map((post) => (
        <div
          key={post._id}
          className="post-card"
          onClick={() => navigate(`/user/posts/${user._id}/${post._id}`)}
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
      ))
    ) : (
      <p style={{ textAlign: 'center', marginTop: '2rem' }}>No posts yet.</p>
    )}
  </div>
</div>

      ) : (
        <div className="friend-list-section">
          {friendsList.length > 0 ? (
            <ul className="friend-list">
              {friendsList.map((f) => (
                <li key={f._id}>@{f.username}</li>
              ))}
            </ul>
          ) : (
            <p>No friends yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
