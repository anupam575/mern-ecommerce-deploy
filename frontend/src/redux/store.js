// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import searchReducer from "./slices/searchSlice";
import shippingReducer from "./slices/shippingSlice";
import productReducer from "./slices/productSlice";
import reviewReducer from "./slices/reviewSlice";
import suggestionsReducer from "./slices/suggestionsSlice";

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  search: searchReducer,
  shipping: shippingReducer,
    product: productReducer, // 👈 lowercase
      review: reviewReducer, // 👈 add this
          suggestions: suggestionsReducer, // ✅ ye hona chahiye



});
// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth", "shipping"], // 👈 add reducers to persist
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

// Persistor
export const persistor = persistStore(store);
