// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import searchReducer from "./slices/searchSlice";
import orderReducer from "./slices/orderSlice";
import cartReducer from "./slices/cartSlice"; // ✅ Cart Slice
import filterReducer from "./slices/filterSlice.js";

// 🔄 LocalStorage se cart data load karne ka helper
const loadCartFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("cartItems");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage", error);
    return [];
  }
};

// 🛒 Preloaded state with cart items (reload fix)
const preloadedState = {
  cart: {
    items: loadCartFromLocalStorage(),
  },
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    order: orderReducer,
    cart: cartReducer,
    filters: filterReducer,
  },
  preloadedState, // ✅ Initial cart data from localStorage
});

// 🧠 Store update hone pe cart ko localStorage me save karo
store.subscribe(() => {
  const { cart } = store.getState();
  try {
    localStorage.setItem("cartItems", JSON.stringify(cart.items));
  } catch (error) {
    console.error("Failed to save cart to localStorage", error);
  }
});

export default store;
