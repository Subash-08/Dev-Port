import axios from 'axios';
import { userRequest, userSuccess, userFail } from '../slices/userSlice';
import { toast } from 'react-toastify';

// Get current user
export const fetchMyProfile = () => async (dispatch) => {
  try {
    dispatch(userRequest());
    const res = await axios.get('/api/user/myProfile', { withCredentials: true });
    dispatch(userSuccess(res.data));
  } catch (err) {
    dispatch(userFail(err.response?.data?.message || 'Failed to fetch profile'));
  }
};

// Update user profile
export const updateProfile = (data) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const res = await axios.patch('/api/user/update', data, { withCredentials: true });
    dispatch(userSuccess(res.data.user));
    toast.success(res.data.message);
  } catch (err) {
    dispatch(userFail(err.response?.data?.message || 'Update failed'));
    toast.error(err.response?.data?.message || 'Update failed');
  }
};

// Change password
export const changePassword = (data) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const res = await axios.patch('/api/user/change-password', data, { withCredentials: true });
    toast.success(res.data.message);
  } catch (err) {
    dispatch(userFail(err.response?.data?.message || 'Password change failed'));
    toast.error(err.response?.data?.message || 'Password change failed');
  }
};

// Search users
export const searchUsers = (query) => async () => {
  try {
    const res = await axios.get(`/api/user/search?q=${query}`, { withCredentials: true });
    return res.data; // [{username, avatar, bio}]
  } catch (err) {
    toast.error('Search failed');
    return [];
  }
};

// Get user by username
export const getUserByUsername = (username) => async () => {
  try {
    const res = await axios.get(`/api/user/${username}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    toast.error('User not found');
    return null;
  }
};
