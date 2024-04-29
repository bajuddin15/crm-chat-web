import { Menu } from "lucide-react";
import { AVATAR_IMG } from "../../../../assets/images";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { useSocketContext } from "../../../../context/SocketContext";
import { setSelectedConversation } from "../../../../store/slices/storeSlice";
import { getFormatedTime } from "../../../../utils/common";
import useData from "../../data";
import Loading from "../../../../components/Common/Loading";

const Conversation = () => {
  const dispatch = useDispatch();
  const conversations = useSelector(
    (state: RootState) => state.store.conversations
  );
  const selectedConversation = useSelector(
    (state: RootState) => state.store.selectedConversation
  );

  const { state } = useData();
  const { loading } = state;

  const { onlineUsers } = useSocketContext();
  return (
    <div className="w-full h-full bg-white flex flex-col justify-between">
      <div className="flex items-center gap-3 h-[52px] p-3 bg-white border-b border-b-gray-300">
        <div>
          <Menu size={22} />
        </div>
        <div className="border border-gray-300 rounded-full w-full h-9 flex items-center">
          <input
            className="w-full border-none outline-none focus:ring-0 bg-inherit text-sm"
            type="text"
            placeholder="Search"
          />
        </div>
      </div>

      <div className="flex-1 bg-white overflow-y-auto custom-scrollbar">
        {loading && (
          <div className="flex items-center justify-center mt-2">
            <Loading />
          </div>
        )}
        {conversations.map((item) => {
          const isSelected = selectedConversation?._id === item._id;
          const isOnline = onlineUsers.includes(item._id);

          const formatedTime = getFormatedTime(item?.recentMessage?.createdAt);
          return (
            <div
              key={item?._id}
              className={`flex items-center gap-4 px-2 py-3 cursor-pointer ${
                isSelected ? "bg-gray-200" : "hover:bg-gray-200"
              } `}
              onClick={() => dispatch(setSelectedConversation(item))}
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
                    {item?.recentMessage?.message}
                  </span>
                  {/* <span className="text-[10px]">1</span> */}
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
