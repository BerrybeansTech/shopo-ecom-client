import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from './cartApi';

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('accessToken');
  }
  return false;
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
      
      // Fetch updated cart to ensure sync with server
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
  async (cartId, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('Please login to clear cart');
      }
      const response = await cartApi.clearCart(cartId);
      return { cartId, response };
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
    lastAction: null,
    subtotal: 0,
    discount: 0,
    total: 0,
    isAuthenticated: false
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
      }
    },
    moveToCart: (state, action) => {
      const itemId = action.payload;
      const item = state.savedItems.find(item => item.id === itemId);
      if (item) {
        state.savedItems = state.savedItems.filter(item => item.id !== itemId);
        const { savedAt, ...cartItem } = item;
        state.items.push(cartItem);
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
      }
      // Recalculate totals after quantity update
      cartSlice.caseReducers.calculateTotals(state);
    },
    calculateTotals: (state) => {
      state.subtotal = state.items.reduce((total, item) => {
        const price = item.product?.sellingPrice || item.discountedPriceValue || 0;
        return total + (price * item.quantity);
      }, 0);
      
      state.discount = state.items.reduce((total, item) => {
        const originalPrice = item.product?.mrp || item.originalPriceValue || 0;
        const sellingPrice = item.product?.sellingPrice || item.discountedPriceValue || 0;
        return total + ((originalPrice - sellingPrice) * item.quantity);
      }, 0);
      
      state.total = state.subtotal + 7; // Platform fee
    },
    setAuthStatus: (state, action) => {
      state.isAuthenticated = action.payload;
      
      // FIXED: Clear cart when auth status changes to false (logout)
      if (!action.payload) {
        state.items = [];
        state.savedItems = [];
        state.subtotal = 0;
        state.discount = 0;
        state.total = 0;
        state.error = null;
      }
    },
    // FIXED: Renamed and enhanced to be called explicitly on logout
    clearCartState: (state) => {
      state.items = [];
      state.savedItems = [];
      state.subtotal = 0;
      state.discount = 0;
      state.total = 0;
      state.error = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.lastAction = null;
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
        state.items = action.payload.data || [];
        state.lastAction = 'fetch';
        state.isAuthenticated = true;
        // Calculate totals after fetching
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        // FIXED: Clear cart items on authentication failure
        state.items = [];
      })
      
      // Add to Cart - FIXED: No longer manually updates state, waits for fetchCartItems
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAction = 'add';
        state.isAuthenticated = true;
        // State will be updated by fetchCartItems dispatch
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const { itemId, updateData } = action.payload;
        const item = state.items.find(item => item.id === itemId);
        if (item) {
          Object.assign(item, updateData);
        }
        state.lastAction = 'update';
        state.isAuthenticated = true;
        // Recalculate totals after update
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Delete Cart Item
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const { itemId } = action.payload;
        state.items = state.items.filter(item => item.id !== itemId);
        state.lastAction = 'delete';
        state.isAuthenticated = true;
        // Recalculate totals after deletion
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
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
        state.lastAction = 'clear';
        state.isAuthenticated = true;
        // Reset totals
        state.subtotal = 0;
        state.discount = 0;
        state.total = 0;
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
  clearCartState
} = cartSlice.actions;

export default cartSlice.reducer;