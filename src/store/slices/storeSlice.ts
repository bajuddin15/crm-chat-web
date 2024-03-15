import { createSlice } from "@reduxjs/toolkit";

interface StoreState {
  unreadMessages: Array<any>;
}

const initialState: StoreState = {
  unreadMessages: [],
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setUnreadMessages: (state, action) => {
      state.unreadMessages = action.payload;
    },
  },
});

export const { setUnreadMessages } = storeSlice.actions;
export default storeSlice.reducer;
