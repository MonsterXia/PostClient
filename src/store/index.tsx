import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./modules/Admin";
import languageReducer from "./modules/messages";

const store = configureStore({
  reducer: {
    admin: adminReducer,
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
