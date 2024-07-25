import { useLocation, useNavigate } from "react-router-dom";
import Chat from "./Components/Chat/Chat";
import Conversation from "./Components/Conversation/Conversation";
import Profile from "./Components/Profile/Profile";
import useData from "./data";
import { LIVE_CHAT_ICON } from "../../assets/images";

const LiveChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, setShowMobileChatView, fetchConversations } = useData();
  const { conversations, selectedConversation, showMobileChatView } = state;

  return (
    <div className="w-full h-screen flex bg-gray-100 overflow-hidden">
      <div
        style={{ flex: 1 }}
        className={`${showMobileChatView ? "hidden sm:flex sm:flex-col" : ""}`}
      >
        <Conversation setShowMobileChatView={setShowMobileChatView} />
      </div>
      <div
        style={{ flex: 2 }}
        className={`${
          showMobileChatView ? "flex flex-col" : "hidden sm:flex sm:flex-col"
        } border-l border-l-gray-300 border-r border-gray-300`}
      >
        {selectedConversation ? (
          <Chat setShowMobileChatView={setShowMobileChatView} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-bold">Let's Start!</h2>

                {conversations.length <= 0 ? (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/setupLiveChat${location.search}`)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-lg"
                    >
                      Setup Your Widget
                    </button>
                    <p className="text-sm md:text-base font-normal">
                      Configure the Chat Widget
                    </p>
                  </>
                ) : (
                  <span className="text-sm">
                    Select a chat to start conversation
                  </span>
                )}
              </div>
              <img
                className="w-28 h-28 object-fill"
                src={LIVE_CHAT_ICON}
                alt="logo"
              />
            </div>
          </div>
        )}
      </div>
      <div
        style={{ flex: 1 }}
        className={`hidden ${selectedConversation ? "md:flex" : "hidden"}`}
      >
        <Profile fetchConversations={fetchConversations} />
      </div>
    </div>
  );
};

export default LiveChatPage;
