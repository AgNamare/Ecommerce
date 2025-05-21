import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access_token: null, // Initial state with access_token set to null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action) {
      state.access_token = action.payload; // Set the access token
    },
    clearAccessToken(state) {
      state.access_token = null; // Clear the access token on signout
    },
  },
});

export const { setAccessToken, clearAccessToken } = authSlice.actions;
export default authSlice.reducer;
