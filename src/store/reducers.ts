import { combineReducers } from "@reduxjs/toolkit";
import storeReducer from "./slices/storeSlice";

const rootReducer = combineReducers({
  // Add your reducers here
  store: storeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
