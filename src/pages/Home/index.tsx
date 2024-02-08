import {
  Ban,
  Check,
  CheckCheck,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  SendHorizonal,
  UserPlus,
} from "lucide-react";
import { TiMessages } from "react-icons/ti";
import DocViewer from "react-doc-viewer";
import { IoSearch } from "react-icons/io5";
import ReactPlayer from "react-player/lazy";
import useData from "./data";
import Profile from "../../components/Profile";
import { getFormatedDate, identifyFileType } from "../../utils/common";
import { Button, Spinner, TextInput, Textarea } from "flowbite-react";
import EmojiPickerModal from "../../components/Modals/EmojiPickerModal";
import { colors } from "../../utils/constants";
import SenderIdModal from "../../components/Modals/SenderIdModal";
import TemplateModal from "../../components/Modals/TemplateModal";
import AttachmentModal from "../../components/Modals/AttachmentModal";
import CreateContactModal from "../../components/Modals/CreateContactModal";

// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../store";

const Home = () => {
  const {
    state,
    setMessage,
    setCurrentContact,
    setSelectedEmoji,
    setSelectedSenderId,
    setSelectedTemplate,
    setSearchInput,
    setMediaLink,
    handleTextareaChange,
    handleSendMessage,
  } = useData();
  const {
    token,
    rows,
    messagesEndRef,
    message,
    contacts,
    currentContact,
    chats,
    selectedEmoji,
    sendMsgLoading,
    selectedSenderId,
    selectedTemplate,
    searchInput,
    mediaLink,
    requiredMediaType,
    lastMessageRef,
    contactProfileDetails,
  } = state;

  return (
    <div className="flex">
      <div className="contactContainer borderRight  min-h-screen">
        {/* header */}
        <div className="borderBottom  bg-white flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <img
              className="w-8 h-8 rounded-full"
              src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"
              alt="Rounded avatar"
            />
            <h2 className="text-base font-semibold text-black">
              Prateek Bansal
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* <Search size={20} color="black" /> */}
            <CreateContactModal token={token} />
          </div>
        </div>

        {/* searchbar */}
        <div className="mx-3 my-3">
          <TextInput
            id="search"
            type="text"
            icon={IoSearch}
            placeholder="Search contact.."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* contacts */}
        <div className="overflow-y-auto h-screen custom-scrollbar p-2">
          {contacts.map((item: any) => {
            const formatedDate = getFormatedDate(item?.date);
            return (
              <div
                key={item?.conversationId}
                onClick={() => setCurrentContact(item)}
                className={`flex items-center gap-4 p-3 cursor-pointer rounded-md hover:bg-gray-200 ${
                  currentContact?.conversationId === item?.conversationId &&
                  "bg-gray-200"
                }`}
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"
                  alt="Rounded avatar"
                />
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">
                      {item?.name !== "" ? item?.name : `+${item?.contact}`}
                    </h3>
                    <span className="text-xs">{formatedDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs">
                      {item?.msg?.length > 30
                        ? `${item?.msg.slice(0, 30)}...`
                        : item?.msg}
                    </p>
                    <span className="text-xs">29</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="chatContainer  hidden borderRight sm:flex flex-col scrollbar-none relative">
        {!currentContact ? (
          <div className="w-full h-full bg-white">
            <NoChatSelected />
          </div>
        ) : (
          <>
            {/* chat container header */}
            <div className="borderBottom bg-white px-4 py-3 flex items-center justify-between sticky top-0 left-0 right-0 z-50">
              <div className="flex items-center space-x-4">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"
                  alt="Rounded avatar"
                />
                <h2 className="text-base font-semibold text-black">
                  {currentContact?.name !== ""
                    ? currentContact?.name
                    : `+${currentContact?.contact}`}
                </h2>
              </div>

              <div>
                <MoreVertical size={22} />
              </div>
            </div>

            {/* all chats */}
            <div className="p-3 flex-1">
              <div className="overflow-y-auto overflow-x-hidden h-full custom-scrollbar flex flex-col justify-end">
                {chats?.map((chat: any, index: number) => {
                  const formatedDate = getFormatedDate(chat?.date);
                  const fileType = identifyFileType(chat?.media);
                  const imageLink = fileType === "image" ? chat?.media : null;
                  const videoLink = fileType === "video" ? chat?.media : null;
                  const docLink = fileType === "document" ? chat?.media : null;
                  const unknownLink =
                    fileType === "unknown" ? chat?.media : null;
                  return (
                    <div key={index}>
                      {chat?.log === "INCOMING" ? (
                        <div className="my-2">
                          {/* incomming */}
                          <div className="w-5/6 text-xs bg-white  p-4 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl border border-gray-300">
                            <p className="mb-1">@{chat?.fromnumber}</p>
                            <p>{chat?.msg}</p>
                            {imageLink && (
                              <div className="my-3">
                                <img
                                  src={imageLink}
                                  alt="image"
                                  className="w-full max-h-80 object-cover rounded-md my-2"
                                />
                              </div>
                            )}

                            {videoLink && (
                              <div className="my-3">
                                <video className="w-full" controls>
                                  <source src={videoLink} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            )}

                            {(docLink || unknownLink) && (
                              <div className="my-3">
                                <a
                                  href={docLink || unknownLink}
                                  target="_blank"
                                  className={`${
                                    chat?.channel === "sms"
                                      ? "bg-blue-600"
                                      : "bg-green-600"
                                  } text-white px-5 py-2 rounded-md font-semibold`}
                                >
                                  View File
                                </a>
                              </div>
                            )}

                            <div className="flex justify-end">
                              <div className="flex items-center space-x-3 text-xs mt-2">
                                <span>
                                  {chat?.channel === "whatsapp"
                                    ? "WhatsApp"
                                    : "SMS"}
                                </span>
                                <span>{formatedDate}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="my-2 flex justify-end">
                          {/* outgoing */}
                          <div
                            style={{
                              backgroundColor:
                                chat?.channel === "sms"
                                  ? colors.primary
                                  : colors.whatsapp,
                            }}
                            className="w-5/6  text-xs text-white p-4 rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl"
                          >
                            <p>{chat?.msg}</p>
                            {imageLink && (
                              <div className="my-3">
                                <img
                                  src={imageLink}
                                  alt="image"
                                  className="w-full max-h-80 object-cover rounded-md my-2"
                                />
                              </div>
                            )}

                            {videoLink && (
                              <div className="my-3">
                                <video className="w-full" controls>
                                  <source src={videoLink} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            )}

                            {(docLink || unknownLink) && (
                              <div className="my-3">
                                <a
                                  href={docLink || unknownLink}
                                  target="_blank"
                                  className={`${
                                    chat?.channel === "sms"
                                      ? "bg-blue-600"
                                      : "bg-green-600"
                                  } text-white px-5 py-2 rounded-md font-semibold`}
                                >
                                  View File
                                </a>
                              </div>
                            )}
                            <div className="flex justify-end">
                              <div className="flex items-center space-x-3">
                                <span>{formatedDate}</span>

                                {chat?.deliveryStatus === "read" ||
                                chat?.deliveryStatus === "delivered" ? (
                                  <CheckCheck size={16} />
                                ) : chat?.deliveryStatus === "sent" ||
                                  chat?.deliveryStatus === "submitted" ||
                                  chat?.deliveryStatus === "queued" ? (
                                  <Check size={16} />
                                ) : (
                                  <Ban size={16} />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* <div ref={messagesEndRef} /> */}
              </div>
            </div>
            {/* <div className="flex-1"></div> */}
            {/* input message box */}
            <div className={`p-3  bg-gray-100 sticky bottom-0 left-0 right-0`}>
              <div className=" bg-white px-4 py-2 rounded-md border border-gray-200 hover:border hover:border-blue-500 hover:ring-1 hover:ring-blue-500">
                <textarea
                  className="w-full bg-transparent border-none outline-none text-xs overflow-y-auto scrollbar-none"
                  placeholder="Write a Message..."
                  value={message}
                  onChange={handleTextareaChange}
                  rows={rows}
                />

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-3">
                    <SenderIdModal
                      token={token}
                      setSelectedSenderId={setSelectedSenderId}
                    />
                    <AttachmentModal
                      mediaLink={mediaLink}
                      setMediaLink={setMediaLink}
                    />
                    <TemplateModal
                      token={token}
                      message={message}
                      setMessage={setMessage}
                      selectedTemplate={selectedTemplate}
                      setSelectedTemplate={setSelectedTemplate}
                    />
                    <EmojiPickerModal
                      setSelectedEmoji={setSelectedEmoji}
                      setMessage={setMessage}
                    />

                    <div>
                      {!mediaLink &&
                        selectedTemplate &&
                        selectedTemplate?.headertype !== "" &&
                        selectedTemplate?.headertype !== "TEXT" && (
                          <span className="text-red-500 tracking-tight text-xs">
                            {requiredMediaType} attachment required
                          </span>
                        )}
                    </div>
                  </div>
                  <div>
                    {/* send message button */}

                    <Button
                      size="xs"
                      color="blue"
                      onClick={handleSendMessage}
                      className="p-1"
                    >
                      {sendMsgLoading ? (
                        <Spinner
                          color="info"
                          aria-label="Send-message-loading"
                          size="sm"
                        />
                      ) : (
                        <Send color="white" size={20} />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="profileContainer hidden sm:flex flex-col p-4">
        <Profile contactProfileDetails={contactProfileDetails} />
      </div>
    </div>
  );
};

const NoChatSelected = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-500 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 here ❄</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};

export default Home;
