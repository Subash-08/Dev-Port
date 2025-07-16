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
      // console.log(state);
      
    },
    userFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearUser: (state) => {
      state.profile = null;
      state.error = null;
    },
      // 🔽 New loadUser-specific reducers
  
  },
});

export const { userRequest, userSuccess, userFail, clearUser} = userSlice.actions;
export default userSlice.reducer;
