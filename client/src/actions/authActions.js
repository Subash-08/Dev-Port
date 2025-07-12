import axios from 'axios';
import { authRequest, authSuccess, authFail, logout } from '../slices/authSlice';
import api from '../config/api';


// Register
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(authRequest());
    const res = await api.post('/api/auth/register', userData, { withCredentials: true });
    dispatch(authSuccess(res.data));
  } catch (error) {
    dispatch(authFail(error.response?.data?.message || 'Something went wrong'));
  }
};

// Login
export const loginUser = (userData) => async (dispatch) => {
  try {
    dispatch(authRequest());
    const res = await api.post('/api/auth/login', userData, { withCredentials: true });
    dispatch(authSuccess(res.data));
  } catch (error) {
    dispatch(authFail(error.response?.data?.message || 'Invalid credentials'));
  }
};

// Logout
export const logoutUser = () => async (dispatch) => {
  try {
    await api.post('/api/auth/logout', {}, { withCredentials: true });
    dispatch(logout());
  } catch (error) {
    console.error('Logout failed', error.message);
  }
};
