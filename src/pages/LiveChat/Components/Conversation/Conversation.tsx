import { Filter, Search } from "lucide-react";
import { AVATAR_IMG } from "../../../../assets/images";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { useSocketContext } from "../../../../context/SocketContext";
import {
  setNotifications,
  setSelectedConversation,
  setStatus,
  setUnreadMessagesOfUsers,
} from "../../../../store/slices/storeSlice";
import {
  getFormatedTime,
  getJwtTokenFromLocalStorage,
} from "../../../../utils/common";
import useData from "../../data";
import Loading from "../../../../components/Common/Loading";
import { useAuthContext } from "../../../../context/AuthContext";
import React from "react";
import FilterDrawer from "./Components/FilterDrawer";
import { colors } from "../../../../utils/constants";
import axios from "axios";
import { LIVE_CHAT_API_URL } from "../../../../constants";

interface IProps {
  setShowMobileChatView: any;
}

const Conversation: React.FC<IProps> = ({ setShowMobileChatView }) => {
  const dispatch = useDispatch();
  const { authUser } = useAuthContext();
  const conversations = useSelector(
    (state: RootState) => state.store.conversations
  );
  const selectedConversation = useSelector(
    (state: RootState) => state.store.selectedConversation
  );
  const usersTypingMap = useSelector(
    (state: RootState) => state.store.usersTypingStatus
  );

  const notifications = useSelector(
    (state: RootState) => state.store.notifications
  );

  const unreadMessagesOfUsersMap = useSelector(
    (state: RootState) => state.store.unreadMessagesOfUsers
  );

  const status = useSelector((state: RootState) => state.store.status);
  const filterLabelId = useSelector(
    (state: RootState) => state.store.filterLabelId
  );
  const filterOwnerId = useSelector(
    (state: RootState) => state.store.filterOwnerId
  );

  const [searchInput, setSearchInput] = React.useState<string>("");
  const [filterAppliedCount, setFilterAppliedCount] = React.useState<number>(0);

  const { state } = useData();
  const { loading } = state;

  const { onlineUsers } = useSocketContext();

  // filter drawer
  const [isFilterDrawerOpen, setFilterDrawerOpen] =
    React.useState<boolean>(false);

  const toggleDrawer = () => {
    setFilterDrawerOpen(!isFilterDrawerOpen);
  };

  const handleSearchConversation = () => {
    if (!searchInput.trim()) return conversations;

    let users = conversations.filter((item: any) =>
      item?.fullName?.toLowerCase()?.includes(searchInput.toLowerCase())
    );
    return users;
  };

  React.useEffect(() => {
    let count = 0;
    if (filterLabelId && filterOwnerId) {
      count = 2;
    } else if (filterLabelId || filterOwnerId) {
      count = 1;
    } else count = 0;

    setFilterAppliedCount(count);
  }, [filterLabelId, filterOwnerId]);

  // update when notifications updated
  React.useEffect(() => {
    const calculateUnreadMsgs = (notifications: any) => {
      let unreadMsgsMap: any = {};
      for (let i = 0; i < notifications.length; i++) {
        const notification = notifications[i];
        const userId = notification?.from?._id;
        const isRead = notification?.read;
        if (!isRead) {
          unreadMsgsMap[userId] = unreadMsgsMap[userId]
            ? unreadMsgsMap[userId] + 1
            : 1;
        }
      }
      dispatch(setUnreadMessagesOfUsers(unreadMsgsMap));
    };
    if (notifications?.length > 0) {
      calculateUnreadMsgs(notifications);
    }
  }, [notifications]);

  React.useEffect(() => {
    const makeReadNotifications = async (selectedConversation: any) => {
      const jwtToken = getJwtTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      try {
        const formData = {
          userId: selectedConversation._id,
        };
        const { data } = await axios.put(
          `${LIVE_CHAT_API_URL}/api/v1/notifications/makeReadNotifications`,
          formData,
          { headers }
        );
        if (data && data?.success) {
          const notificationData = data?.data?.notifications;
          dispatch(setNotifications(notificationData));
        }
      } catch (error: any) {
        console.log("makeRead notifications error : ", error?.message);
      }
    };
    if (selectedConversation) {
      makeReadNotifications(selectedConversation);
    }
  }, [selectedConversation]);

  return (
    <div className="relative w-full h-full bg-white flex flex-col justify-between">
      <div className="flex flex-col gap-4 p-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              className="w-7 h-7 rounded-full object-cover border border-gray-300"
              src={
                authUser?.profilePic ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
              alt="profile-picture"
            />
            <span className="text-sm font-medium">{authUser?.fullName}</span>
          </div>

          <div>
            <button className="relative" onClick={toggleDrawer}>
              <Filter size={20} opacity={0.7} />

              {filterAppliedCount > 0 && (
                <span className="absolute -top-[7px] -right-[7px] w-4 h-4 rounded-full flex items-center justify-center bg-green-500 text-white text-[11px]">
                  {filterAppliedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center border border-gray-300 px-3 rounded-md hover:border-gray-400">
          <Search size={20} opacity={0.7} />
          <input
            className="text-sm border-none outline-none focus:ring-0 bg-inherit"
            type="text"
            placeholder="Search.."
            value={searchInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchInput(e.target.value)
            }
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(setStatus("open"))}
            className={`${
              status === "open"
                ? "bg-blue-300/30 text-blue-600 border border-blue-200"
                : "bg-gray-200/70 text-gray-700 border border-gray-200 hover:bg-gray-200"
            }  px-4 py-[6px] rounded-full text-sm`}
          >
            Open
          </button>
          <button
            onClick={() => dispatch(setStatus("closed"))}
            className={`${
              status === "closed"
                ? "bg-blue-300/30 text-blue-600 border border-blue-200"
                : "bg-gray-200/70 text-gray-700 border border-gray-200 hover:bg-gray-200"
            }  px-4 py-[6px] rounded-full text-sm`}
          >
            Closed
          </button>
        </div>
      </div>
      <FilterDrawer isOpen={isFilterDrawerOpen} onClose={toggleDrawer} />

      <div className="flex-1 bg-white overflow-y-auto custom-scrollbar">
        {loading && (
          <div className="flex items-center justify-center mt-2">
            <Loading />
          </div>
        )}
        {handleSearchConversation().map((item: any) => {
          const isSelected = selectedConversation?._id === item._id;
          const isOnline = onlineUsers.includes(item._id);

          const formatedTime = getFormatedTime(item?.recentMessage?.createdAt);

          return (
            <div
              key={item?._id}
              className={`flex items-center gap-4 px-2 py-3 mx-2 rounded-md cursor-pointer ${
                isSelected ? "bg-gray-200" : "hover:bg-gray-200"
              } `}
              onClick={() => {
                setShowMobileChatView(true);
                dispatch(setSelectedConversation(item));
              }}
            >
              <div className="relative w-10">
                <img
                  className="w-8 h-8 rounded-full"
                  src={AVATAR_IMG}
                  alt="profile-image"
                />
                {isOnline && (
                  <span className="bottom-0 start-6 absolute w-[11px] h-[11px] bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                )}
              </div>

              <div className="space-y-1 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {item?.fullName}
                  </span>
                  <span className="text-xs font-normal">{formatedTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">
                    {usersTypingMap[item?._id]
                      ? `typing...`
                      : item?.recentMessage?.message?.length >= 40
                      ? `${item?.recentMessage?.message?.slice(0, 39)}...`
                      : item?.recentMessage?.message}
                  </span>
                  {unreadMessagesOfUsersMap[item._id] && (
                    <span
                      style={{ backgroundColor: colors.whatsapp }}
                      className="text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white"
                    >
                      {unreadMessagesOfUsersMap[item._id]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Conversation;
