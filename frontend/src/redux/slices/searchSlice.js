// src/redux/slices/searchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    keyword: "",
  },
  reducers: {
    setSearchKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    clearSearchKeyword: (state) => {
      state.keyword = "";
    },
  },
});

export const { setSearchKeyword, clearSearchKeyword } = searchSlice.actions;
export default searchSlice.reducer;
