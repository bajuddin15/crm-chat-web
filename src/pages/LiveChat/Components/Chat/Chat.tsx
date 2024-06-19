import { ChevronDown, Paperclip } from "lucide-react";
import { MdLabel, MdSend } from "react-icons/md";
import { AVATAR_IMG } from "../../../../assets/images";
import useData from "./data";
import { colors } from "../../../../utils/constants";
import ChatBubble from "./Components/ChatBubble";
import EmojiPickerModal from "../../../../components/Modals/EmojiPickerModal";
import { useSocketContext } from "../../../../context/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Spinner, Tooltip } from "flowbite-react";
import { GoArrowLeft } from "react-icons/go";
import { FaCircleUser, FaUser } from "react-icons/fa6";
import { IoCheckmark } from "react-icons/io5";

interface IProps {
  setShowMobileChatView: any;
}

const Chat: React.FC<IProps> = ({ setShowMobileChatView }) => {
  const {
    state,
    setMessage,
    setSelectedEmoji,
    setShowTeamMembers,
    handleChangeMessage,
    handleSendMessage,
    handleFileChange,
    handleChangeLabelText,
    handleExistingFilteredLabels,
    handleAddLabel,
    handleAssignLabel,
    handleAssignConversation,
  } = useData();
  const {
    message,
    messages,
    lastMessageRef,
    selectedConversation,
    // selectedFile,
    fileType,
    sendMsgLoading,
    labelText,
    addLabelLoading,
    assignLabelLoading,
    teamMembers,
    showTeamMembers,
    teamEmail,
    assignedTeamMemberId,
  } = state;

  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(selectedConversation._id);
  const usersTypingMap = useSelector(
    (state: RootState) => state.store.usersTypingStatus
  );

  const getSelectedTeamMember = (assignedTeamMemberId: string) => {
    let teamMember = teamMembers?.find(
      (item: any) => item?.userId === assignedTeamMemberId
    );
    return teamMember;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* chat header */}
      <div className="flex items-center justify-between h-[52px] p-3 bg-white border-b border-b-gray-300">
        <div className="flex items-center gap-3">
          <div
            className="flex sm:hidden"
            onClick={() => setShowMobileChatView(false)}
          >
            <GoArrowLeft size={20} />
          </div>
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

        <div className="flex items-center gap-4">
          <div className="relative">
            <div>
              <input
                className="text-sm outline-none p-1 focus:ring-0 border-t-0 border-l-0 border-r-0 border-b-2 border-b-gray-500 border-dotted text-gray-600 italic"
                type="text"
                placeholder="Add label to conversation"
                value={labelText}
                onChange={handleChangeLabelText}
              />
            </div>

            {labelText && (
              <div className="absolute top-10 left-0 bg-white z-50 w-52 p-2 border border-gray-300 rounded-md shadow-md space-y-2">
                <div
                  style={{
                    display: "inline-flex", // Add this line
                    scrollbarWidth: "none",
                  }}
                  className="w-full overflow-x-auto border border-gray-300 shadow-sm py-1 px-2 rounded-md flex items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleAddLabel(labelText)}
                >
                  {addLabelLoading && (
                    <Spinner
                      color="info"
                      aria-label="Info spinner loading"
                      size="sm"
                      className="mr-2 mb-1"
                    />
                  )}
                  <span className="text-sm font-medium">{"Creating"}</span>
                  <span className="mx-2 mt-1">
                    <MdLabel size={24} color="#fcba03" />
                  </span>
                  <span className="text-sm">{labelText}</span>
                </div>

                <hr />
                <div className="flex flex-col gap-2">
                  {handleExistingFilteredLabels(labelText)?.map((item: any) => {
                    return (
                      <div
                        key={item?._id}
                        className="flex items-center cursor-pointer"
                        onClick={() => handleAssignLabel(item?._id)}
                      >
                        {assignLabelLoading && (
                          <Spinner
                            color="info"
                            aria-label="Info spinner loading"
                            size="sm"
                            className="mr-2 mb-1"
                          />
                        )}
                        <span className="mx-2 mt-1">
                          <MdLabel size={24} color="#fcba03" />
                        </span>
                        <span className="text-sm">{item?.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {teamEmail && (
            <div className="relative">
              <div
                onClick={() => setShowTeamMembers(!showTeamMembers)}
                className="bg-blue-100 flex items-center justify-between px-2 py-[6px] min-w-28 rounded-md cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FaUser size={14} color="gray" />
                  <span className="text-sm mb-[2px]">
                    {getSelectedTeamMember(assignedTeamMemberId)?.name}
                  </span>
                </div>

                <div className="ml-1">
                  <ChevronDown size={16} color="gray" />
                </div>
              </div>

              {/* users for asign */}
              {showTeamMembers && (
                <div
                  style={{ scrollbarWidth: "none" }}
                  className="absolute top-9 right-0 flex flex-col gap-2 bg-white z-50 w-52 max-h-64 overflow-auto break-words border border-gray-300 p-2 rounded-md shadow-sm"
                >
                  {teamMembers
                    .filter((item: any) => item?.userId)
                    ?.map((item: any, index: number) => {
                      if (!item?.name) return;
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            handleAssignConversation(item?.userId);
                          }}
                          className={`bg-blue-50 ${
                            assignedTeamMemberId === item?.userId
                              ? "bg-blue-500 text-white"
                              : ""
                          } p-2 rounded-md flex items-center justify-between cursor-pointer`}
                        >
                          <div className="flex items-center gap-3">
                            <FaCircleUser
                              size={18}
                              color={
                                assignedTeamMemberId === item?.userId
                                  ? "white"
                                  : "gray"
                              }
                            />
                            <span className="text-sm">{item?.name}</span>
                          </div>
                          {assignedTeamMemberId === item?.userId && (
                            <IoCheckmark size={14} color="white" />
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* chats */}
      <div
        style={{ scrollbarWidth: "none" }}
        className="bg-white flex-1 flex flex-col justify-between h-full overflow-y-auto px-3 py-2"
      >
        <div></div>
        <div>
          {messages?.map((item: any, index: number) => {
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
