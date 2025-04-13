// orderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartInfo: [],
  deliveryInfo: {},
  paymentInfo: {},
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setDeliveryInfo(state, action) {
      state.deliveryInfo = action.payload;
    },
    setPaymentInfo(state, action) {
      state.paymentInfo = action.payload;
    },
    setCartInfo(state, action) {
      state.cartInfo = action.payload;
    },
    deleteOrderInfo(state) {
      state.cartInfo = [];
      state.deliveryInfo = {};
      state.paymentInfo = {};
      try {
        localStorage.removeItem("persist:cartInfo"); // Remove the user key from localStorage
        localStorage.removeItem("persist:deliveryInfo"); // Remove the user key from localStorage
        localStorage.removeItem("persist:paymentInfo"); // Remove the user key from localStorage
      } catch (error) {
        console.error("Error removing user from localStorage:", error);
      }
    },
    // You can add more reducers here based on your application's needs
  },
});

export const { setDeliveryInfo, setPaymentInfo, deleteOrderInfo } = orderSlice.actions;
export default orderSlice.reducer;
