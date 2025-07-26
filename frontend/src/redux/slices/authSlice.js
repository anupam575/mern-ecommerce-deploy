// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// 🔁 localStorage से user check
const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  user: userFromStorage,
  isAuthenticated: !!userFromStorage,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload)); // ✅ Save
    },

    setFetchedUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.error = null;
    },

    setLoading(state) {
      state.loading = true;
    },

    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("user"); // ✅ Remove
    },
  },
});

export const {
  setUser,
  setFetchedUser,
  setLoading,
  setError,
  clearUser
} = authSlice.actions;

export default authSlice.reducer;
