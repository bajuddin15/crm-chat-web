import { FaCommentSms, FaWhatsapp } from "react-icons/fa6";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import APP_LOGO from "../../assets/images/app_logo.png";
import useData from "./data";
import EmojiPickerModal from "../../components/Modals/EmojiPickerModal";
import AttachmentModal from "../../components/Modals/AttachmentModal";
import TemplateModal from "../../components/Modals/TemplateModal";
import { Send } from "lucide-react";
import { Spinner } from "flowbite-react";
import { PHONE_IMG1 } from "../../utils/constants";
import { identifyFileType } from "../../utils/common";
import ShortUrlModal from "../../components/Modals/ShortUrlModal";
import ScheduleMessage from "../../components/Modals/ScheduleMessage";

const NewMessage = () => {
  const {
    state,
    setPhoneNumber,
    setMessage,
    setMediaLink,
    setSelectedEmoji,
    setSelectedSenderId,
    setSelectedTemplate,
    setDate,
    setTime,
    handleChangeMessage,
    handleSubmit,
    handleScheduleMessage,
  } = useData();
  const {
    token,
    phoneNumber,
    message,
    mediaLink,
    requiredMediaType,
    userProfileInfo,
    senderIds,
    selectedSenderId,
    selectedTemplate,
    charactersCount,
    totalCharacters,
    creditCount,
    loading,
    date,
    time,
  } = state;

  const fileType = identifyFileType(mediaLink);
  const imageLink = fileType === "image" ? mediaLink : null;
  const videoLink = fileType === "video" ? mediaLink : null;
  // const docLink = fileType === "document" ? mediaLink : null;
  return (
    <div className="relative h-screen overflow-x-hidden overflow-y-auto">
      {/* header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 h-14 borderBottom flex items-center px-6">
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
      </div>

      {/* body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-6 mt-20">
        <div className="space-y-5 ">
          {/* form */}
          <div className="text-sm space-y-2">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <PhoneInput
              country={"us"}
              inputStyle={{ width: "100%" }}
              value={phoneNumber}
              onChange={(phoneVal) => setPhoneNumber(phoneVal)}
              enableSearch={true}
              disableSearchIcon={true}
              searchStyle={{ width: "100%" }}
            />
          </div>
          <div className="text-sm space-y-2">
            <label htmlFor="mobileNumber">From Number</label>
            <select
              id="chatStatus"
              className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => {
                let number = e.target.value;
                let findItem = senderIds?.find(
                  (item) => item?.number === number
                );
                setSelectedSenderId(findItem);
              }}
            >
              {senderIds?.map((item, index) => {
                return (
                  <option
                    key={index}
                    value={item?.number}
                    selected={selectedSenderId?.number === item?.number}
                  >
                    {item?.label ? item?.label : item?.number}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="text-sm space-y-2 flex flex-col">
            <label htmlFor="message">Message</label>
            <textarea
              name="message"
              id="message"
              rows={8}
              placeholder="Enter your message here..."
              className="focus:ring-0 bg-gray-100 p-2 text-sm placeholder:text-sm rounded-md"
              value={message}
              onChange={handleChangeMessage}
            ></textarea>
            <div className="flex items-center justify-between text-xs">
              <span>
                Max Characters : {charactersCount}/{totalCharacters}
              </span>
              {selectedSenderId?.defaultChannel === "sms" && (
                <span>Credit Count : {creditCount}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center -mt-1">
          {/* phone img */}
          <div className="hidden lg:flex lg:flex-col relative w-60 h-[440px]">
            <img
              src={PHONE_IMG1}
              alt="image"
              className="w-full h-full object-fill mb-52"
            />

            <div className="absolute top-[38px] left-[30px] w-[75%] flex flex-col">
              {imageLink && (
                <img
                  className="w-full h-32 object-fill rounded-xl"
                  src={mediaLink}
                  alt="mediaimg"
                />
              )}
              {videoLink && (
                <video className="w-full h-32" controls>
                  <source src={videoLink} type="video/mp4" />
                </video>
              )}
              <p
                style={{ scrollbarWidth: "none" }}
                className="flex flex-wrap text-xs text-black mt-1 mx-1 h-[235px] overflow-y-auto"
              >
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-100 px-6 flex  items-center justify-between">
        <div className="flex items-center gap-5 h-full">
          <div>
            {selectedSenderId?.defaultChannel === "whatsapp" ? (
              <FaWhatsapp size={20} color={"green"} />
            ) : (
              <FaCommentSms size={20} color={"blue"} />
            )}
          </div>
          <EmojiPickerModal
            setSelectedEmoji={setSelectedEmoji}
            setMessage={setMessage}
          />
          <AttachmentModal mediaLink={mediaLink} setMediaLink={setMediaLink} />
          <TemplateModal
            token={token}
            setMessage={setMessage}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />

          <ShortUrlModal setMessage={setMessage} />
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

        <div className="flex items-center gap-5 h-full">
          <ScheduleMessage
            date={date}
            time={time}
            setDate={setDate}
            setTime={setTime}
            handleScheduleMessage={handleScheduleMessage}
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center gap-2"
          >
            <span className="text-sm hidden sm:flex">Send</span>
            {loading ? (
              <Spinner
                color="info"
                aria-label="Send-message-loading"
                size="sm"
              />
            ) : (
              <Send size={18} color="white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewMessage;
