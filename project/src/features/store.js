import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/getProducts/productSlice.js'
import cartReducer from '../features/cart/cartSlice.js'
// import orderReducer from '../features/order/orderSlice.js'
import authReducer from '../features/auth/authSlice.js'
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart:cartReducer,
    auth:authReducer,
    // order:orderReducer,
  },
});
