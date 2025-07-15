// src/pages/More.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../actions/authActions';
import { useNavigate } from 'react-router-dom';
import '../style/Profile.css'

const More = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login'); // redirect to login page after logout
  };

  return (
    <div className="more-container">
      <h2>More Options</h2>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default More;
