// src/store/adminSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null, // Initial state for admin details
  isLoading: false, // Loading state for async operations
  error: null, // Error state for handling errors
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminDetails(state, action) {
      state.admin = action.payload; // Set admin details
    },
    clearAdminDetails(state) {
      state.admin = null; // Clear admin details on signout
    },
    setLoading(state, action) {
      state.isLoading = action.payload; // Set loading state
    },
    setError(state, action) {
      state.error = action.payload; // Set error state
    },
    clearError(state) {
      state.error = null; // Clear error state
    },
  },
});

// Export actions
export const {
  setAdminDetails,
  clearAdminDetails,
  setLoading,
  setError,
  clearError,
} = adminSlice.actions;

// Export reducer
export default adminSlice.reducer;
