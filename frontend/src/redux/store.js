// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import productReducer from "./slices/productSlice";

import authReducer from "./slices/authSlice";

import searchReducer from "./slices/searchSlice";
import shippingReducer from "./slices/shippingSlice";
import suggestionsReducer from "./slices/suggestionsSlice";
import cartReducer from "./slices/cartSlice";
import reviewReducer from "./slices/reviewSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  search: searchReducer,
  shipping: shippingReducer,
      reviews: reviewReducer, // 🟢 name "reviews" hona chahiye
  product: productReducer,

          suggestions: suggestionsReducer, // ✅ ye hona chahiye



});
// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "shipping",  ], // 👈 add reducers to persist
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
