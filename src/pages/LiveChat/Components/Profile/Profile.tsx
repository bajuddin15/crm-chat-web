import { useSelector } from "react-redux";
import { MdNotifications } from "react-icons/md";
import { AVATAR_IMG } from "../../../../assets/images";
import { RootState } from "../../../../store";
import useData from "./data";
import Notifications from "./Components/Notifications";

const Profile = () => {
  const selectedConversation = useSelector(
    (state: RootState) => state.store.selectedConversation
  );

  const { state, setShowNotifications } = useData();
  const { showNotifications, unreadNotifications } = state;

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

      <div className="p-5 space-y-5">
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
            <span className="text-sm">last seen recently</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
