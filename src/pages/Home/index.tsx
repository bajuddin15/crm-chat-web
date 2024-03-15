import {
  ArrowDownCircle,
  Ban,
  Check,
  CheckCheck,
  ChevronRight,
  MoreVertical,
  Send,
} from "lucide-react";
import { TiMessages } from "react-icons/ti";
import { IoSearch } from "react-icons/io5";
import { GoArrowLeft } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import useData from "./data";
import Profile from "../../components/Profile";
import {
  getFormatedDate,
  getFullName,
  getUnreadMsgCountByCid,
  identifyFileType,
} from "../../utils/common";
import { Badge, Button, Spinner, TextInput } from "flowbite-react";
import EmojiPickerModal from "../../components/Modals/EmojiPickerModal";
import { colors } from "../../utils/constants";
import SenderIdModal from "../../components/Modals/SenderIdModal";
import TemplateModal from "../../components/Modals/TemplateModal";
import AttachmentModal from "../../components/Modals/AttachmentModal";
import CreateContactModal from "../../components/Modals/CreateContactModal";
import SearchContactModal from "../../components/Modals/SearchContactModal";
import APP_LOGO from "../../assets/images/app_logo.png";

//
import { contactStatusData } from "../../constants";
import ViewAllTags from "../../components/ViewAllTags";
import ViewAllNotes from "../../components/ViewAllNotes";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

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
    setShowTagsComp,
    setShowNotesComp,
    setTagValue,
    setNoteValue,
    handleTextareaChange,
    handleSendMessage,
    autoTopToBottomScroll,
    handleChangeReadStatus,
    handleChangeArchive,
    handleAddTag,
    handleAddNote,
    handleDeleteTag,
    handleDeleteNote,
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
    archiveStatus,
    showTagsComp,
    showNotesComp,
    tags,
    notes,
    tagValue,
    noteValue,
  } = state;

  const unreadMsgs = useSelector(
    (state: RootState) => state.store.unreadMessages
  );

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
                src={
                  userProfileInfo?.profilePic
                    ? userProfileInfo?.profilePic
                    : APP_LOGO
                }
                alt="Rounded avatar"
              />
              <h2 className="text-sm font-semibold text-black">
                {userProfileInfo?.company?.length > 14
                  ? userProfileInfo?.company?.slice(0, 14)
                  : userProfileInfo?.company}
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
            {!contactLoading && contacts?.length === 0 && (
              <div className="flex items-center justify-center">
                <span className="text-sm">No Conversations</span>
              </div>
            )}
            {contacts?.map((item: any, index: number) => {
              const formatedDate = getFormatedDate(item?.date);
              const unreadMsgCount = getUnreadMsgCountByCid(
                unreadMsgs,
                item?.conversationId,
                item?.contact
              );
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
                      <div>
                        {item?.isRead === "0" && (
                          <span
                            style={{ backgroundColor: colors.whatsapp }}
                            className="text-[9px] text-white w-4 h-4 flex items-center justify-center rounded-full"
                          >
                            {unreadMsgCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* load more button */}
            <div className="flex items-center justify-center my-3">
              {contacts?.length > 0 && contacts?.length % 20 === 0 && (
                <button
                  className="text-xs border border-gray-300 bg-gray-50  rounded-3xl px-4 py-2"
                  disabled={contactLoading}
                  onClick={() => setPageNumber((page) => page + 1)}
                >
                  {contactLoading ? "Loading..." : "Load More"}
                </button>
              )}
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
                    {currentContact?.name
                      ? currentContact?.name
                      : `+${currentContact?.contact}`}
                  </h2>
                </div>

                <div>{whatsTimer && <Badge color="success">Live</Badge>}</div>
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
                            <div className="my-2  flex flex-col space-y-1">
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
                              </div>

                              <div className="flex justify-start ml-2">
                                <div className="flex items-center space-x-3 text-xs">
                                  <span className="text-[10px]">
                                    {formatedDate}
                                  </span>
                                  <span className="text-[10px]">
                                    {chat?.channel === "whatsapp"
                                      ? "WhatsApp"
                                      : "SMS"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="my-2">
                              {/* outgoing */}
                              <div className="flex justify-end">
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
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <div className="flex items-center space-x-3">
                                  <span className="text-[10px]">
                                    {formatedDate}
                                  </span>

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
                    className="w-full bg-transparent border-none outline-none focus:ring-0 text-xs overflow-y-auto scrollbar-none rounded-md"
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
          }  flex-col`}
        >
          {showTagsComp ? (
            <ViewAllTags
              token={token || ""}
              conversationId={currentContact?.conversationId}
              setShowTagsComp={setShowTagsComp}
            />
          ) : showNotesComp ? (
            <ViewAllNotes
              token={token || ""}
              conversationId={currentContact?.conversationId}
              setShowNotesComp={setShowNotesComp}
            />
          ) : (
            <>
              <Profile
                token={token || ""}
                setCurrentContact={setCurrentContact}
              />
              <div className="space-y-4 px-4 pb-4 h-[100vh - 56px] overflow-y-auto custom-scrollbar">
                <div className="border border-gray-300 p-4 my-5 rounded-xl">
                  <div className="flex items-center gap-4 pb-4">
                    <img
                      className="w-7 h-7 rounded-full"
                      src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"
                      alt="Rounded avatar"
                    />
                    <span className="text-sm font-semibold">
                      {getFullName(
                        contactProfileDetails?.fname,
                        contactProfileDetails?.lname
                      ) || contactProfileDetails?.phone}
                    </span>
                  </div>
                  <hr />
                  <div className="flex flex-col gap-4 px-2 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Phone:</span>
                      <span className="text-xs">
                        {contactProfileDetails?.phone}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Email:</span>
                      <span className="text-xs break-words">
                        {contactProfileDetails?.email}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Consent:</span>
                      <span className="text-xs">
                        {contactProfileDetails?.opt_in === "1"
                          ? "Opted In"
                          : "Opted Out"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* add tag */}
                <div className="border border-gray-300 p-4 rounded-xl">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Tags</span>
                    </div>
                    <div className="flex">
                      <input
                        className="text-sm w-full bg-inherit focus:ring-0 bg-blue-100 rounded-tl-md rounded-bl-md border border-blue-300"
                        type="text"
                        placeholder="Add your tag here"
                        value={tagValue}
                        onChange={(e) => setTagValue(e.target.value)}
                      />
                      <button
                        onClick={handleAddTag}
                        className="uppercase text-xs px-2 bg-blue-500 text-white rounded-tr-md rounded-br-md"
                      >
                        Add
                      </button>
                    </div>

                    {/* recent tag show */}
                    {tags?.length === 0 ? (
                      <div className="bg-blue-100 px-5 py-5 rounded-xl">
                        <span className="text-sm">No tags available</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-blue-200 rounded-xl">
                        <div className="text-sm space-y-1 bg-blue-50 w-full p-3 rounded-tl-xl rounded-bl-xl">
                          <p>{tags[0]?.tag}</p>
                          <div className="flex items-center justify-between">
                            <div></div>
                            <span>{tags[0]?.created_at}</span>
                          </div>
                        </div>
                        <div
                          className="cursor-pointer p-2"
                          onClick={() =>
                            handleDeleteTag(
                              tags[0]?.id,
                              token || "",
                              currentContact?.conversationId
                            )
                          }
                        >
                          <MdDelete size={20} />
                        </div>
                      </div>
                    )}

                    <div
                      onClick={() => setShowTagsComp(true)}
                      className="flex items-center justify-between text-sm cursor-pointer"
                    >
                      <span className="text-sm text-gray-500">Show Tags</span>
                      <ChevronRight size={18} color="gray" />
                    </div>
                  </div>
                </div>
                <div className="border border-gray-300 p-4 rounded-xl">
                  <div className="flex flex-col space-y-4">
                    <span className="text-sm">Notes</span>
                    <div className="flex">
                      <input
                        className="text-sm w-full bg-inherit focus:ring-0 bg-blue-100 rounded-tl-md rounded-bl-md border border-blue-300"
                        type="text"
                        placeholder="Add your note here"
                        value={noteValue}
                        onChange={(e) => setNoteValue(e.target.value)}
                      />
                      <button
                        onClick={handleAddNote}
                        className="uppercase text-xs px-2 bg-blue-500 text-white rounded-tr-md rounded-br-md"
                      >
                        Add
                      </button>
                    </div>

                    {/* recent note show */}
                    {notes?.length === 0 ? (
                      <div className="bg-blue-100 px-5 py-5 rounded-xl">
                        <span className="text-sm">No notes available</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-blue-200 rounded-xl">
                        <div className="text-sm space-y-1 bg-blue-50 w-full p-3 rounded-tl-xl rounded-bl-xl">
                          <p>{notes[0].note}</p>
                          <div className="flex items-center justify-between">
                            <div></div>
                            <span>{notes[0]?.created_at}</span>
                          </div>
                        </div>
                        <div
                          className="cursor-pointer p-2"
                          onClick={() =>
                            handleDeleteNote(
                              notes[0]?.id,
                              token || "",
                              currentContact?.conversationId
                            )
                          }
                        >
                          <MdDelete size={20} />
                        </div>
                      </div>
                    )}

                    <div
                      onClick={() => setShowNotesComp(true)}
                      className="flex items-center justify-between text-sm cursor-pointer"
                    >
                      <span className="text-sm text-gray-500">Show Notes</span>
                      <ChevronRight size={18} color="gray" />
                    </div>
                  </div>
                </div>
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
                  className="border border-gray-300 w-full text-start text-sm text-red-500 font-medium py-[10px] px-4 rounded-md bg-gray-50"
                >
                  {`Mark as ${readStatus ? "Unread" : "Read"}`}
                </button>
                <button
                  onClick={() => handleChangeArchive(token || "")}
                  className="border border-gray-300 w-full text-start text-sm text-red-500 font-medium py-[10px] px-4 rounded-md bg-gray-50"
                >
                  {archiveStatus ? "Unarchive" : "Archive"}
                </button>
              </div>
            </>
          )}
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
