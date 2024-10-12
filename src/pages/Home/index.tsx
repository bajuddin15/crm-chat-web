import {
  ArrowDownCircle,
  Ban,
  Bot,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Send,
  UserPlus,
  X,
  CircleCheckBig,
  Flag,
  Mail,
  PhoneCall,
  Calendar,
  Utensils,
} from "lucide-react";
import { TiMessages } from "react-icons/ti";
import { IoCheckmark, IoSearch } from "react-icons/io5";
import { GoArrowLeft } from "react-icons/go";
import { MdDelete, MdLabel } from "react-icons/md";
import { FaCircleUser, FaUser } from "react-icons/fa6";
import useData from "./data";
import Profile from "../../components/Profile";
import {
  formatDateOfChat,
  getFormatedDate,
  getFullName,
  getUnreadMsgCountByCid,
  identifyFileType,
  transformLinks,
  // trimCompanyName,
} from "../../utils/common";
import { Badge, Button, Spinner, TextInput, Tooltip } from "flowbite-react";
import EmojiPickerModal from "../../components/Modals/EmojiPickerModal";
import { colors } from "../../utils/constants";
import SenderIdModal from "../../components/Modals/SenderIdModal";
import TemplateModal from "../../components/Modals/TemplateModal";
import AttachmentModal from "../../components/Modals/AttachmentModal";
import SearchContactModal from "../../components/Modals/SearchContactModal";
import APP_LOGO from "../../assets/images/app_logo.png";

