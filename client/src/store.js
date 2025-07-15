import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import postReducer from './slices/postSlice'

export const appStore = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
     posts: postReducer,
  },
});

export default appStore;