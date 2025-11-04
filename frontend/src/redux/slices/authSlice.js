import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false, // ✅ clearly defined
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;   // ✅ login ke time true
      state.error = null;
      state.loading = false;
    },
    setFetchedUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload; // ✅ safe check
      state.error = null;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;  // ✅ logout ke time false
      state.error = null;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, setFetchedUser, clearUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
