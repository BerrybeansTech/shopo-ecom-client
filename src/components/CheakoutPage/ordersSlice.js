// src/features/order/ordersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersApi } from './ordersApi';

export const fetchCustomerOrders = createAsyncThunk(
  'orders/fetchCustomerOrders',
  async ({ customerId, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await ordersApi.getCustomerOrders(customerId, filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersApi.getOrderById(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersApi.cancelOrder(orderId);
      return { orderId, response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    filters: {
      status: '',
      page: 1,
      limit: 10
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        order.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customer Orders
      .addCase(fetchCustomerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data || [];
      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Cancel Order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const { orderId } = action.payload;
        const order = state.orders.find(order => order.id === orderId);
        if (order) {
          order.status = 'cancelled';
        }
      });
  }
});

export const {
  clearError,
  clearCurrentOrder,
  setFilters,
  updateOrderStatus
} = ordersSlice.actions;

export default ordersSlice.reducer;