// src/redux/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  items: JSON.parse(localStorage.getItem('cartItems')) || [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemWithId = {
        ...action.payload,
        cartId: uuidv4(), // ✅ each added item is unique
        quantity: 1,
      };
      state.items.push(itemWithId);
      localStorage.setItem('cartItems', JSON.stringify(state.items)); // 🔁 persist
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.cartId !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.items)); // 🔁
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(item => item.cartId === action.payload);
      if (item) item.quantity += 1;
      localStorage.setItem('cartItems', JSON.stringify(state.items)); // 🔁
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(item => item.cartId === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(i => i.cartId !== action.payload);
        }
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items)); // 🔁
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems'); // 🧹
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
