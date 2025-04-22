import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./modules/Admin";

const store = configureStore({
  reducer: {
    admin: adminReducer,
  },
});

export default store;