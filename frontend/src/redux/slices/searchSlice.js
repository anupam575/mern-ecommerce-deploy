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
  },
});

export const { setSearchKeyword } = searchSlice.actions;
export default searchSlice.reducer;
