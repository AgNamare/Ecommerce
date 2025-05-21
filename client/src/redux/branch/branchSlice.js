import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_BRANCH = import.meta.env.VITE_DEFAULT_BRANCH;

// Function to safely parse JSON from localStorage
const parseJSONFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(
      `Error parsing JSON from localStorage for key ${key}:`,
      error
    );
    return null;
  }
};

const initialState = {
  selectedBranch: null,
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setBranch: (state, action) => {
      state.selectedBranch = action.payload;
      try {
        localStorage.setItem("selectedBranch", JSON.stringify(action.payload));
      } catch (error) {
        console.error("Error saving selectedBranch to localStorage:", error);
      }
    },
    removeBranch: (state) => {
      state.selectedBranch = null;
      try {
        localStorage.removeItem("selectedBranch");
      } catch (error) {
        console.error(
          "Error removing selectedBranch from localStorage:",
          error
        );
      }
    },
  },
});

export const { setBranch, removeBranch } = branchSlice.actions;

export default branchSlice.reducer;
