import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./modules/messages";

const store = configureStore({
  reducer: {
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
