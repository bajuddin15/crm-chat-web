import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StoreState {
  unreadMessages: Array<any>;
  conversations: any[]; // live chat conversations
  selectedConversation: any;
  messages: any[];
  usersTypingStatus: any;
}

const initialState: StoreState = {
  unreadMessages: [],
  selectedConversation: null,
  conversations: [], // live chat conversations
  messages: [],
  usersTypingStatus: {},
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setUnreadMessages: (state, action) => {
      state.unreadMessages = action.payload;
    },
    setConversations: (state, action: PayloadAction<any[]>) => {
      state.conversations = action.payload;
    },
    setSelectedConversation: (state, action: PayloadAction<any>) => {
      state.selectedConversation = action.payload;
    },
    setMessages: (state, action: PayloadAction<any[]>) => {
      state.messages = action.payload;
    },
    setUsersTypingStatus: (
      state,
      action: PayloadAction<{ userId: string; status: boolean }>
    ) => {
      state.usersTypingStatus[action.payload.userId] = action.payload.status;
    },
  },
});

export const {
  setUnreadMessages,
  setConversations,
  setSelectedConversation,
  setMessages,
  setUsersTypingStatus,
} = storeSlice.actions;
export default storeSlice.reducer;
