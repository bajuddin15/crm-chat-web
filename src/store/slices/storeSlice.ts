import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Note: all of stores data about live chat admin

type ConversationStatus = "open" | "closed";

interface StoreState {
  unreadMessages: Array<any>;
  conversations: any[]; // live chat conversations
  selectedConversation: any;
  messages: any[];
  usersTypingStatus: any;
  notifications: any[];
  allLabels: any[]; // allLabels of a perticular admin
  labels: any[]; // labels of a conversation
  status: ConversationStatus;
  teamMembers: Array<any>;
  filterLabelId: string;
  filterOwnerId: string;
  unreadMessagesOfUsers: any;
}

const initialState: StoreState = {
  unreadMessages: [],
  selectedConversation: null,
  conversations: [], // live chat conversations
  messages: [],
  usersTypingStatus: {},
  notifications: [],
  allLabels: [],
  labels: [],
  status: "open",
  teamMembers: [],
  filterLabelId: "",
  filterOwnerId: "",
  unreadMessagesOfUsers: {}, // it store all users unread msgs
};

const storeSlice: any = createSlice({
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
    setAllLabels: (state, action: PayloadAction<any[]>) => {
      state.allLabels = action.payload;
    },
    setLabels: (state, action: PayloadAction<any[]>) => {
      state.labels = action.payload;
    },
    setStatus: (state, action: PayloadAction<ConversationStatus>) => {
      state.status = action.payload;
    },
    setTeamMembers: (state, action: PayloadAction<Array<any>>) => {
      state.teamMembers = action.payload;
    },
    setFilterLabelId: (state, action: PayloadAction<string>) => {
      state.filterLabelId = action.payload;
    },
    setFilterOwnerId: (state, action: PayloadAction<string>) => {
      state.filterOwnerId = action.payload;
    },
    setUnreadMessagesOfUsers: (state, action: PayloadAction<any>) => {
      state.unreadMessagesOfUsers = action.payload;
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
  setAllLabels,
  setLabels,
  setStatus,
  setTeamMembers,
  setFilterLabelId,
  setFilterOwnerId,
  setUnreadMessagesOfUsers,
} = storeSlice.actions;
export default storeSlice.reducer;
