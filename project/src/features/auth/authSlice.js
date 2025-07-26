import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signOut, verifyUser } from "./authAPI.js";
const initialState = {
  loggedInUser: null,
  status: "loading",
  error: null,
};

export const verifyUserAsync = createAsyncThunk("user/verifyUser", async () => {
  const response = await verifyUser();
  // The value we return becomes the `fulfilled` action payload
  return response.data;
});

export const signOutAsync = createAsyncThunk(
  "user/signOut",
  async () => {
    const response = await signOut();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUser = action.payload;
      })
      .addCase(verifyUserAsync.rejected, (state, action) => {
        state.status = "idle";
      })

      .addCase(signOutAsync.pending, (state, action) => {
        state.status = "idle";
      })
      .addCase(signOutAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUser = null;
      });
  },
});

export const { increment } = userSlice.actions;
export const selectLoggedInUser = (state) => state.auth.loggedInUser;
export const selectError = (state) => state.auth.error;
export const selectAuthStatus = (state) => state.auth.status;
export default userSlice.reducer;
