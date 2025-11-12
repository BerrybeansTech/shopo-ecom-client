import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../components/Auth/authSlice";
import productReducer from "../components/AllProductPage/productSlice";
import cartReducer from "../components/CartPage/cartSlice";

// Create and configure the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], 
      },
    }),
});