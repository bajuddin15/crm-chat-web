import { useSelector } from "react-redux";
import { AVATAR_IMG } from "../../../../assets/images";
import { RootState } from "../../../../store";

const Profile = () => {
  const selectedConversation = useSelector(
    (state: RootState) => state.store.selectedConversation
  );
  return (
    <div className="bg-white w-full h-full">
      <div className="flex items-center h-[52px] p-3 bg-white border-b border-b-gray-300">
        <span className="text-sm font-medium">User Info</span>
      </div>
      <div className="flex items-center gap-3 p-3 bg-gray-100">
        <img
          className="w-8 h-8 rounded-full"
          src={AVATAR_IMG}
          alt="profile-image"
        />
        <div>
          <h2 className="text-sm font-medium">
            {selectedConversation?.fullName}
          </h2>
          <p className="text-sm text-gray-500">
            @{selectedConversation?.username}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
