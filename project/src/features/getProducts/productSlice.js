import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  fetchAllProducts, fetchProductById } from './productAPI.js';

const initialState = {
  data: [],
  totalItems: null,
  status: 'idle',
  selectedProduct: null
};
export const getProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async () => {
    const data = await fetchAllProducts();
    // The value we return becomes the `fulfilled` action payload

    return data;
  }
);
export const fetchProductByIdAsync = createAsyncThunk(
  'product/fetchProductById',
  async (id) => {
    const data = await fetchProductById(id);
    // The value we return becomes the `fulfilled` action payload
    return data;
  }
);
export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearselectProduct: (state) => {
      state.selectedProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data = action.payload;
      })
        .addCase(fetchProductByIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selectedProduct = action.payload;
      })
    },
});

export const { clearselectProduct } = productsSlice.actions;
export const selectProducts = (state) => state.products.data;
export const selectedProduct = (state) => state.products.selectedProduct;
export const selecttotalItems = (state) => state.products.totalItems;
export default productsSlice.reducer;
