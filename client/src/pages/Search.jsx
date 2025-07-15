import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../actions/userActions';
import api from '../config/api';
import '../style/Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ hook

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setResults([]);
      return;
    }

    setLoading(true);
    const data = await searchUsers(value)();
    setResults(data.slice(0, 8)); // limit to 8 for suggestions
    setLoading(false);
  };

  const handleSearchClick = async () => {
    if (query.trim() !== '') {
      setLoading(true);
      const data = await searchUsers(query)();
      setResults(data); // show full result on search
      setLoading(false);
    }
  };

  const goToUserProfile = (username) => {
    navigate(`/user/${username}`); // ✅ Navigate programmatically
  };

  return (
    <div className="search-container">
      <div className="search-input-group">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={handleChange}
          className="search-input"
        />
        <button onClick={handleSearchClick} className="search-button">
          🔍
        </button>
      </div>

      {loading && <div className="search-loading">Searching...</div>}

      {!loading && results.length > 0 && (
        <div className="search-results">
          {results.map((user) => (
            <div
              key={user.username}
              className="search-user-card"
              onClick={() => goToUserProfile(user.username)}
            >
              <img
                src={
                  user.avatar?.startsWith('/uploads')
                    ? `${api.defaults.baseURL}${user.avatar}`
                    : user.avatar || `${api.defaults.baseURL}/uploads/profile.jpg`
                }
                alt="avatar"
                className="search-avatar"
              />
              <div className="user-info">
                <p className="username">@{user.username}</p>
                <p className="bio">{user.bio}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <p className="no-results">No users found.</p>
      )}
    </div>
  );
};

export default Search;
