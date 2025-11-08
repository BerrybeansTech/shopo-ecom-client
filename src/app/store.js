import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../components/Auth/authSlice";
import productReducer from "../components/AllProductPage/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;