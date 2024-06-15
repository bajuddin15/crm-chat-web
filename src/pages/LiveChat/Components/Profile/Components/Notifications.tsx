import React from "react";
import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { useSocketContext } from "../../../../../context/SocketContext";
import {
  setNotificationWithIndex,
  setSelectedConversation,
} from "../../../../../store/slices/storeSlice";
import axios from "axios";
import {
  formatCreatedAt,
  getJwtTokenFromLocalStorage,
} from "../../../../../utils/common";
import { LIVE_CHAT_API_URL } from "../../../../../constants";

interface IProps {
  setShowNotifications: any;
}

const Notifications: React.FC<IProps> = ({ setShowNotifications }) => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.store.notifications
  );
  const { onlineUsers } = useSocketContext();

  const handleMakeReadNotification = async (item: any, index: number) => {
    dispatch(setSelectedConversation(item?.from));
    try {
      const jwtToken = getJwtTokenFromLocalStorage();
      if (jwtToken && !item?.read) {
        const notificationId = item?._id;
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };
        const formData = {};
        const { data } = await axios.put(
          `${LIVE_CHAT_API_URL}/api/v1/notifications/makeRead/${notificationId}`,
          formData,
          { headers }
        );

        if (data && data?.success) {
          dispatch(
            setNotificationWithIndex({ notification: data?.data, index })
          );
        }
      }
    } catch (error: any) {
      console.log("Error in makeReadNotification : ", error?.message);
    }
  };

  return (
    <div className="bg-white w-full h-full">
      {/* header */}
      <div className="flex items-center gap-2 h-[52px] p-3 bg-white border-b border-b-gray-300">
        <button onClick={() => setShowNotifications(false)}>
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-medium">Notifications</span>
      </div>

      {/* all notifications */}
      <div
        style={{ height: "calc(100% - 52px)", overflowY: "auto" }}
        className="custom-scrollbar"
      >
        {notifications?.map((item: any, index: number) => {
          const isOnline = onlineUsers.includes(item?.from._id);

          const time = formatCreatedAt(item?.createdAt);
          return (
            <div
              key={item?._id}
              className={`p-2 flex items-center gap-1 cursor-pointer ${
                !item?.read
                  ? "bg-blue-100 hover:bg-blue-200"
                  : "bg-inherit hover:bg-gray-200"
              }`}
              onClick={() => handleMakeReadNotification(item, index)}
            >
              <div className="flex items-center gap-2">
                <div className="relative w-12">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={item?.from?.profilePic}
                    alt="profile-image"
                  />
                  {isOnline && (
                    <span className="bottom-0 start-6 absolute w-[11px] h-[11px] bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                  )}
                </div>
                <p className="text-sm space-x-1">
                  <span className="font-[400]">{item?.from?.fullName}</span>
                  {item?.type === "message" && (
                    <span>sent a new message to you</span>
                  )}
                  {item?.type === "call" && (
                    <span>sent a call request to you</span>
                  )}
                </p>
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-xs">{time}</span>
                <span>.</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
