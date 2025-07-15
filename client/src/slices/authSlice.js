import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  loaded: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Register & Login - Start
    authRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Register & Login - Success
    authSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    // Register & Login - Fail
    authFail: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    // Load User - Start
    loadUserRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.loaded = false; // ← we're starting load
    },
    loadUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loaded = true; // ← load complete
    },
    loadUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loaded = true; // ← even failed, still done
    },

  },
});

export const {
  authRequest,
  authSuccess,
  authFail,
  logout,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
} = authSlice.actions;

export default authSlice.reducer;
