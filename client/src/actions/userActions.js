import axios from 'axios';
import { userRequest, userSuccess, userFail} from '../slices/userSlice';
import { loadUserFail, loadUserRequest, loadUserSuccess } from '../slices/authSlice';
import { toast } from 'react-toastify';
import api from '../config/api';

// Get current user
export const fetchMyProfile = () => async (dispatch) => {
  try {
    dispatch(userRequest());
    const res = await api.get('/user/myprofile', { withCredentials: true });
    dispatch(userSuccess(res.data.user));
  } catch (err) {
    dispatch(userFail(err.response?.data?.message || 'Failed to load profile'));
  }
};

// Update user profile
export const updateProfile = (data) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const res = await api.patch('/user/update', data, { withCredentials: true });
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
    const res = await api.patch('/user/change-password', data, { withCredentials: true });
    toast.success(res.data.message);
  } catch (err) {
    dispatch(userFail(err.response?.data?.message || 'Password change failed'));
    toast.error(err.response?.data?.message || 'Password change failed');
  }
};

// Search users
export const searchUsers = (query) => async () => {
  try {
    const res = await api.get(`/user/search?q=${query}`, { withCredentials: true });
    return res.data; // [{username, avatar, bio}]
  } catch (err) {
    toast.error('Search failed');
    return [];
  }
};

// Get user by username
export const getUserByUsername = (username) => async () => {
  try {
    const res = await api.get(`/user/${username}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    toast.error('User not found');
    return null;
  }
};
export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loadUserRequest());
const res = await api.get('/user/myprofile', { withCredentials: true });
  dispatch(loadUserSuccess(res.data.user));  // → goes to auth slice
    dispatch(userSuccess(res.data.user));    

  } catch (err) {
    const message = err.response?.data?.message || 'Failed to load user';
    dispatch(loadUserFail(message));
  }
};
