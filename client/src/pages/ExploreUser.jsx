import React, { useEffect, useState } from 'react';
import api from '../config/api';
import { toast } from 'react-toastify';
import "../style/ExpolreUsers.css"
import { useNavigate } from 'react-router-dom';

const ExploreUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
const navigate  =useNavigate();
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/user/friends/explore?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSendRequest = async (userId) => {
    try {
      await api.post(`/user/friends/request/${userId}`, {}, { withCredentials: true });
      toast.success('Friend request sent!');
      fetchUsers(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="explore-users-container">
      <h2>Explore Users</h2>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No new users to explore.</p>
      ) : (
        <ul className="explore-users-list">
          {users.map((user) => (
            <li key={user._id} className="explore-user-item" onClick={()=>{navigate(`/user/${user.username}`)}}>
              <div className="user-info">
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt={user.username}
                  className="avatar"
                />
                <div>
                  <p><strong>@{user.username}</strong></p>
                  <p>{user.firstName} {user.lastName}</p>
                </div>
              </div>
              <button onClick={() => handleSendRequest(user._id)}>Add Friend</button>
            </li>
          ))}
        </ul>
      )}

     
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default ExploreUsers;
