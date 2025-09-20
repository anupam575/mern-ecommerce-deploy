// src/features/shipping/shippingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shippingInfo: {
    address: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    phoneNo: '',
  },
};

const shippingSlice = createSlice({
  name: 'shipping',
  initialState,
  reducers: {
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
  },
});

export const { saveShippingInfo } = shippingSlice.actions;

export default shippingSlice.reducer;
