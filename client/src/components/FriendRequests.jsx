import React, { useEffect, useState } from 'react';
import api from '../config/api';
import { toast } from 'react-toastify';
import '../style/ExpolreUsers.css';

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/friends/requests', { withCredentials: true });
      setRequests(res.data.requests || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.delete(`/user/friends/reject/${id}`, { withCredentials: true });
      toast.success('Request rejected');
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject request');
    }
  };

  const handleAccept = async (id) => {
    try {
      await api.put(`/user/friends/accept/${id}`, {}, { withCredentials: true });
      toast.success('Friend request accepted');
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept request');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="friend-requests-container">
      <h2>Friend Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No friend requests.</p>
      ) : (
        <ul className="friend-request-list">
          {requests.map((user) => (
            <li key={user._id} className="request-item">
              <div className="user-info">
                <img
                  src={user.avatar || '/profile.jpg'}
                  alt={user.username}
                  className="avatar"
                />
                <div>
                  <p><strong>@{user.username}</strong></p>
                  <p>{user.firstName} {user.lastName}</p>
                </div>
              </div>

              <div className="action-buttons">
                <button className="accept-btn" onClick={() => handleAccept(user._id)}>
                  ✅ Accept
                </button>
                <button className="reject-btn" onClick={() => handleReject(user._id)}>
                  ❌ Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequests;
