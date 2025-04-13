import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/userSlice.js";
import cartReducer from "./cart/cartSlice.js";
import orderReducer from "./order/orderSlice.js";
import branchReducer from "./branch/branchSlice.js";
import authReducer from "./auth/authSlice.js";

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  branch: branchReducer,
  order: orderReducer,
  auth : authReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "user", "order", "branch"],
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
