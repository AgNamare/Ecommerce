import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUser: (state, action) => {
      state.user = action.payload;
    },
    deleteUser: (state) => {
      state.user = null;
      try {
        localStorage.removeItem("persist:user"); // Remove the user key from localStorage
      } catch (error) {
        console.error("Error removing user from localStorage:", error);
      }
    },
  },
});

export const { saveUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
