import { AVATAR_IMG } from "../../assets/images";
import VoiceCall from "../../components/VoiceCall/VoiceCall";
import { Button, Spinner, Tooltip, Badge } from "flowbite-react";
import { MdLabel } from "react-icons/md";
import { FaCircleUser, FaUser } from "react-icons/fa6";
import {
  ArrowDownCircle,
  Ban,
  Check,
  CheckCheck,
  ChevronDown,
  Send,
} from "lucide-react";
import { getOwnerNameSlice } from "../../constants";
import { IoCheckmark } from "react-icons/io5";
import {
  formatDateOfChat,
  getFullName,
  identifyFileType,
  transformLinks,
} from "../../utils/common";
import { colors } from "../../utils/constants";
import SenderIdModal from "../../components/Modals/SenderIdModal";
import AttachmentModal from "../../components/Modals/AttachmentModal";
import TemplateModal from "../../components/Modals/TemplateModal";
import EmojiPickerModal from "../../components/Modals/EmojiPickerModal";
import useData from "./data";
import MergeVariableModal from "../../components/Modals/MergeVariableModal";
import HtmlRenderer from "../../components/Common/HtmlRenderer";

const ChatViewPage = () => {
  const {
    state,
    setMessage,
    setSelectedEmoji,
    setSelectedSenderId,
    setSelectedTemplate,
    setMediaLink,
    setShowTeamMembers,
    setSelectedTeamMember,
    setLabel,
    handleTextareaChange,
    handleSendMessage,
    autoTopToBottomScroll,
    handleAssignConversation,
    handleAddLabel,
    handleExistingFilteredLabels,
    handleAssignLabel,
  } = useData();
  const {
    token,
    teamEmail,
    phone,
    rows,
    message,
    currentContact,
    chats,
    sendMsgLoading,
    selectedTemplate,
    mediaLink,
    requiredMediaType,
    lastMessageRef,
    whatsTimer,
    chatLoading,
    teamMembers,
    showTeamMembers,
    selectedTeamMember,
    label,
    addLabelLoading,
    assignLabelLoading,
    selectedSenderId,
    creditCount,
    totalCharacters,
    voiceEnableNumber,
    contactProfileDetails,
  } = state;

  // badge show
  const whats = new Date(whatsTimer); // Convert the string to a Date object
  const currentTime = new Date(); // Current time
  const timeDifference = currentTime.getTime() - whats.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);
  const showBadge = hoursDifference < 24;

  const handleNavigateToCallHistory = (
    token: string,
    teamEmail: string,
    phoneNumber: string
  ) => {
    const url = `https://calling.crm-messaging.cloud/callLogs?token=${token}&team=${teamEmail}&phone=${phoneNumber}`;
    window.location.href = url;
  };

  return (
    <div className="relative h-screen custom-scrollbar bg-gray-100 overflow-y-auto overflow-x-hidden">
      {/* chat container header */}
      <div className="borderBottom h-14 bg-white px-4 py-3 flex items-center justify-between sticky top-0 left-0 right-0 z-50">
        <div className="flex items-center space-x-4">
          <img
            className="w-8 h-8 rounded-full"
            src={AVATAR_IMG}
            alt="avatar-img"
          />
          <h2 className="text-base font-semibold text-black">
            {getFullName(
              contactProfileDetails?.fname,
              contactProfileDetails?.lname
            ) || contactProfileDetails?.phone}
          </h2>

          <VoiceCall devToken={token} currentContact={currentContact} />
        </div>

        <div className="hidden md:flex items-center gap-4">
          {voiceEnableNumber && (
            <button
              style={{ backgroundColor: colors.primary }}
              className="text-white text-sm py-[6px] px-3 rounded-md hover:opacity-90"
              onClick={() =>
                handleNavigateToCallHistory(
                  token as string,
                  teamEmail,
                  phone as string
                )
              }
            >
              Call history
            </button>
          )}
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
                  <span className="text-sm font-medium">{"Creating"}</span>
                  <span className="mx-2 mt-1">
                    <MdLabel size={24} color="#fcba03" />
                  </span>
                  <span className="text-sm">{label}</span>
                </div>

                <hr />
                <div className="flex flex-col gap-2">
                  {handleExistingFilteredLabels(label)?.map((item: any) => {
                    return (
                      <div
                        key={item?.labelId}
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
                  })}
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
                      currentContact?.ownerName || selectedTeamMember?.name
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
                  {teamMembers?.map((item: any, index: number) => {
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
          {whatsTimer && showBadge && <Badge color="success">Live</Badge>}
        </div>
      </div>

      {/* all chats */}
      <div className="pb-36 px-5">
        {chatLoading ? (
          <div className="mt-5 flex items-center justify-center">
            <Badge color="warning" size="sm" className="inline-block px-4 py-1">
              Loading...
            </Badge>
          </div>
        ) : (
          <div className="flex flex-col justify-end mb-5">
            {chats?.map((chat: any, index: number) => {
              const formatedDate = formatDateOfChat(chat?.date);
              const fileType = identifyFileType(chat?.media);
              const imageLink = fileType === "image" ? chat?.media : null;
              const videoLink = fileType === "video" ? chat?.media : null;
              const docLink = fileType === "document" ? chat?.media : null;
              const unknownLink = fileType === "unknown" ? chat?.media : null;

              const isLastMessage = index === chats.length - 1;
              const linkColor = chat?.log === "INCOMING" ? "blue" : "white";
              const message = transformLinks(chat?.msg, linkColor);
              return (
                <div key={index}>
                  {isLastMessage && <div ref={lastMessageRef}></div>}
                  {chat?.log === "INCOMING" ? (
                    <div className="my-2  flex flex-col space-y-1">
                      {/* incomming */}
                      <div className="w-5/6 md:w-1/3 text-xs bg-white  p-4 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl border border-gray-300 break-words">
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
                      </div>

                      <div className="flex justify-start ml-2">
                        <div className="flex items-center space-x-3 text-xs">
                          <span className="text-[10px]">{formatedDate}</span>
                          <span className="text-[10px]">
                            {chat?.channel === "whatsapp" ? "WhatsApp" : "SMS"}
                          </span>
                          <span className="text-[10px]">@{chat?.tonumber}</span>
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
                          className="w-5/6 md:w-1/3  text-xs text-white p-4 rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl break-words"
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
                        </div>
                      </div>

                      <div className="flex justify-end mt-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-[10px]">
                            @{chat?.fromnumber}
                          </span>
                          <span className="text-[10px]">{formatedDate}</span>

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
      <div className={`p-3  bg-gray-100 fixed bottom-0 left-0 right-0`}>
        <div className="flex items-center justify-between">
          <span></span>
          <div className="cursor-pointer mb-2" onClick={autoTopToBottomScroll}>
            <ArrowDownCircle size={20} color="gray" />
          </div>
        </div>
        <div className="bg-white px-4 py-2 rounded-md border border-gray-300 hover:border hover:border-blue-500 hover:ring-1 hover:ring-blue-500">
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

              <MergeVariableModal setMessage={setMessage} />

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
    </div>
  );
};

export default ChatViewPage;
