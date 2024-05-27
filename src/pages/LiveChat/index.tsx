import Chat from "./Components/Chat/Chat";
import Conversation from "./Components/Conversation/Conversation";
import Profile from "./Components/Profile/Profile";
import useData from "./data";

const LiveChatPage = () => {
  const { state, setShowMobileChatView } = useData();
  const { selectedConversation, showMobileChatView } = state;

  return (
    <div className="w-full h-screen flex bg-gray-100 overflow-hidden">
      <div
        style={{ flex: 1 }}
        className={`${showMobileChatView ? "hidden sm:flex sm:flex-col" : ""}`}
      >
        <Conversation setShowMobileChatView={setShowMobileChatView} />
      </div>
      <div
        style={{ flex: 3 }}
        className={`${
          showMobileChatView ? "flex flex-col" : "hidden sm:flex sm:flex-col"
        } border-l border-l-gray-300 border-r border-gray-300`}
      >
        {selectedConversation ? (
          <Chat setShowMobileChatView={setShowMobileChatView} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-sm py-2 px-3 rounded-full bg-white border border-gray-300">
              Select a chat to start messaging
            </span>
          </div>
        )}
      </div>
      <div
        style={{ flex: 1 }}
        className={`hidden ${selectedConversation ? "md:flex" : "hidden"}`}
      >
        <Profile />
      </div>
    </div>
  );
};

export default LiveChatPage;
