import {
  ArrowDownCircle,
  Ban,
  Check,
  CheckCheck,
  MoreVertical,
  Send,
} from "lucide-react";
import { TiMessages } from "react-icons/ti";
import { IoSearch } from "react-icons/io5";
import { GoArrowLeft } from "react-icons/go";
import useData from "./data";
import Profile from "../../components/Profile";
import { getFormatedDate, identifyFileType } from "../../utils/common";
import { Badge, Button, Spinner, TextInput } from "flowbite-react";
import EmojiPickerModal from "../../components/Modals/EmojiPickerModal";
import { colors } from "../../utils/constants";
import SenderIdModal from "../../components/Modals/SenderIdModal";
import TemplateModal from "../../components/Modals/TemplateModal";
import AttachmentModal from "../../components/Modals/AttachmentModal";
import CreateContactModal from "../../components/Modals/CreateContactModal";
import SearchContactModal from "../../components/Modals/SearchContactModal";

//
import { contactStatusData } from "../../constants";

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
    setShowMobileChatView,
    setPageNumber,
    setSearchedContacts,
    setShowContactStatus,
    setContactStatusVal,
    handleTextareaChange,
    handleSendMessage,
    autoTopToBottomScroll,
    handleChangeReadStatus,
  } = useData();
  const {
    token,
    rows,
    message,
    contacts,
    currentContact,
    chats,
    sendMsgLoading,
    selectedTemplate,
    searchInput,
    mediaLink,
    requiredMediaType,
    lastMessageRef,
    contactProfileDetails,
    showMobileChatView,
    whatsTimer,
    chatLoading,
    contactLoading,
    searchedContacts,
    showContactStatus,
    contactStatusVal,
    readStatus,
    userProfileInfo,
  } = state;

  return (
    <div className="relative">
      <div className="flex fixed top-0 left-0 right-0 bottom-0">
        <div
          className={`${
            showMobileChatView ? "hidden sm:flex sm:flex-col" : ""
          } contactContainer borderRight  min-h-screen`}
        >
          {/* header */}
          <div className="borderBottom h-14  bg-white flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <img
                className="w-7 h-7 object-contain rounded-full"
                src={userProfileInfo?.profilePic}
                alt="Rounded avatar"
              />
              <h2 className="text-sm font-semibold text-black">
                {userProfileInfo?.company}
              </h2>
            </div>
            <div className="flex items-center gap-4 relative">
              <SearchContactModal
                token={token}
                setCurrentContact={setCurrentContact}
              />
              <CreateContactModal token={token} />

              <button
                className="-mr-3"
                onClick={() => setShowContactStatus(!showContactStatus)}
              >
                <MoreVertical size={20} />
              </button>

              {showContactStatus && (
                <div className="absolute -right-1 top-7 bg-white w-32 z-50 border border-gray-300 rounded-md p-1">
                  <div className="flex flex-col text-sm">
                    {contactStatusData?.map((item, index) => (
                      <span
                        key={index}
                        className={`p-2 hover:bg-gray-100 rounded-md cursor-pointer ${
                          contactStatusVal === item
                            ? "bg-blue-500 text-white"
                            : ""
                        }`}
                        onClick={() => {
                          setContactStatusVal(item);
                          setShowContactStatus(false);
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* searchbar */}
          <div className="mx-3 my-3 relative">
            <TextInput
              id="search"
              type="text"
              icon={IoSearch}
              placeholder="Search conversation.."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            {searchInput && searchedContacts?.length > 0 && (
              <div className="absolute top-[50px] left-0 w-full max-h-[80vh] overflow-y-auto custom-scrollbar bg-white  border border-gray-300 shadow-sm z-50">
                <div className="flex flex-col gap-2 p-2">
                  {searchedContacts?.map((item, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          let currentCont = {
                            contact: item?.phone,
                            conversationId: item?.conversationId,
                            name: `${item?.fname} ${item?.lname}`,
                          };
                          setSearchInput("");
                          setSearchedContacts([]);
                          setCurrentContact(currentCont);
                        }}
                        className="flex items-center gap-4 px-2 py-2 cursor-pointer hover:bg-gray-100 rounded-md"
                      >
                        <img
                          className="w-8 h-8 rounded-full"
                          src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"
                          alt="Rounded avatar"
                        />
                        <div className="flex flex-col w-full">
                          <span className="text-sm font-semibold">{`${item?.fname} ${item?.lname}`}</span>
                          <span className="text-xs">{item?.phone}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* contacts */}
          <div className="overflow-y-auto h-[80vh] custom-scrollbar p-2 space-y-2">
            {contacts?.length === 0 && (
              <div>
                <span className="text-sm">No Conctats</span>
              </div>
            )}
            {contacts?.map((item: any, index: number) => {
              const formatedDate = getFormatedDate(item?.date);
              return (
                <div
                  key={index}
                  onClick={() => {
                    setCurrentContact(item);
                    setShowMobileChatView(true);
                  }}
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
                        {item?.name !== "" && item?.name !== " "
                          ? item?.name
                          : `+${item?.contact}`}
                      </h3>
                      <span className="text-xs">{formatedDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs">
                        {item?.msg?.length > 30
                          ? `${item?.msg.slice(0, 30)}...`
                          : item?.msg}
                      </p>
                      <span className="text-xs"></span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* load more button */}
            <div className="flex items-center justify-center my-3">
              <button
                className="text-xs border border-gray-300 bg-gray-50  rounded-3xl px-4 py-2"
                disabled={contactLoading}
                onClick={() => setPageNumber((page) => page + 1)}
              >
                {contactLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          </div>
        </div>
        <div
          className={`chatContainer ${
            showMobileChatView ? "flex flex-col" : "hidden"
          }  borderRight sm:flex flex-col scrollbar-none relative`}
        >
          {!currentContact ? (
            <div className="w-full h-full bg-white">
              <NoChatSelected />
            </div>
          ) : (
            <>
              {/* chat container header */}
              <div className="borderBottom h-14 bg-white px-4 py-3 flex items-center justify-between sticky top-0 left-0 right-0 z-50">
                <div className="flex items-center space-x-4">
                  <div
                    className="flex sm:hidden"
                    onClick={() => setShowMobileChatView(false)}
                  >
                    <GoArrowLeft size={20} />
                  </div>
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
                  {whatsTimer && <Badge color="success">Live</Badge>}

                  {/* <MoreVertical size={22} /> */}
                </div>
              </div>

              {/* all chats */}
              <div className="p-3 flex-1">
                {chatLoading ? (
                  <div>
                    <div className="flex items-center justify-center">
                      <Badge
                        color="warning"
                        size="sm"
                        className="inline-block px-4 py-1"
                      >
                        Loading...
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-y-auto overflow-x-hidden h-full custom-scrollbar flex flex-col justify-end">
                    {chats?.map((chat: any, index: number) => {
                      const formatedDate = getFormatedDate(chat?.date);
                      const fileType = identifyFileType(chat?.media);
                      const imageLink =
                        fileType === "image" ? chat?.media : null;
                      const videoLink =
                        fileType === "video" ? chat?.media : null;
                      const docLink =
                        fileType === "document" ? chat?.media : null;
                      const unknownLink =
                        fileType === "unknown" ? chat?.media : null;

                      const isLastMessage = index === chats.length - 1;
                      return (
                        <div key={index}>
                          {isLastMessage && <div ref={lastMessageRef}></div>}
                          {chat?.log === "INCOMING" ? (
                            <div className="my-2">
                              {/* incomming */}
                              <div className="w-5/6 text-xs bg-white  p-4 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl border border-gray-300">
                                <p className="mb-1">@{chat?.fromnumber}</p>
                                <p>{chat?.msg}</p>
                                {imageLink && (
                                  <a href={imageLink} target="_blank">
                                    <div className="my-3">
                                      <img
                                        src={imageLink}
                                        alt="image"
                                        className="w-full max-h-80 object-cover rounded-md my-2"
                                      />
                                    </div>
                                  </a>
                                )}

                                {videoLink && (
                                  <div className="my-3">
                                    <video className="w-full" controls>
                                      <source
                                        src={videoLink}
                                        type="video/mp4"
                                      />
                                      Your browser does not support the video
                                      tag.
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
                                  <a href={imageLink} target="_blank">
                                    <div className="my-3">
                                      <img
                                        src={imageLink}
                                        alt="image"
                                        className="w-full max-h-80 object-cover rounded-md my-2"
                                      />
                                    </div>
                                  </a>
                                )}

                                {videoLink && (
                                  <div className="my-3">
                                    <video className="w-full" controls>
                                      <source
                                        src={videoLink}
                                        type="video/mp4"
                                      />
                                      Your browser does not support the video
                                      tag.
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
                                      <CheckCheck size={16} color="#4085f5" />
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
                )}
              </div>
              {/* input message box */}
              <div
                className={`p-3  bg-gray-100 sticky bottom-0 left-0 right-0`}
              >
                <div className="flex items-center justify-between">
                  <span></span>
                  <div
                    className="cursor-pointer mb-2"
                    onClick={autoTopToBottomScroll}
                  >
                    <ArrowDownCircle size={20} color="gray" />
                  </div>
                </div>
                <div className=" bg-white px-4 py-2 rounded-md border border-gray-200 hover:border hover:border-blue-500 hover:ring-1 hover:ring-blue-500">
                  <textarea
                    className="w-full bg-transparent border-none outline-none text-xs overflow-y-auto scrollbar-none rounded-md"
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
        <div
          className={`profileContainer ${
            currentContact ? "hidden sm:flex" : "hidden"
          }  flex-col p-4`}
        >
          <Profile contactProfileDetails={contactProfileDetails} />
          <div>
            <button
              onClick={() => {
                const data = {
                  conId: currentContact?.conversationId,
                  id: readStatus ? "0" : "1",
                  token,
                  tab: "primary",
                };
                handleChangeReadStatus(data);
              }}
              className="border border-gray-300 w-full text-start text-sm text-red-500 font-medium py-2 px-4 rounded-md bg-gray-50"
            >
              {`Mark as ${readStatus ? "Unread" : "Read"}`}
            </button>
          </div>
        </div>
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
