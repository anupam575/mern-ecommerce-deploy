import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

// 🔹 Fetch user's cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🟡 Fetching cart from API...");
      const { data } = await API.get("/api/v1/cart");
      console.log("🟢 Cart fetched successfully:", data);
      // backend populated items
      return data.items || data;
    } catch (error) {
      console.error("🔴 Error fetching cart:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 Add item to cart
export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/api/v1/cart", { productId, quantity });
      console.log("🟢 Added to cart successfully:", data);
      return data.items || data;
    } catch (error) {
      console.error("🔴 Error adding cart item:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 Update item quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await API.put("/api/v1/cart/update", { cartItemId, quantity });
      console.log("🟢 Updated cart item successfully:", data);
      return data.items || data;
    } catch (error) {
      console.error("🔴 Error updating cart item:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 Remove item from cart
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(`/api/v1/cart/${id}`);
      console.log("🟢 Removed cart item successfully:", data);
      return data.items || data;
    } catch (error) {
      console.error("🔴 Error removing cart item:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], status: "idle", error: null },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.status = "loading"; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addCartItem.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(updateCartItem.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(removeCartItem.fulfilled, (state, action) => { state.items = action.payload; });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;

