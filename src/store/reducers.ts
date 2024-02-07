import { combineReducers } from "@reduxjs/toolkit";
import countReducer from "./slices/counterSlice";

const rootReducer = combineReducers({
  // Add your reducers here
  counter: countReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
