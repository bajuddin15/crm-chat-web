import { useSelector } from "react-redux";
import { MdLabel, MdNotifications } from "react-icons/md";
import { AVATAR_IMG } from "../../../../assets/images";
import { RootState } from "../../../../store";
import useData from "./data";
import Notifications from "./Components/Notifications";
import { X } from "lucide-react";

interface IProps {
  fetchConversations: any;
}

const Profile: React.FC<IProps> = ({ fetchConversations }) => {
  const selectedConversation = useSelector(
    (state: RootState) => state.store.selectedConversation
  );

  const {
    state,
    setShowNotifications,
    setShowDeleteLabelId,
    handleRemoveLabel,
    handleChangeConversationStatus,
  } = useData();
  const {
    showNotifications,
    unreadNotifications,
    showDeleteLabelId,
    labels,
    convStatus,
  } = state;

  if (showNotifications) {
    return <Notifications setShowNotifications={setShowNotifications} />;
  }

  return (
    <div className="bg-white w-full h-full">
      {/* header */}
      <div className="flex items-center justify-between h-[52px] p-3 bg-white border-b border-b-gray-300">
        <span className="text-sm font-medium">User Info</span>

        <button onClick={() => setShowNotifications(true)} className="relative">
          <MdNotifications size={20} />

          {/* badge */}
          {unreadNotifications?.length > 0 && (
            <span className="absolute -top-[6px] -right-[4px] bg-red-600 text-white text-[10px] w-4 h-4 flex items-start justify-center rounded-full">
              {unreadNotifications?.length}
            </span>
          )}
        </button>
      </div>

      <div className="py-5 px-3 space-y-5">
        <div className="space-y-5 border border-gray-200 shadow-sm p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <img
              className="w-10 h-10 rounded-full"
              src={AVATAR_IMG}
              alt="profile-image"
            />
            <div>
              <h2 className="text-sm font-medium">
                {selectedConversation?.fullName}
              </h2>
              <span className="text-sm font-normal text-gray-600">
                last seen recently
              </span>
            </div>
          </div>

          <div className="text-sm flex flex-col">
            <span className="font-medium">Email: </span>
            <span className="text-sm font-normal text-gray-600">
              {selectedConversation?.email}
            </span>
          </div>
          <div className="text-sm flex flex-col">
            <span className="font-medium">Phone Number: </span>
            <span className="text-sm font-normal text-gray-600">
              {selectedConversation?.phoneNumber}
            </span>
          </div>
        </div>

        {labels?.length > 0 && (
          <div className="border border-gray-300 rounded-xl p-3">
            <h3 className="text-base font-medium">Labels</h3>
            <div className="flex gap-4 flex-wrap mt-4">
              {labels.map((item: any) => {
                return (
                  <div
                    key={item?._id}
                    className="flex items-center gap-1"
                    onMouseEnter={() => setShowDeleteLabelId(item?._id)}
                    onMouseLeave={() => setShowDeleteLabelId(null)}
                  >
                    <MdLabel size={20} color="#fcba03" />
                    <span className="text-sm mb-[1px]">{item?.label}</span>
                    {showDeleteLabelId === item?._id && (
                      <div
                        className="cursor-pointer bg-white shadow-md p-[2px] rounded-full border border-gray-300"
                        onClick={() => handleRemoveLabel(item?._id)}
                      >
                        <X size={14} color="red" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* mark close/open conversation */}
        <div>
          <button
            onClick={async () => {
              let status = convStatus === "open" ? "closed" : "open";
              await handleChangeConversationStatus(status);
              await fetchConversations();
            }}
            className="w-full text-sm text-start py-2 px-4 bg-gray-100 border border-gray-300 text-red-500 font-medium tracking-wide rounded-lg shadow-sm"
          >
            {convStatus === "open" ? "Close Conversation" : "Open Conversation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
