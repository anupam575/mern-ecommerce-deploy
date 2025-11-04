import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

export const getReviews = createAsyncThunk(
  "reviews/getReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/v1/reviews?productId=${productId}`);
      return {
        reviews: data.reviews || [],
        myReviewId: data.myReviewId || null,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

export const addReview = createAsyncThunk(
  "reviews/addReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const { data } = await API.put("/api/v1/review", { productId, rating, comment });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add review");
    }
  }
);

export const removeReview = createAsyncThunk(
  "reviews/removeReview",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(`/api/v1/review?productId=${productId}&id=${reviewId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete review");
    }
  }
);

export const getReviewStats = createAsyncThunk(
  "reviews/getReviewStats",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/v1/reviews/stats?productId=${productId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch review stats");
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    items: [],
    myReviewId: null,
    stats: { total: 0, average: 0, breakdown: {} },
    loading: false,
    error: null,
    fetched: false, // ✅ new: tells UI reviews are fetched once
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.reviews;
        state.myReviewId = action.payload.myReviewId;
        state.fetched = true; // ✅ mark data fetched
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.fetched = true;
      })
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        const review = action.payload.review;
        const index = state.items.findIndex((r) => r._id === review._id);
        if (index !== -1) state.items[index] = review;
        else state.items.push(review);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeReview.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg.reviewId;
        state.items = state.items.filter((r) => r._id !== deletedId);
      })
      .addCase(removeReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getReviewStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default reviewSlice.reducer;
