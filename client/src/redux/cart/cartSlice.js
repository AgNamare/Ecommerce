import axios from "@/api/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

const storage = localStorage.getItem("cartItems");

// Initial state
const initialState = {
  products: JSON.parse(storage) || [],
  totalQuantity: 0,
  totalAmount: 0,
  savings: 0,
  status: "idle",
  error: null,
};

// Utility function to save cart to local storage
const saveCartToLocalStorage = (products) => {
  localStorage.setItem("cartItems", JSON.stringify(products));
};

// Error handling function
const handleError = (error) => {
  // Check if error is a network error
  if (!error.response) {
    return "Network error. Please check your internet connection.";
  }

  // Handle server response errors
  if (error.response && error.response.data) {
    return error.response.data.message || "An unexpected error occurred";
  }

  return "An unexpected error occurred";
};

// Async thunk for adding product to cart (authenticated users)
export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async (
    { productID, quantity, method, axiosPrivate },
    { getState, rejectWithValue }
  ) => {
    const user = getState().user.user;

    if (!user) {
      return rejectWithValue({ error: "User not authenticated" });
    }

    const { cart: id } = user;

    const requestBody = {
      product: productID,
      quantity: quantity,
      method: method,
    };

    try {
      const response = await axiosPrivate.post(
        `/api/v1/cart/${id}/`,
        requestBody
      );
      return response.data; // Assuming the response contains the updated cart
    } catch (error) {
      const message = handleError(error);
      toast.error(message); // Display the error message
      return rejectWithValue({ error: message });
    }
  }
);

// Async thunk for merging local cart with backend cart
export const mergeLocalCart = createAsyncThunk(
  "cart/mergeLocalCart",
  async ({ axiosPrivate }, { getState, rejectWithValue }) => {
    const user = getState().user.user;
    console.log("User from store:", user);

    if (!user) {
      return rejectWithValue({ error: "User not authenticated" });
    }

    const localCartItems = JSON.parse(localStorage.getItem("cartItems")) || {
      products: [],
    };
    console.log("Local cart items:", localCartItems);

    const cartItemsToMerge = localCartItems.products?.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    console.log("Merging local cart items:", cartItemsToMerge);

    try {
      const response = await axiosPrivate.post(
        `/api/v1/cart/merge/${user.cart}`,
        cartItemsToMerge,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response after merging local cart:", response.data);

      return response.data;
    } catch (error) {
      console.log("Error while merging local cart:", error);

      const message = handleError(error);
      toast.error(message); // Display the error message
      return rejectWithValue({ error: message });
    }
  }
);

// Async thunk for deleting product from cart
export const deleteProductFromCart = createAsyncThunk(
  "cart/deleteProductFromCart",
  async (
    { cartId, productId, axiosPrivate },
    { getState, rejectWithValue }
  ) => {
    const user = getState().user.user;

    if (!user) {
      return rejectWithValue({ error: "User not authenticated" });
    }

    try {
      const response = await axiosPrivate.delete(
        `/api/v1/cart/product/${cartId}`,
        { data: { product: productId } }
      );
      return response.data; // Assuming the response contains the updated cart
    } catch (error) {
      const message = handleError(error);
      toast.error(message); // Display the error message
      return rejectWithValue({ error: message });
    }
  }
);

// Async thunk for fetching the user's cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ axiosPrivate }, { getState, rejectWithValue }) => {
    const user = getState().user.user;

    if (!user) {
      return rejectWithValue({ error: "User not authenticated" });
    }

    try {
      const response = await axiosPrivate.get(`/api/v1/cart/${user.cart}`);
      return response.data; // Assuming the response contains the cart details
    } catch (error) {
      const message = handleError(error);
      toast.error(message); // Display the error message
      return rejectWithValue({ error: message });
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartLocal: (state, action) => {
      const { id, img, price, name, discountPrice, quantity } = action.payload;

      const existingItem = state.products.find(
        (cartItem) => cartItem.product._id === id
      );

      if (existingItem) {
        existingItem.quantity += quantity;

        existingItem.savings =
          (parseFloat(existingItem.product.price) - parseFloat(discountPrice)) *
          existingItem.quantity;

        if (existingItem.quantity <= 0) {
          state.products = state.products.filter(
            (cartItem) => cartItem.product._id !== id
          );
        }
      } else if (quantity > 0) {
        state.products.push({
          product: {
            _id: id,
            img: img,
            discountPrice: discountPrice,
            price: price,
            name: name,
          },
          quantity: quantity,
          savings: (parseFloat(price) - parseFloat(discountPrice)) * quantity,
        });
      }

      // Recalculate totals
      state.totalQuantity = state.products.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      state.totalAmount = state.products.reduce(
        (acc, item) => acc + item.quantity * parseFloat(item.product.price),
        0
      );
      state.savings = state.products.reduce(
        (acc, item) => acc + item.savings,
        0
      );

      saveCartToLocalStorage(state);
    },

    clearLocalCart: (state) => {
      state.products = [];
      localStorage.removeItem("cartItems");
    },
    updateCartState: (state, action) => {
      state.products = action.payload.products;
      state.savings = action.payload.savings;
      state.totalQuantity = action.payload.totalQuantity;
      state.totalAmount = action.payload.totalAmount;
    },
    resetCart: (state) => {
      state.products = [];
      state.savings = 0;
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.removeItem("cartItems");
    },
    deleteProductLocalCart: (state, action) => {
      const { id } = action.payload;

      // Remove the product from the cart
      state.products = state.products.filter(
        (cartItem) => cartItem.product._id !== id
      );

      // Recalculate totals
      const { totalQuantity, totalAmount, totalSavings } =
        state.products.reduce(
          (totals, item) => {
            totals.totalQuantity += item.quantity;
            totals.totalAmount +=
              item.quantity * parseFloat(item.product.price);
            totals.totalSavings += item.savings;
            return totals;
          },
          { totalQuantity: 0, totalAmount: 0, totalSavings: 0 }
        );

      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      state.savings = totalSavings;

      // Save the updated cart to localStorage
      saveCartToLocalStorage(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProductToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.savings = action.payload.savings;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      })
      .addCase(mergeLocalCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(mergeLocalCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.totalQuantity = action.payload.totalQuantity;
        state.savings = action.payload.savings;
        state.totalAmount = action.payload.totalAmount;
        localStorage.removeItem("cartItems");
      })
      .addCase(mergeLocalCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.savings = action.payload.savings;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      })
      .addCase(deleteProductFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProductFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(deleteProductFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      });
  },
});

export const {
  addToCartLocal,
  clearLocalCart,
  updateCartState,
  resetCart,
  deleteProductLocalCart,
} = cartSlice.actions;
export default cartSlice.reducer;