import { getOwnerNameSlice } from "../../constants";
import ViewAllTags from "../../components/ViewAllTags";
import ViewAllNotes from "../../components/ViewAllNotes";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SidebarDrawer from "../../components/SidebarDrawer";
import EditContactInfo from "../../components/Modals/EditContactInfo";
import VoiceCall from "../../components/VoiceCall/VoiceCall";
import { AVATAR_IMG } from "../../assets/images";
import MergeVariableModal from "../../components/Modals/MergeVariableModal";
import HtmlRenderer from "../../components/Common/HtmlRenderer";
import CreateTaskModal from "../../components/Modals/CreateTaskModal";
import moment from "moment";
import ViewAllTasks from "../../components/ViewAllTasks";
import EmailTemplatesModal from "../../components/Modals/EmailTemplatesModal";
import ShortUrlModal from "../../components/Modals/ShortUrlModal";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    // setShowContactStatus,
    setContactStatusVal,
    setShowTagsComp,
    setShowNotesComp,
    setTagValue,
    setNoteValue,
    setShowTeamMembers,
    setSelectedTeamMember,
    setLabel,
    setShowDeleteLabelId,
    setSelectedFilterLabelId,
    setSelectedFilterOwnerId,
    setContactProfileDetails,
    setShowAllTasksComp,
    handleTextareaChange,
    handleSendMessage,
    autoTopToBottomScroll,
    handleChangeReadStatus,
    handleChangeArchive,
    handleAddTag,
    handleAddNote,
    handleDeleteTag,
    handleDeleteNote,
    handleAssignConversation,
    handleAddLabel,
    handleDeleteLabel,
    handleExistingFilteredLabels,
    handleAssignLabel,
    generateComposeMessage,
    fetchTasksForConversation,
    handleCloseOpenTask,
    handleDeleteTask,
  } = useData();
  const {
    token,
    teamEmail,
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
    // showContactStatus,
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
    teamMembers,
    showTeamMembers,
    selectedTeamMember,
    label,
    addLabelLoading,
    allLabels,
    showDeleteLabelId,
    labelsOfToken,
    assignLabelLoading,
    selectedSenderId,
    creditCount,
    totalCharacters,
    isGeneratingAiMsg,
    tasks,
    showAllTasksComp,
  } = state;

  const unreadMsgs = useSelector(
    (state: RootState) => state.store.unreadMessages
  );

  const currentUrl = window.location.href; // Get the current URL
  const url = currentUrl.split("?"); // split url
  const baseUrl = url[0]; // Extract base URL
  const extraUrl = url[1]; // Extract query URL

  // badge show
  const whats = new Date(whatsTimer); // Convert the string to a Date object
  const currentTime = new Date(); // Current time
  const timeDifference = currentTime.getTime() - whats.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);
  const showBadge = hoursDifference < 24;

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
                {userProfileInfo?.company}
              </h2>
            </div>
            <div className="flex items-center gap-4 relative">
              <SearchContactModal
                token={token}
                setCurrentContact={setCurrentContact}
              />
              <Link to={`${baseUrl}newMessage/?${extraUrl}`}>
                <div className="cursor-pointer">
                  <UserPlus size={18} color="black" />
                </div>
              </Link>
              {/* <CreateContactModal token={token} /> */}

              <SidebarDrawer
                allLabels={labelsOfToken}
                teamMembers={teamMembers}
                contactStatusVal={contactStatusVal}
                setContactStatusVal={setContactStatusVal}
                setSelectedFilterLabelId={setSelectedFilterLabelId}
                setSelectedFilterOwnerId={setSelectedFilterOwnerId}
              />

              <div className="flex md:hidden">
                <Profile
                  type="onlyBell"
                  token={token || ""}
                  setCurrentContact={setCurrentContact}
                />
              </div>

              {/* <button
                className="-mr-3"
                onClick={() => setShowContactStatus(!showContactStatus)}
              >
                <MoreVertical size={20} />
              </button> */}

              {/* {showContactStatus && (
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
              )} */}
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
                          src={AVATAR_IMG}
                          alt="Rounded avatar"
                        />
                        <div className="flex flex-col w-full">
                          <span className="text-sm font-semibold">
                            {getFullName(item?.fname, item?.lname)}
                          </span>
                          <span
                            className={
                              getFullName(item?.fname, item?.lname)
                                ? "text-xs"
                                : "text-sm font-semibold"
                            }
                          >
                            {item?.phone}
                          </span>
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
            {contactLoading && (
              <div className="flex items-center justify-center -mt-2">
                <Badge
                  color="warning"
                  size="sm"
                  className="inline-block px-4 text-[13px]"
                >
                  Loading...
                </Badge>
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
                    src={AVATAR_IMG}
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
              {contacts?.length > 0 && contacts?.length > 10 && (
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
                    src={AVATAR_IMG}
                    alt="avatar-img"
                  />
                  <h2 className="text-base font-semibold text-black">
                    {currentContact?.name &&
                    currentContact?.name !== " " &&
                    currentContact?.name !== "null null" &&
                    currentContact?.name !== "undefined undefined"
                      ? currentContact?.name
                      : `+${currentContact?.contact}`}
                  </h2>

                  <VoiceCall devToken={token} currentContact={currentContact} />
                </div>

                <div className="hidden md:flex items-center gap-4">
                  <div className="relative">
                    <div>
                      <input
                        className="text-sm outline-none p-1 focus:ring-0 border-t-0 border-l-0 border-r-0 border-b-2 border-b-gray-500 border-dotted text-gray-600 italic"
                        type="text"
                        placeholder="Add label to conversation"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                      />
                    </div>

                    {label && (
                      <div className="absolute top-10 left-0 bg-white z-50 w-52 p-2 border border-gray-300 space-y-2">
                        <div
                          style={{
                            display: "inline-flex", // Add this line
                            scrollbarWidth: "none",
                          }}
                          className="w-full overflow-x-auto border border-gray-300 py-1 px-2 rounded-md flex items-center cursor-pointer hover:bg-gray-100"
                          onClick={() =>
                            handleAddLabel(
                              token || "",
                              currentContact?.conversationId,
                              label
                            )
                          }
                        >
                          {addLabelLoading && (
                            <Spinner
                              color="info"
                              aria-label="Info spinner loading"
                              size="sm"
                              className="mr-2 mb-1"
                            />
                          )}
                          <span className="text-sm font-medium">
                            {"Creating"}
                          </span>
                          <span className="mx-2 mt-1">
                            <MdLabel size={24} color="#fcba03" />
                          </span>
                          <span className="text-sm">{label}</span>
                        </div>

                        <hr />
                        <div className="flex flex-col gap-2">
                          {handleExistingFilteredLabels(label)?.map(
                            (item, index: number) => {
                              return (
                                <div
                                  key={index}
                                  className="flex items-center cursor-pointer"
                                  onClick={() =>
                                    handleAssignLabel(
                                      token || "",
                                      currentContact?.conversationId,
                                      item?.label
                                    )
                                  }
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
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {teamEmail && (
                    <div className="relative">
                      <div
                        onClick={() => setShowTeamMembers(!showTeamMembers)}
                        className="bg-blue-100 flex items-center justify-between p-2 w-28 rounded-md cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FaUser size={16} color="gray" />
                          <span className="text-sm">
                            {getOwnerNameSlice(
                              selectedTeamMember?.name ||
                                currentContact?.ownerName
                            )}
                          </span>
                        </div>

                        <div className="">
                          <ChevronDown size={16} color="gray" />
                        </div>
                      </div>

                      {/* users for asign */}
                      {showTeamMembers && (
                        <div
                          style={{ scrollbarWidth: "none" }}
                          className="absolute top-9 right-0 flex flex-col gap-2 bg-white z-50 w-52 max-h-64 overflow-auto break-words border border-gray-300 p-2 rounded-md shadow-sm"
                        >
                          {teamMembers?.map((item, index) => {
                            if (!item?.name) return;
                            return (
                              <div
                                key={index}
                                onClick={() => {
                                  setSelectedTeamMember(item);
                                  handleAssignConversation(
                                    token || "",
                                    item?.email,
                                    currentContact?.conversationId,
                                    teamEmail
                                  );
                                }}
                                className={`bg-blue-50 ${
                                  selectedTeamMember &&
                                  selectedTeamMember?.email === item?.email
                                    ? "bg-blue-500 text-white"
                                    : ""
                                } p-2 rounded-md flex items-center justify-between cursor-pointer`}
                              >
                                <div className="flex items-center gap-3">
                                  <FaCircleUser
                                    size={18}
                                    color={
                                      selectedTeamMember &&
                                      selectedTeamMember?.email === item?.email
                                        ? "white"
                                        : "gray"
                                    }
                                  />
                                  <span className="text-sm">{item?.name}</span>
                                </div>
                                {selectedTeamMember &&
                                  selectedTeamMember?.email === item?.email && (
                                    <IoCheckmark size={14} color="white" />
                                  )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                  {whatsTimer && showBadge && (
                    <Badge color="success">Live</Badge>
                  )}
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
                      const formatedDate = formatDateOfChat(chat?.date);
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
                      const linkColor =
                        chat?.log === "INCOMING" ? "blue" : "white";
                      const message = transformLinks(chat?.msg, linkColor);
                      return (
                        <div key={index}>
                          {isLastMessage && <div ref={lastMessageRef}></div>}
                          {chat?.log === "INCOMING" ? (
                            <div className="my-2  flex flex-col space-y-1">
                              {/* incomming */}
                              <div className="w-5/6 text-xs bg-white  p-4 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl border border-gray-300 break-words">
                                <p className="mb-1">@{chat?.fromnumber}</p>
                                <HtmlRenderer htmlString={message} />
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
                                  <span className="text-[10px]">
                                    @{chat?.tonumber}
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
                                  className="w-5/6  text-xs text-white p-4 rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl break-words"
                                >
                                  <HtmlRenderer htmlString={message} />
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

                              <div className="flex justify-end mt-1">
                                <div className="flex items-center space-x-3">
                                  <span className="text-[10px]">
                                    @{chat?.fromnumber}
                                  </span>
                                  <span className="text-[10px]">
                                    {formatedDate}
                                  </span>

                                  <Tooltip
                                    content={chat?.deliveryStatus}
                                    style="light"
                                    className="mr-5"
                                  >
                                    {chat?.deliveryStatus === "read" ||
                                    chat?.deliveryStatus === "delivered" ||
                                    chat?.deliveryStatus === "played" ? (
                                      <CheckCheck
                                        size={16}
                                        color={
                                          chat?.deliveryStatus === "read"
                                            ? "#4085f5"
                                            : "#000"
                                        }
                                      />
                                    ) : chat?.deliveryStatus === "sent" ||
                                      chat?.deliveryStatus === "submitted" ||
                                      chat?.deliveryStatus === "queued" ||
                                      chat?.deliveryStatus === "accepted" ? (
                                      <Check size={16} />
                                    ) : (
                                      <Ban size={16} />
                                    )}
                                  </Tooltip>
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
                <div className="bg-white px-4 py-2 rounded-md border border-gray-200 hover:border hover:border-blue-500 hover:ring-1 hover:ring-blue-500">
                  <textarea
                    className="w-full bg-transparent border-none outline-none focus:ring-0 text-xs overflow-y-auto scrollbar-none rounded-md"
                    placeholder="Write a Message..."
                    value={message}
                    onChange={handleTextareaChange}
                    rows={rows}
                    disabled={selectedSenderId?.defaultChannel === "email"}
                  />

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center space-x-3">
                      <SenderIdModal
                        token={token}
                        setSelectedSenderId={setSelectedSenderId}
                      />

                      {selectedSenderId?.defaultChannel === "email" ? (
                        <EmailTemplatesModal
                          token={token as string}
                          currentContact={currentContact}
                          selectedSenderId={selectedSenderId}
                        />
                      ) : (
                        <>
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

                          <ShortUrlModal setMessage={setMessage} />

                          <MergeVariableModal setMessage={setMessage} />

                          <button
                            onClick={() =>
                              generateComposeMessage(currentContact)
                            }
                            disabled={isGeneratingAiMsg}
                            className="flex items-center gap-2"
                          >
                            <Bot color="gray" size={22} />

                            {isGeneratingAiMsg && (
                              <span className="text-sm text-blue-600">
                                Ai is generating message...
                              </span>
                            )}
                          </button>
                        </>
                      )}

                      <div>
                        {!mediaLink &&
                          selectedTemplate &&
                          selectedTemplate?.headertype &&
                          selectedTemplate?.headertype !== "none" &&
                          selectedTemplate?.headertype !== "NONE" &&
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
                        disabled={selectedSenderId?.defaultChannel === "email"}
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
                {/* max characters */}
                <div className="flex items-center justify-between text-gray-600">
                  <span className="text-xs font-normal">
                    Max Characters: {message?.length}/{totalCharacters}
                  </span>
                  {selectedSenderId?.defaultChannel === "sms" && (
                    <span className="text-sm font-normal">
                      Credit Count : {creditCount}
                    </span>
                  )}
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
          ) : showAllTasksComp ? (
            <>
              <ViewAllTasks
                token={token as string}
                tasks={tasks}
                setShowAllTasksComp={setShowAllTasksComp}
                handleCloseOpenTask={handleCloseOpenTask}
                handleDeleteTask={handleDeleteTask}
                fetchTasksForConversation={fetchTasksForConversation}
                currentContact={currentContact}
              />
            </>
          ) : (
            <>
              <Profile
                token={token || ""}
                setCurrentContact={setCurrentContact}
              />
              <div
                style={{ scrollbarWidth: "none" }}
                className="space-y-4 px-4 pb-4 h-[100vh - 56px] overflow-y-auto"
              >
                <div className="border border-gray-300 p-4 my-5 rounded-xl">
                  <div className="flex items-center gap-4 pb-4">
                    <img
                      className="w-7 h-7 rounded-full"
                      src={AVATAR_IMG}
                      alt="avatar-img"
                    />
                    <span className="text-sm font-semibold">
                      {getFullName(
                        contactProfileDetails?.fname,
                        contactProfileDetails?.lname
                      ) || contactProfileDetails?.phone}
                    </span>
                    <EditContactInfo
                      token={token}
                      contact={contactProfileDetails?.phone}
                      setContactProfileDetails={setContactProfileDetails}
                    />
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

                {/* tasks box */}
                <div className="border border-gray-300 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium">Tasks</h2>{" "}
                  </div>
                  <div className="mt-4 space-y-3">
                    {tasks
                      .filter((item) => !item?.completed)
                      .slice(0, 3)
                      .map((item) => {
                        return (
                          <div
                            key={item?._id}
                            className="flex items-center justify-between border border-gray-300 shadow-sm px-3 py-3 rounded-xl"
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                {item?.type === "To do" && (
                                  <CircleCheckBig size={18} />
                                )}
                                {item?.type === "Email" && <Mail size={18} />}
                                {item?.type === "Call" && (
                                  <PhoneCall size={18} />
                                )}
                                {item?.type === "Meeting" && (
                                  <Calendar size={18} />
                                )}
                                {item?.type === "Lunch" && (
                                  <Utensils size={18} />
                                )}
                                {item?.type === "Deadline" && (
                                  <Flag size={18} />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {item?.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {moment(item?.createdAt).format(
                                    "DD/MM/YYYY [at] HH:mm"
                                  )}
                                </span>
                              </div>
                            </div>
                            <div>
                              <button
                                onClick={() => handleCloseOpenTask(item?._id)}
                                className="text-sm border border-gray-300 hover:bg-gray-50 px-3 py-[6px] rounded-full"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        );
                      })}

                    {tasks.filter((item) => !item?.completed).length > 0 && (
                      <button
                        onClick={() => setShowAllTasksComp(true)}
                        className="w-full py-2 text-sm bg-blue-600 hover:bg-blue-600/90 text-white text-center rounded-xl shadow-sm cursor-pointer"
                      >
                        View All (
                        {tasks.filter((item) => !item?.completed).length})
                      </button>
                    )}
                    {currentContact && (
                      <CreateTaskModal
                        token={token as string}
                        currentContact={currentContact}
                        fetchTasksForConversation={fetchTasksForConversation}
                      />
                    )}
                  </div>
                </div>

                {/* add to workflow */}
                <div className="border border-gray-300 p-4 rounded-xl">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-sm font-medium">Add to workflows</h2>{" "}
                    <p className="text-xs text-gray-500">
                      Use workflows to automate actions for this project
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/workflow-memberships${location.search}`, {
                        state: {
                          currentContact,
                          contactProfileDetails,
                        },
                      })
                    }
                    className="w-full py-2 mt-5 text-sm bg-blue-600 hover:bg-blue-600/90 text-white text-center rounded-xl shadow-sm cursor-pointer"
                  >
                    Manage
                  </button>
                </div>

                {/* labels box */}
                {allLabels?.length > 0 && (
                  <div className="border border-gray-300 p-4 rounded-xl">
                    <h2 className="text-sm font-medium">Labels</h2>
                    <div className="flex flex-wrap gap-4 mt-5">
                      {allLabels?.map((item) => {
                        return (
                          <div
                            key={item?.labelId}
                            className="flex items-center gap-1 py-1 px-2 rounded-md"
                            onMouseEnter={() =>
                              setShowDeleteLabelId(item?.labelId)
                            }
                            onMouseLeave={() => setShowDeleteLabelId(null)}
                          >
                            <MdLabel size={22} color="#fcba03" />
                            <span className="text-sm">{item?.label}</span>
                            {showDeleteLabelId === item?.labelId && (
                              <div
                                className="cursor-pointer bg-white shadow-md p-[2px] rounded-full border border-gray-300"
                                onClick={() =>
                                  handleDeleteLabel(
                                    token || "",
                                    item?.labelId,
                                    item?.conversationId
                                  )
                                }
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
                          <p className="text-sm">{tags[0]?.tag}</p>
                          <div className="flex items-center justify-between">
                            <div></div>
                            <span className="text-xs">
                              {tags[0]?.created_at}
                            </span>
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
                          <p className="text-sm">{notes[0].note}</p>
                          <div className="flex items-center justify-between">
                            <div></div>
                            <span className="text-xs">
                              {notes[0]?.created_at}
                            </span>
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
