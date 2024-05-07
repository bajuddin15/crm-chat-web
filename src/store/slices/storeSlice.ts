import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Note: all of stores data about live chat admin

interface StoreState {
  unreadMessages: Array<any>;
  conversations: any[]; // live chat conversations
  selectedConversation: any;
  messages: any[];
  usersTypingStatus: any;
  notifications: any[];
}

const initialState: StoreState = {
  unreadMessages: [],
  selectedConversation: null,
  conversations: [], // live chat conversations
  messages: [],
  usersTypingStatus: {},
  notifications: [],
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
    setNotifications: (state, action: PayloadAction<any[]>) => {
      state.notifications = action.payload;
    },
    setNotificationWithIndex: (
      state,
      action: PayloadAction<{ notification: any; index: number }>
    ) => {
      state.notifications[action.payload.index] = action.payload.notification;
    },
  },
});

export const {
  setUnreadMessages,
  setConversations,
  setSelectedConversation,
  setMessages,
  setUsersTypingStatus,
  setNotifications,
  setNotificationWithIndex,
} = storeSlice.actions;
export default storeSlice.reducer;
