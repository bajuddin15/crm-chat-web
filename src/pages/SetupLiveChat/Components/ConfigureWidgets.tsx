import { MoveDownLeft, MoveDownRight, Paperclip, Send, X } from "lucide-react";
import React from "react";
import { BsInfoCircleFill } from "react-icons/bs";
import { colors } from "../../../utils/constants";
import useData from "../data";
import { Button, FileInput, Label, Radio } from "flowbite-react";
import axios from "axios";
import { LIVE_CHAT_API_URL } from "../../../constants";
import toast from "react-hot-toast";
import { getProfileByToken } from "../../../api";
import {
  extractUsername,
  setJwtTokenInLocalStorage,
} from "../../../utils/common";
import { useAuthContext } from "../../../context/AuthContext";

type WidgetAlignment = "left" | "right";
type Availability = "default" | "always";

interface IState {
  crmToken: string;
  color: string;
  alignment: WidgetAlignment;
  availability: Availability;
  emailNotifications: boolean;
  autoReply: boolean;
  scriptCode: string;
}

const ConfigureWidgets = ({ setActiveTab }: { setActiveTab: any }) => {
  const { token, userProfileInfo } = useData();

  const { setAuthUser } = useAuthContext();
  const [disableSaveBtn, setDisableSaveBtn] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [state, setState] = React.useState<IState>({
    crmToken: token || "",
    color: "2046D0",
    alignment: "right",
    availability: "always",
    emailNotifications: true,
    autoReply: false,
    scriptCode: `<script
    type="text/javascript"
    async
    defer
    src="https://cdn.jsdelivr.net/gh/njaiswal78/live-chat-widget/chatWidgetScript.js?crmToken=${token}"
    ></script>`,
  });
  const [adminDetail, setAdminDetail] = React.useState<any>(null);

  const [profileName, setProfileName] = React.useState<string>("");
  const [profilePic, setProfilePic] = React.useState<File | null>(null);
  const [profilePicUrl, setProfilePicUrl] = React.useState<string>("");

  const handleAuthAdmin = async (profilePicture: string) => {
    if (!token) return;
    try {
      // crmToken, fullName, username, password, profilePic
      const resData = await getProfileByToken(token);
      if (resData && resData?.status === 200) {
        const authInfo = resData?.data;
        const formData = {
          crmToken: token,
          fullName: profileName || `${authInfo?.fname} ${authInfo?.lname}`,
          username: extractUsername(authInfo?.email) || authInfo?.phone,
          password: authInfo?.phone,
          profilePic: profilePicture || authInfo?.profilePic,
          plan: authInfo?.plan,
        };
        const headers = {
          "Content-Type": "application/json",
        };

        const { data } = await axios.post(
          `${LIVE_CHAT_API_URL}/api/v1/auth/loginAdmin`,
          formData,
          { headers }
        );

        if (data && data?.success) {
          let authInfo = data?.data;
          setJwtTokenInLocalStorage(authInfo?.token);
          setAuthUser(data?.data);
        }
      }
    } catch (error: any) {
      console.log("Auth Error : ", error.message);
    }
  };

  const handleCreateConfig = async () => {
    try {
      setLoading(true);
      let newProfilePic = "";
      if (profilePic) {
        const formData = new FormData();
        formData.append("file", profilePic);
        const { data } = await axios.post(
          `${LIVE_CHAT_API_URL}/api/v1/uploadFile`,
          formData
        );
        if (data && data?.url) {
          newProfilePic = data?.url;
        }
      }
      if (!adminDetail) {
        // admin not exist, means first time user
        handleAuthAdmin(newProfilePic);
      } else {
        // admin already exist

        // if user want to change fullName or profilePic
        if ((newProfilePic || profileName !== adminDetail?.fullName) && token) {
          const formData = {
            fullName: profileName,
            profilePic: newProfilePic,
          };
          await axios.put(
            `${LIVE_CHAT_API_URL}/api/v1/users/editAdminUser/?crmToken=${token}`,
            formData
          );
        }
      }

      const formData = { ...state, color: `#${state.color}` };
      const { data } = await axios.post(
        `${LIVE_CHAT_API_URL}/api/v1/widgetConfig/create`,
        formData
      );
      if (data && data?.success) {
        setActiveTab("botSettings");
        toast.success(data?.message);
      }
    } catch (error: any) {
      console.log("Error : ", error.messsage);
    } finally {
      setDisableSaveBtn(true);
      setLoading(false);
    }
  };

  const handleAvailabilityChange = (value: Availability) => {
    setState({ ...state, availability: value });
    setDisableSaveBtn(false);
  };

  const handleEmailNotificationsChange = (value: boolean) => {
    setState({ ...state, emailNotifications: value });
    setDisableSaveBtn(false);
  };
  const handleAutoReplyChange = (value: boolean) => {
    setState({ ...state, autoReply: value });
    setDisableSaveBtn(false);
  };

  const fetchAdminDetails = async (token: string) => {
    try {
      const { data } = await axios.get(
        `${LIVE_CHAT_API_URL}/api/v1/users/admin/?crmToken=${token}`
      );
      if (data && data?.success) {
        let pic = data?.data?.profilePic || userProfileInfo?.profilePic;
        let name =
          data?.data?.fullName ||
          `${userProfileInfo?.fname}  ${userProfileInfo?.lname}`;
        setAdminDetail(data?.data);
        setProfileName(name);
        setProfilePicUrl(pic);
      }
    } catch (error: any) {
      console.log("Error: ", error?.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfilePic(file);
      setDisableSaveBtn(false);
    }
  };

  React.useEffect(() => {
    const fetchWidgetConfig = async (token: string) => {
      try {
        const { data } = await axios.get(
          `${LIVE_CHAT_API_URL}/api/v1/widgetConfig/${token}`
        );
        if (data && data?.success) {
          const emailNotifications = data?.data?.notifications?.email;
          if (data?.data?.color[0] === "#") {
            setState({
              ...data?.data,
              color: data?.data?.color.substring(1),
              emailNotifications,
            });
          } else {
            setState({ ...data?.data, emailNotifications });
          }
        }
      } catch (error: any) {
        console.log("Error in fetch widget config : ", error.message);
      }
    };
    if (token) {
      fetchWidgetConfig(token);
      fetchAdminDetails(token);
    }
  }, [token]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full h-full pb-3">
      <div className="space-y-5">
        <h2 className="text-base font-semibold">Display</h2>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Profile Name</span>
            <BsInfoCircleFill size={15} color="gray" className="mt-1" />
          </div>
          <input
            className="w-1/2 border border-gray-400 mt-2 rounded-md py-[8px] text-sm"
            type="text"
            placeholder=""
            value={profileName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setProfileName(e.target.value);
              setDisableSaveBtn(false);
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Profile Picture</span>
            <BsInfoCircleFill size={15} color="gray" className="mt-1" />
          </div>
          <FileInput
            id="file-upload"
            accept="image/*"
            className="w-1/2 mt-2 rounded-md"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Color</span>
            <BsInfoCircleFill size={15} color="gray" className="mt-1" />
          </div>
          <span className="text-sm">Choose an accent color</span>

          <div className="flex items-center gap-3 my-3">
            {(window.innerWidth > 600
              ? ["eb4034", "2046D0", "25D366", "eba234", "e80c6b"]
              : ["eb4034", "2046D0", "25D366"]
            ).map((color, index) => (
              <div
                key={index}
                style={{ backgroundColor: `#${color}` }}
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => {
                  setState({ ...state, color });
                  setDisableSaveBtn(false);
                }}
              ></div>
            ))}

            <div className="flex items-center gap-2">
              <span>#</span>
              <input
                className="border border-gray-500 text-sm w-20 py-2 px-3 rounded-md outline-none bg-gray-100 focus:ring-0"
                type="text"
                value={state.color}
                onChange={(e: any) => {
                  setState({ ...state, color: e.target.value });
                  setDisableSaveBtn(false);
                }}
              />
              <div
                style={{ backgroundColor: `#${state.color}` }}
                className="w-10 h-10 rounded-full"
              ></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Chat widget placement</span>
            <BsInfoCircleFill size={15} color="gray" className="mt-1" />
          </div>
          <span className="text-sm">
            Decide what side of your website you would like your chat widget to
            appear on.
          </span>

          <div className="flex items-center gap-4 my-3">
            <div
              onClick={() => {
                setState({ ...state, alignment: "left" });
                setDisableSaveBtn(false);
              }}
              className={`flex items-center gap-2 border-2  p-4 rounded-md ${
                state.alignment === "left"
                  ? "bg-blue-50 border-blue-500"
                  : "border-gray-300"
              }`}
            >
              <div
                className={`p-1 border-2 ${
                  state.alignment === "left"
                    ? "border-blue-500"
                    : "border-gray-300"
                } rounded-md`}
              >
                <MoveDownLeft size={18} color={colors.primary} />
              </div>
              <span className="text-sm text-gray-600 font-medium">Left</span>
            </div>
            <div
              onClick={() => {
                setState({ ...state, alignment: "right" });
                setDisableSaveBtn(false);
              }}
              className={`flex items-center gap-2 border-2 p-4 rounded-md ${
                state.alignment === "right"
                  ? "bg-blue-50 border-blue-500"
                  : "border-gray-300"
              }`}
            >
              <div
                className={`p-1 border-2 ${
                  state.alignment === "right"
                    ? "border-blue-500"
                    : "border-gray-300"
                } rounded-md`}
              >
                <MoveDownRight size={18} color={colors.primary} />
              </div>
              <span className="text-sm text-gray-600 font-medium">Right</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <fieldset className="flex max-w-md flex-col gap-4">
            <legend className="mb-4">Channel availability</legend>
            <div className="flex items-center gap-2">
              <Radio
                id="default"
                name="default"
                value="default"
                checked={state.availability === "default"}
                onChange={() => handleAvailabilityChange("default")}
              />
              <div className="flex flex-col">
                <Label htmlFor="default">Based on user availability</Label>
                <span className="text-xs">
                  Chat is available when at least one user in this inbox is set
                  to available.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Radio
                id="always"
                name="always"
                value="always"
                checked={state.availability === "always"}
                onChange={() => handleAvailabilityChange("always")}
              />
              <div className="flex flex-col">
                <Label htmlFor="always">Chat is available 24/7</Label>
                <span className="text-xs">
                  Chat is available on everyday 24/7 hours.
                </span>
              </div>
            </div>
          </fieldset>
          <fieldset className="flex max-w-md flex-col gap-4">
            <legend className="mb-4">Email Notifications</legend>
            <div className="flex items-center gap-2">
              <Radio
                id="all-emails"
                name="email-notifications"
                value="all-emails"
                checked={state.emailNotifications === true ? true : false}
                onChange={() => handleEmailNotificationsChange(true)}
              />
              <div className="flex flex-col">
                <Label htmlFor="all-emails">
                  Receive incoming chat replies on email
                </Label>
                <span className="text-xs">
                  You will receive email notifications for all activities.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Radio
                id="no-emails"
                name="email-notifications"
                value="no-emails"
                checked={state.emailNotifications === true ? false : true}
                onChange={() => handleEmailNotificationsChange(false)}
              />
              <div className="flex flex-col">
                <Label htmlFor="no-emails">
                  Don't receive email notification
                </Label>
                <span className="text-xs">
                  You will not receive any email notifications for live chat.
                </span>
              </div>
            </div>
          </fieldset>
          {/* for auto reply feature */}
          <fieldset className="flex max-w-md flex-col gap-4">
            <legend className="mb-4">Auto Reply Settings</legend>

            {/* Option 1: Enable Auto Reply */}
            <div className="flex items-center gap-2">
              <Radio
                id="enable-auto-reply"
                name="auto-reply"
                value="enable-auto-reply"
                checked={state.autoReply === true}
                onChange={() => handleAutoReplyChange(true)}
              />
              <div className="flex flex-col">
                <Label htmlFor="enable-auto-reply">Enable Auto Reply</Label>
                <span className="text-xs">
                  Automatically send replies to incoming chats when you're
                  unavailable.
                </span>
              </div>
            </div>

            {/* Option 2: Disable Auto Reply */}
            <div className="flex items-center gap-2">
              <Radio
                id="disable-auto-reply"
                name="auto-reply"
                value="disable-auto-reply"
                checked={state.autoReply === false}
                onChange={() => handleAutoReplyChange(false)}
              />
              <div className="flex flex-col">
                <Label htmlFor="disable-auto-reply">Disable Auto Reply</Label>
                <span className="text-xs">
                  Do not send automatic replies. You will need to manually reply
                  to chats.
                </span>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="py-4">
          <Button
            disabled={disableSaveBtn}
            onClick={handleCreateConfig}
            color="blue"
          >
            {loading ? "Please wait.." : "Save and Continue"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col">
        {/* preview chat widget */}
        <div className="w-full md:w-[360px] rounded-md flex flex-col justify-between shadow-md border-l border-l-gray-300 border-r border-r-gray-300">
          {/* header */}
          <div
            style={{ backgroundColor: `#${state.color}` }}
            className="h-[65px] px-4 py-3 flex items-center justify-between rounded-tl-md rounded-tr-md"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  className="w-9 h-9 rounded-full"
                  src={
                    profilePic ? URL.createObjectURL(profilePic) : profilePicUrl
                  }
                  alt="profile-pic"
                />
                <span className="bottom-0 start-6 absolute w-[10px] h-[10px] bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-white font-semibold">
                  {profileName}
                </span>
                <span className="text-xs text-white">
                  We typically reply in a few minutes
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 h-[360px]">
            <div className="flex flex-col w-[85%] leading-1.5 px-3 py-2 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
              <p className="text-sm font-normal text-gray-900 dark:text-white">
                Hi there! Let me know if you have any questions about the
                product or pricing.
              </p>
            </div>
          </div>

          {/* footer */}
          <div className="bg-white rounded-bl-md rounded-br-md flex items-center h-[56px] px-5 border-t border-t-gray-300 border-b border-b-gray-300 z-50">
            <span className="w-full text-sm text-gray-500">
              Write a message
            </span>
            <div className="flex items-center gap-4">
              <Paperclip size={20} />
              <Send size={20} />
            </div>
          </div>
        </div>

        <div
          className={`w-full md:w-[360px] flex items-center ${
            state.alignment === "right" ? "justify-end" : "justify-start"
          }`}
        >
          <button
            style={{ backgroundColor: `#${state.color}` }}
            className="p-3 rounded-full inline-block mt-5 transition-opacity duration-500 ease-in-out"
          >
            <X size={22} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigureWidgets;
