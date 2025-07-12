import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    userRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    userSuccess: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    },
    userFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearUser: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
});

export const { userRequest, userSuccess, userFail, clearUser } = userSlice.actions;
export default userSlice.reducer;
