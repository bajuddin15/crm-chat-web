import { Bell } from "lucide-react";
import { colors } from "../../utils/constants";
import React from "react";
import { getUnreadMessages } from "../../api";
import { useDispatch } from "react-redux";
import { setUnreadMessages } from "../../store/slices/storeSlice";
import notificationSound from "../../assets/sounds/notification.mp3";
import toast from "react-hot-toast";

interface IProps {
  token: string;
  setCurrentContact: any;
  type?: string;
}

interface IState {
  unreadMsgs: Array<any>;
  showNotifications: boolean;
}

const Profile = ({ token, setCurrentContact, type = "" }: IProps) => {
  const dispatch = useDispatch();

  const [unreadMsgs, setUnreadMsgs] = React.useState<IState["unreadMsgs"]>([]);
  const [showNotifications, setShowNotifications] =
    React.useState<IState["showNotifications"]>(false);

  React.useEffect(() => {
    const fetchAllUnreadMsgs = async () => {
      const data = await getUnreadMessages(token);
      if (data && Array.isArray(data)) {
        const unreadmsgCount = localStorage.getItem("unreadMsgCount");
        const lastMsgTimestamp = localStorage.getItem("lastMsgTimestamp");

        if (data?.length > 0) {
          let item = data[0];
          let cntMsg = item?.message_count;
          let lastTimestamp = item?.last_message_timestamp;
          if (unreadmsgCount !== cntMsg && lastMsgTimestamp !== lastTimestamp) {
            toast.success(
              `You have ${item?.message_count} unread messages from
            ${item?.fromnumber}`,
              {
                duration: 10000,
              }
            );
            const sound = new Audio(notificationSound);
            sound.play();
          }
          localStorage.setItem("unreadMsgCount", cntMsg);
          localStorage.setItem("lastMsgTimestamp", lastTimestamp);
          setUnreadMsgs(data);
          dispatch(setUnreadMessages(data));
        }
      }
    };
    const intervalId = setInterval(fetchAllUnreadMsgs, 30000); // Call fetchAllUnreadMsgs every 30 seconds

    // Clean up the interval when the component unmounts or when the dependency changes
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative">
      <>
        {type === "onlyBell" ? (
          <div
            className="cursor-pointer relative mt-2"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />

            <span
              style={{ backgroundColor: colors.whatsapp }}
              className="absolute -top-2 -right-1 text-[8px] text-white z-50 p-[2px] rounded-full flex items-center justify-center"
            >
              {unreadMsgs?.length}
            </span>
          </div>
        ) : (
          <div
            style={{ zIndex: 20 }}
            className="flex items-center justify-between h-14 borderBottom px-4 sticky top-0 left-0 bg-white"
          >
            <span className="text-sm">
              {showNotifications ? "" : "Contact Info"}
            </span>
            <div
              className="cursor-pointer relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} />

              <span
                style={{ backgroundColor: colors.whatsapp }}
                className="absolute -top-2 -right-1 text-[8px] text-white z-50 p-[2px] rounded-full flex items-center justify-center"
              >
                {unreadMsgs?.length}
              </span>
            </div>
          </div>
        )}
      </>

      {/* unread msgs */}
      {showNotifications && (
        <div style={{ zIndex: 99 }} className="absolute top-10 right-0">
          <div className="flex flex-col gap-2 bg-white z-50 border border-gray-300 w-[310px] max-h-[90vh] overflow-auto custom-scrollbar p-3 rounded-tl-xl rounded-bl-xl rounded-br-xl">
            {unreadMsgs?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="bg-blue-50 border-l-4 border-l-blue-500 p-2 cursor-pointer"
                  onClick={() => {
                    let cont = {
                      contact: item?.fromnumber,
                      conversationId: item?.cid,
                    };
                    setCurrentContact(cont);
                    setShowNotifications(false);
                  }}
                >
                  <span className="text-[13px]">
                    You have {item?.message_count} unread messages from{" "}
                    <span className="text-blue-500 font-semibold">
                      {item?.contact_name?.trim()
                        ? item?.contact_name
                        : item?.fromnumber}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
