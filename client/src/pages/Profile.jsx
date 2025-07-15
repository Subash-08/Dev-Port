import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMyProfile,
  updateProfile,
  changePassword,
} from '../actions/userActions';
import '../style/Profile.css';
import Loader from '../components/Loader';
import api from '../config/api';
import { fetchMyPosts } from '../actions/postActions';
import FriendsList from "../components/FrinedsList";
import FriendRequests from "../components/FriendRequests";
import MyPostGrid from "../components/MyPostGrid";

const Profile = () => {
  const dispatch = useDispatch();

  const { profile, loading } = useSelector((state) => state.user);
  const { myPosts } = useSelector((state) => state.posts);
  const [postsLoading, setPostsLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [friends, setFriends] = useState([]);
  const [view, setView] = useState('posts'); // 'posts', 'friends', 'requests', 'edit'

  useEffect(() => {
    dispatch(fetchMyProfile());
    fetchFriendsList();

    (async () => {
      setPostsLoading(true);
      await dispatch(fetchMyPosts());
      setPostsLoading(false);
    })();
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setAvatarPreview(
        profile.avatar?.startsWith('/uploads')
          ? `${api.defaults.baseURL}${profile.avatar}`
          : profile.avatar || `${api.defaults.baseURL}/uploads/profile.jpg`
      );
    }
  }, [profile]);

  const fetchFriendsList = async () => {
    try {
      const res = await api.get('/user/friends/list', { withCredentials: true });
      setFriends(res.data.friends || []);
    } catch (err) {
      console.error('Failed to fetch friends:', err);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('bio', bio);
    if (avatarFile) formData.append('avatar', avatarFile);

    dispatch(updateProfile(formData)).then(() => {
      dispatch(fetchMyProfile());
      setEditMode(false);
      setView('posts');
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    dispatch(changePassword({ oldPassword: password, newPassword }));
    setPassword('');
    setNewPassword('');
  };

  if (loading && !profile) return <Loader />;

  return profile ? (
    <div className="insta-profile-container">
      <div className="profile-header">
        <img src={avatarPreview} alt="avatar" className="profile-avatar" />
        <div className="profile-info">
          <h2>{profile.username}</h2>
          {view !== 'edit' && <p className="bio">{profile.bio}</p>}
        </div>
        <button
          onClick={() => {
            setEditMode(true);
            setView('edit');
          }}
          className={view === 'edit' ? 'active-btn' : ''}
        >
          ✏️ Edit Profile
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="friend-buttons">
                <button
          onClick={() => setView('posts')}
          className={view === 'posts' ? 'active-btn' : ''}
        >
          🖼️ My Posts
        </button>
        <button
          onClick={() => setView('requests')}
          className={view === 'requests' ? 'active-btn' : ''}
        >
          📨 Friend Requests
        </button>
        <button
          onClick={() => setView('friends')}
          className={view === 'friends' ? 'active-btn' : ''}
        >
          👥 Friends ({friends.length})
        </button>

        
      </div>

      {/* Content Switcher */}
      {view === 'posts' && (
        postsLoading ? (
          <Loader />
        ) : (
          <>
            <h3
              style={{
                position: 'sticky',
                top: '160px',
                backgroundColor: 'white',
                zIndex: '10000',
                padding: '10px',
              }}
            >
              Your Posts
            </h3>
            <MyPostGrid posts={myPosts} />
          </>
        )
      )}

      {view === 'friends' && <FriendsList />}
      {view === 'requests' && <FriendRequests />}

      {view === 'edit' && editMode && (
        <div className="edit-section">
          <form onSubmit={handleProfileUpdate}>
            <h3>Edit Profile</h3>
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label>Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            <label>Change Avatar</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            <button type="submit">Save Changes</button>
          </form>

          <form onSubmit={handleChangePassword}>
            <h3>Change Password</h3>
            <label>Current Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="green">Change Password</button>
          </form>
        </div>
      )}
    </div>
  ) : null;
};

export default Profile;
