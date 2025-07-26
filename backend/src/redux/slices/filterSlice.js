import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  priceRange: [0, 10000],
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setPriceRange(state, action) {
      state.priceRange = action.payload;
    },
  },
});

export const { setPriceRange } = filterSlice.actions;
export default filterSlice.reducer;
