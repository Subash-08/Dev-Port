// src/slices/postSlice.js
import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    myPosts: [],
    loading: false,
    error: null,
  },
  reducers: {
    myPostsRequest: (state) => {
      state.loading = true;
    },
    myPostsSuccess: (state, action) => {
      state.loading = false;
      state.myPosts = action.payload;
    },
    myPostsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  myPostsRequest,
  myPostsSuccess,
  myPostsFail,
} = postSlice.actions;

export default postSlice.reducer;
