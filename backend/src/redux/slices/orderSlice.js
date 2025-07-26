import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🛒 CREATE ORDER
export const createOrder = createAsyncThunk(
  "order/create",
  async (orderData, thunkAPI) => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/order/new",
        orderData,
        { withCredentials: true }
      );
      return data.order;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

// 📦 FETCH MY ORDERS
export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/orders/me",
        { withCredentials: true }
      );
      return data.orders;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

// 📄 FETCH SINGLE ORDER
export const fetchOrderDetails = createAsyncThunk(
  "order/fetchDetails",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/order/${id}`,
        { withCredentials: true }
      );
      return data.order;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    myOrders: [],
    orderDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
