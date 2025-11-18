// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from './cartApi';
import { storage } from '../../utils/storage';

const isAuthenticated = () => {
  return storage.isAuthenticated();
};

// Async thunks
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Please login to view your cart');
      }
      const response = await cartApi.getAllItems();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartData, { rejectWithValue, dispatch }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Please login to add items to cart');
      }
      const response = await cartApi.addToCart(cartData);
      dispatch(fetchCartItems());
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, updateData }, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Please login to update cart');
      }
      const response = await cartApi.updateItem(itemId, updateData);
      return { itemId, updateData, response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async (itemId, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Please login to remove items from cart');
      }
      const response = await cartApi.deleteItem(itemId);
      return { itemId, response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Please login to clear cart');
      }
      
      let response;
      try {
        response = await cartApi.clearCart();
      } catch (error) {
        response = await cartApi.clearCartByItems();
      }
      
      return { response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    savedItems: [],
    loading: false,
    error: null,
    subtotal: 0,
    discount: 0,
    total: 0,
    isAuthenticated: false,
    orderCompleted: false,
    updatingItems: {},
    deletingItems: {},
    addingToCart: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    moveToSaved: (state, action) => {
      const itemId = action.payload;
      const item = state.items.find(item => item.id === itemId);
      if (item) {
        state.items = state.items.filter(item => item.id !== itemId);
        state.savedItems.push({ ...item, savedAt: new Date().toISOString() });
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    moveToCart: (state, action) => {
      const itemId = action.payload;
      const item = state.savedItems.find(item => item.id === itemId);
      if (item) {
        state.savedItems = state.savedItems.filter(item => item.id !== itemId);
        const { savedAt, ...cartItem } = item;
        state.items.push(cartItem);
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    removeFromSaved: (state, action) => {
      const itemId = action.payload;
      state.savedItems = state.savedItems.filter(item => item.id !== itemId);
    },
    updateLocalQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      if (item && quantity > 0) {
        item.quantity = quantity;
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    calculateTotals: (state) => {
      state.subtotal = state.items.reduce((total, item) => {
        const price = item.price || item.product?.sellingPrice || 0;
        return total + (price * item.quantity);
      }, 0);
      
      state.discount = state.items.reduce((total, item) => {
        const originalPrice = item.product?.mrp || item.price || 0;
        const sellingPrice = item.price || item.product?.sellingPrice || 0;
        return total + Math.max(0, (originalPrice - sellingPrice) * item.quantity);
      }, 0);
      
      state.total = state.subtotal + 7;
    },
    setAuthStatus: (state, action) => {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.items = [];
        state.savedItems = [];
        state.subtotal = 0;
        state.discount = 0;
        state.total = 0;
        state.error = null;
        state.orderCompleted = false;
      }
    },
    clearCartState: (state) => {
      state.items = [];
      state.savedItems = [];
      state.subtotal = 0;
      state.discount = 0;
      state.total = 0;
      state.error = null;
      state.loading = false;
      state.orderCompleted = true;
      state.updatingItems = {};
      state.deletingItems = {};
      state.addingToCart = false;
    },
    resetOrderCompleted: (state) => {
      state.orderCompleted = false;
    },
    setUpdatingItem: (state, action) => {
      const { itemId, updating } = action.payload;
      if (updating) {
        state.updatingItems[itemId] = true;
      } else {
        delete state.updatingItems[itemId];
      }
    },
    setDeletingItem: (state, action) => {
      const { itemId, deleting } = action.payload;
      if (deleting) {
        state.deletingItems[itemId] = true;
      } else {
        delete state.deletingItems[itemId];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart Items
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data || [];
        state.isAuthenticated = true;
        state.orderCompleted = false;
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.items = [];
      })
      
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.addingToCart = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.addingToCart = false;
        state.isAuthenticated = true;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addingToCart = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Update Cart Item
      .addCase(updateCartItem.pending, (state, action) => {
        const { itemId } = action.meta.arg;
        state.updatingItems[itemId] = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { itemId, updateData } = action.payload;
        delete state.updatingItems[itemId];
        
        const item = state.items.find(item => item.id === itemId);
        if (item) {
          Object.assign(item, updateData);
        }
        state.isAuthenticated = true;
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        const { itemId } = action.meta.arg;
        delete state.updatingItems[itemId];
        state.error = action.payload;
        state.isAuthenticated = false;
        cartSlice.caseReducers.calculateTotals(state);
      })
      
      // Delete Cart Item
      .addCase(deleteCartItem.pending, (state, action) => {
        const itemId = action.meta.arg;
        state.deletingItems[itemId] = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        const { itemId } = action.payload;
        delete state.deletingItems[itemId];
        state.items = state.items.filter(item => item.id !== itemId);
        state.isAuthenticated = true;
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        const itemId = action.meta.arg;
        delete state.deletingItems[itemId];
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.isAuthenticated = true;
        state.orderCompleted = true;
        state.subtotal = 0;
        state.discount = 0;
        state.total = 0;
        state.updatingItems = {};
        state.deletingItems = {};
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  }
});

export const {
  clearError,
  moveToSaved,
  moveToCart,
  removeFromSaved,
  updateLocalQuantity,
  calculateTotals,
  setAuthStatus,
  clearCartState,
  resetOrderCompleted,
  setUpdatingItem,
  setDeletingItem
} = cartSlice.actions;

export default cartSlice.reducer;