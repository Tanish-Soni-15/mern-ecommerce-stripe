import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/getProducts/productSlice.js'
import cartReducer from '../features/cart/cartSlice.js'
// import orderReducer from '../features/order/orderSlice.js'
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart:cartReducer,
    // order:orderReducer,
  },
});
