// src/redux/slices/suggestionsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

// 🔹 Async thunk for API call
export const fetchSuggestions = createAsyncThunk(
  "suggestions/fetch",
  async (keyword, { rejectWithValue }) => {
    try {
      if (!keyword.trim()) return []; // safeguard
      const { data } = await API.get(
        `/api/v1/products/suggestions?keyword=${encodeURIComponent(keyword)}`
      );
      return data.suggestions || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch suggestions"
      );
    }
  }
);

const suggestionsSlice = createSlice({
  name: "suggestions",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSuggestions: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSuggestions } = suggestionsSlice.actions;
export default suggestionsSlice.reducer;
