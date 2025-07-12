import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

export const appStore = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

export default appStore;