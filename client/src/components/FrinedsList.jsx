import React, { useEffect, useState } from 'react';
import api from '../config/api';
import { toast } from 'react-toastify';
import '../style/ExpolreUsers.css';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/friends/list', { withCredentials: true });
      setFriends(res.data.friends || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (friendId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;

    try {
      await api.delete(`/user/friends/remove/${friendId}`, { withCredentials: true });
      toast.success('Friend removed');
      setFriends((prev) => prev.filter((f) => f._id !== friendId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove friend');
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="friends-list-container">
      <h2>Your Friends ({friends.length})</h2>

      {loading ? (
        <p>Loading...</p>
      ) : friends.length === 0 ? (
        <p>You have no friends yet.</p>
      ) : (
        <ul className="friends-list">
          {friends.map((user) => (
            <li key={user._id} className="friend-item">
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.username}
                className="avatar"
              />
              <div className="user-info">
                <p><strong>@{user.username}</strong></p>
                <p>{user.firstName} {user.lastName}</p>
              </div>
              <button
                className="remove-btn"
                onClick={() => handleRemove(user._id)}
              >
                ❌ Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
