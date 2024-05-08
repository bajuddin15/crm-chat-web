import { Paperclip } from "lucide-react";
import { MdSend } from "react-icons/md";
import { AVATAR_IMG } from "../../../../assets/images";
import useData from "./data";
import { colors } from "../../../../utils/constants";
import ChatBubble from "./Components/ChatBubble";
import EmojiPickerModal from "../../../../components/Modals/EmojiPickerModal";
import { useSocketContext } from "../../../../context/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Tooltip } from "flowbite-react";

const Chat = () => {
  const {
    state,
    setMessage,
    setSelectedEmoji,
    handleChangeMessage,
    handleSendMessage,
    handleFileChange,
  } = useData();
  const {
    message,
    messages,
    lastMessageRef,
    selectedConversation,
    // selectedFile,
    fileType,
    sendMsgLoading,
  } = state;

  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(selectedConversation._id);
  const usersTypingMap = useSelector(
    (state: RootState) => state.store.usersTypingStatus
  );

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* chat header */}
      <div className="flex items-center h-[52px] p-3 bg-white border-b border-b-gray-300">
        <div className="flex items-center gap-3">
          <img
            className="w-8 h-8 rounded-full"
            src={AVATAR_IMG}
            alt="profile-image"
          />

          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {selectedConversation?.fullName}
            </span>
            {isOnline && (
              <span className="text-[12px] font-normal text-gray-500">
                {usersTypingMap[selectedConversation?._id]
                  ? "typing..."
                  : "Online"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* chats */}
      <div
        style={{ scrollbarWidth: "none" }}
        className="bg-white flex-1 flex flex-col justify-between h-full overflow-y-auto px-3 py-2"
      >
        <div></div>
        <div>
          {messages?.map((item, index) => {
            return (
              <div
                key={index}
                ref={index === messages.length - 1 ? lastMessageRef : null}
              >
                <ChatBubble item={item} />
              </div>
            );
          })}
        </div>
      </div>

      {/* input */}
      {sendMsgLoading && (
        <div className="flex items-center gap-4 px-4 py-2 border-t border-t-gray-300">
          <span className="text-sm">Sending {fileType}, please wait...</span>
        </div>
      )}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-4 px-4 py-2 bg-white border-t border-t-gray-300"
      >
        <div>
          {/* Hidden file input */}
          <input
            type="file"
            id="fileInput"
            accept="image/*, video/*, .pdf, .doc, .docx"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {/* Trigger file input click when paperclip is clicked */}
          <Tooltip content="Max Size: 10 MB" style="light">
            <label className="cursor-pointer" htmlFor="fileInput">
              <Paperclip size={20} />
            </label>
          </Tooltip>
        </div>

        <div className="flex-1">
          <input
            type="text"
            className="w-full text-sm border-none outline-none bg-inherit focus:ring-0"
            placeholder="Write a message..."
            value={message}
            onChange={handleChangeMessage}
          />
        </div>
        <EmojiPickerModal
          setSelectedEmoji={setSelectedEmoji}
          setMessage={setMessage}
          color="black"
        />
        <button type="submit">
          <MdSend size={20} color={message ? colors.primary : "black"} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
