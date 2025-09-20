import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    stats: { average: 0, total: 0, breakdown: {} },
    loading: false,
  },
  reducers: {
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearReviews: (state) => {
      state.reviews = [];
      state.stats = { average: 0, total: 0, breakdown: {} };
    },
  },
});

export const { setReviews, setStats, setLoading, clearReviews } =
  reviewSlice.actions;

export default reviewSlice.reducer;
