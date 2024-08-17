import axios from "axios";
import { TelnyxRTC } from "@telnyx/webrtc";
import { Audio } from "@telnyx/react-client";
import { Device } from "@twilio/voice-sdk";
import { useEffect, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { ImPhoneHangUp } from "react-icons/im";
import { MdMoreVert, MdCall } from "react-icons/md";
import {
  DEVICE_STATUS,
  VOICE_API_BASE_URL,
  getTitleOfVoiceCall,
} from "../../constants";
import { ArrowLeft } from "lucide-react";
import { getProfileByToken, getSenderIds, getTeamMembers } from "../../api";
import PopupModal from "./Modals/PopupModal";
import toast from "react-hot-toast";
import { AVATAR_IMG } from "../../assets/images";
import { MyRoleData } from "../../types/types";
import { useSearchParams } from "react-router-dom";
import { decodeUrlString } from "../../utils/common";
import FreePlanModal from "./Modals/FreePlanModal";
import { ProviderName } from "./types";

interface IProps {
  devToken: any;
  currentContact: any;
}

const VoiceCall: React.FC<IProps> = ({ devToken, currentContact }) => {
  // const [clientName, setClientName] = useState("");
  const [searchParams] = useSearchParams();
  let teamEmail = searchParams.get("team") || "";
  teamEmail = decodeUrlString(teamEmail);
  const [incomingCallNumber, setIncomingCallNumber] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [log, setLog] = useState([]);
  const [speakerDevices, setSpeakerDevices] = useState<MediaDeviceInfo[]>([]);
  const [ringtoneDevices, setRingtoneDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedSpeakerDevice, setSelectedSpeakerDevice] = useState("");
  const [selectedRingtoneDevice, setSelectedRingtoneDevice] = useState("");

  // telnyx webrtc
  const [rtcClient, setRtcClient] = useState<TelnyxRTC | null>(null);
  const [allProviders, setAllProviders] = useState<any[]>([]);
  const [providerName, setProviderName] = useState<ProviderName>("twillio");

  const [token, setToken] = useState<string | null>(null);
  const [device, setDevice] = useState<undefined | Device>();
  const [outgoingCall, setOutgoingCall] = useState<any>(null);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [incomingCallAccepted, setIncomingCallAccepted] =
    useState<boolean>(false);
  const [outgoingCallAccepted, setOutgoingCallAccepted] =
    useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [showAudioDevicesView, setShowAudioDevicesView] = useState("");
  const [showSettingsView, setShowSettingsView] = useState<boolean>(false);

  const [providerNumber, setProviderNumber] = useState<any>("");
  const [isFreePlan, setIsFreePlan] = useState<boolean>(false);

  useEffect(() => {
    setPhoneNumber(currentContact?.contact);
  }, [currentContact]);

  // MAKE AN OUTGOING CALL
  const makeOutgoingCall = async () => {
    if (!phoneNumber) {
      console.log("Please enter a phone Number for outgoing call.");
    }
    if (!device) {
      toast.error("Device is not ready for making calls");
      console.log("Device not ready!");
    }
    const params = {
      To: phoneNumber[0] === "+" ? phoneNumber : `+${phoneNumber}`,
      Provider_Number:
        providerNumber[0] === "+" ? providerNumber : `+${providerNumber}`,
    };
    if (device) {
      console.log(`Attempting to call ${phoneNumber} ...`);
      // Twilio.Device.connect() returns a Call object
      const call: any = await device.connect({ params });
      setOutgoingCall(call);

      // add listeners to the Call
      // "accepted" means the call has finished connecting and the state is now "open"
      call.on("accept", acceptOutgoingCall);
      call.on("disconnect", disconnectedOutgoingCall);
      call.on("cancel", disconnectedOutgoingCall);

      // hangup call means cut call
    } else {
      console.log("Unable to make call.");
    }
  };

  const acceptOutgoingCall = (call: any) => {
    // Call is accepted and it is in progress
    console.log("Call is accepted and it is in progress", call);
    // we can update ui
    setOutgoingCallAccepted(true); // we can update ui after outgoing call accepted
  };
  const disconnectedOutgoingCall = () => {
    // Call disconnected..
    console.log("Call disconnected..");
    // we can update ui
    setOutgoingCall(null);
    setOutgoingCallAccepted(false); // disconnect outgoing call so update ui with this parameter
    setCallDuration(0);
  };

  const outgoingCallHangup = (call: any) => {
    console.log("Hanging up ...");
    call.disconnect();

    // Inform Twilio about call hangup
    if (call) {
      call.disconnect();
    }

    setOutgoingCall(null);
    setOutgoingCallAccepted(false); // disconnect outgoing call so update ui with this parameter
    setCallDuration(0);
  };

  // HANDLE INCOMING CALL
  const handleIncomingCall = (call: any) => {
    console.log(`Incoming call from ${call.parameters.From}`);

    //show incoming call div and incoming phone number
    setIncomingCall(call);
    setIncomingCallNumber(call?.parameters?.From);

    //add event listeners for Accept, Reject, and Hangup buttons
    // add event listener to call object
    // call.on("cancel", handleDisconnectedIncomingCall); // it is creating problem in incoming ui
    call.on("disconnect", handleDisconnectedIncomingCall);
    call.on("reject", handleDisconnectedIncomingCall);
  };

  // ACCEPT INCOMING CALL
  const acceptIncomingCall = (call: any) => {
    call.accept();

    // update ui
    console.log("Accepted incoming call.");
    setIncomingCall(call);
    setIncomingCallAccepted(true);
  };

  // REJECT INCOMING CALL
  const rejectIncomingCall = (call: any) => {
    call.reject();
    console.log("Rejected incoming call");

    // reset incomming call ui
    resetIncomingCallUI();
  };

  // HANG UP INCOMING CALL
  const hangupIncomingCall = (call: any) => {
    call.disconnect();
    console.log("Hanging up incoming call");

    // reset incomming call ui
    resetIncomingCallUI();
  };

  // HANDLE CANCELLED INCOMING CALL
  const handleDisconnectedIncomingCall = () => {
    console.log("Incoming call ended.");

    // reset incomming call ui
    resetIncomingCallUI();
  };

  const resetIncomingCallUI = () => {
    setIncomingCall(null);
    setIncomingCallAccepted(false);
    setCallDuration(0);
    // so there is no incomming call we can reset ui based on this incommingCall parameter
  };

  // fetch senders ids to check voice number is exist or not
  const fetchProviders = async (token: string) => {
    if (!token) return;
    const data = await getSenderIds(token);
    const resData = await getTeamMembers(token);
    const teamMembers = resData?.data;
    const providers = data?.Provider;
    if (providers?.length > 0) {
      let provd1 = providers?.filter((item: any) => item?.isDefault === "1");
      let provd2 = providers?.filter((item: any) => item?.isDefault === "0");
      const provd = [...provd1, ...provd2];

      let allNumbers = provd;
      let myRoleData: MyRoleData | null = null;
      if (teamMembers?.length > 0 && teamEmail) {
        const myRole = teamMembers.find(
          (item: MyRoleData) => item?.email === teamEmail
        );
        myRoleData = myRole;
      }

      if (
        myRoleData &&
        (myRoleData?.roll === "admin" || myRoleData?.roll === "adminuser")
      ) {
        allNumbers = provd;
      } else if (myRoleData && myRoleData?.roll === "standard") {
        allNumbers = provd.filter(
          (item: any) => item?.assignTo === myRoleData?.userId
        );
        if (allNumbers.length === 0) {
          allNumbers = provd.filter((item: any) => item?.assignTo === "0");
        }
      }

      const voiceEnabledProvider = allNumbers?.find(
        (item: any) => item?.voice === "1"
      );

      let voiceNum = voiceEnabledProvider?.number;
      setProviderNumber(voiceNum);
      setAllProviders(allNumbers);
    }
  };

  const fetchProfileInfo = async (devToken: string) => {
    const resData = await getProfileByToken(devToken);
    if (resData && resData?.status === 200) {
      const profileData = resData?.data;
      if (profileData && profileData?.plan === "1") {
        // it is free plan so update state
        setIsFreePlan(true);
      }
    }
  };

  useEffect(() => {
    if (devToken) {
      fetchProviders(devToken);
      fetchProfileInfo(devToken);
    }
  }, [devToken]);

  useEffect(() => {
    const getToken = async (providerNumber: string) => {
      try {
        const formData = {
          devToken,
          providerNumber,
        };

        const { data } = await axios.post(
          `${VOICE_API_BASE_URL}/api/token`,
          formData
        );
        console.log("Got a Token.");
        setToken(data?.token);
        // setClientName(data?.identity);
      } catch (error: any) {
        console.log(error?.message);
      }
    };

    const getTelnyxLoginToken = async (providerNumber: string) => {
      try {
        setDevice(undefined);
        setToken(null);
        const formData = {
          crmToken: devToken,
          providerNumber,
        };
        const { data } = await axios.post(
          `${VOICE_API_BASE_URL}/api/telnyx/loginToken`,
          formData
        );
        if (data && data?.success) {
          setToken(data?.token);
        }
      } catch (error: any) {
        console.log(error?.message);
      }
    };

    if (providerNumber) {
      const provider = allProviders.find(
        (item: any) => item?.number === providerNumber
      );
      const providerName = provider?.name;
      setProviderName(providerName);
      if (providerName === "twilio") {
        getToken(providerNumber);
      } else if (providerName === "telnyx") {
        getTelnyxLoginToken(providerNumber);
      }
    }
  }, [providerNumber]);

  // make rtc client if provider is telnyx

  useEffect(() => {
    if (providerName === "twillio") {
      intitializeDevice();
    } else if (providerName === "telnyx" && token && !isFreePlan) {
      initializeTelnyxClient(token);
    }
  }, [token, providerName, isFreePlan]);

  useEffect(() => {
    getAudioDevices();

    const status = token ? DEVICE_STATUS.ACTIVE : DEVICE_STATUS.INACTIVE;
    updateDeviceStatus(status, providerNumber);

    return () => {
      // Update deviceStatus to "INACTIVE" when component unmounts
      updateDeviceStatus(DEVICE_STATUS.INACTIVE, providerNumber);
    };
  }, [token, providerNumber]);

  const initializeTelnyxClient = async (token: string) => {
    // Initialize TelnyxRTC client
    const client = new TelnyxRTC({
      login_token: token,
      ringtoneFile: "./sounds/ringback_tone.mp3",
      ringbackFile: "./sounds/ringback_tone.mp3",
    });
    client.connect();

    // Event listener for when the client is ready
    client.on("telnyx.ready", () => {
      console.log("Telnyx client is ready");
      setRtcClient(client);
    });

    // Event listener for incoming call notifications
    client.on("telnyx.notification", (notification: any) => {
      const call = notification?.call;

      if (notification.type === "callUpdate") {
        const callType = call?.direction;

        if (callType === "outbound") {
          // Handle outgoing call updates
          if (call?.state === "active") {
            setOutgoingCallAccepted(true);
            setCallDuration(0); // Reset call duration when the call becomes active
          } else if (
            call?.state === "hangup" ||
            call?.state === "destroy" ||
            call?.state === "purge"
          ) {
            setOutgoingCall(null);
            setOutgoingCallAccepted(false);
            setCallDuration(0);
          }
        } else if (callType === "inbound") {
          // Handle incoming call updates
          if (call?.state === "ringing") {
            setIncomingCall(call);
          } else if (call?.state === "active") {
            setIncomingCallAccepted(true);
          } else if (
            call?.state === "hangup" ||
            call?.state === "destroy" ||
            call?.state === "purge"
          ) {
            setIncomingCall(null);
            setIncomingCallAccepted(false);
            setCallDuration(0);
          }
        }
      } else if (notification.type === "error") {
        console.error("Telnyx error:", notification.message);
        // Handle specific error cases if needed
      } else if (notification.type === "message") {
        console.log("Telnyx message:", notification.message);
        // Handle messaging events if needed
      }
      // Handle additional notification types here if needed
    });

    return () => {
      // Clean up: Disconnect and remove event listeners
      client.disconnect();
      setRtcClient(null);
    };
  };
  const handleMakeTelnyxCall = async () => {
    if (!phoneNumber) {
      toast.error("Please enter phone number");
      return;
    }
    if (!rtcClient) {
      toast.error("Device is not ready for making calls");
    }
    const newCall: any = rtcClient?.newCall({
      destinationNumber: phoneNumber,
      callerNumber: providerNumber,
      audio: true,
      video: false,
    });
    setOutgoingCall(newCall);
  };

  // const disconnectTelnyxOutgoingCall = async()=>{

  // }
  const hangupTelnyxOutgoingCall = async () => {
    if (outgoingCall) {
      outgoingCall?.hangup();
    }
    setOutgoingCall(null);
    setOutgoingCallAccepted(false);
    setCallDuration(0);
  };

  const updateDeviceStatus = async (status: any, phoneNumber: string) => {
    try {
      const formData = {
        phoneNumber,
        deviceStatus: status,
      };
      await axios.put(`${VOICE_API_BASE_URL}/api/updateDeviceStatus`, formData);
    } catch (error) {
      console.log("Error updating device status : ", error);
    }
  };

  // SETUP STEP 3:
  // Instantiate a new Twilio.Device
  const intitializeDevice = () => {
    if (!token) return;
    const device = new Device(token, {
      logLevel: "error",
      edge: "ashburn",
      // codecPreferences: ["opus", "pcmu"],
    });

    addDeviceListeners(device);
    // Device must be registered in order to receive incoming calls
    device.register();
    setDevice(device);
  };

  const addDeviceListeners = (device: any) => {
    device.on("registered", () => {
      console.log("Twilio.Device Ready to make and receive calls!");
    });

    device.on("error", (error: any) => {
      console.log("Twilio.Device Error: " + error.message);
    });

    device.on("incoming", handleIncomingCall);

    device.audio.on("deviceChange", updateAllAudioDevices);
  };

  // AUDIO CONTROLS
  const getAudioDevices = async () => {
    try {
      // await navigator.mediaDevices.getUserMedia({ audio: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(
        (device) => device.kind === "audiooutput"
      );
      setSpeakerDevices(audioDevices);
      setRingtoneDevices(audioDevices);
      updateAllAudioDevices();
    } catch (error) {
      console.error("Error accessing audio devices:", error);
    }
  };

  const updateAllAudioDevices = () => {
    if (device) {
      const speakDevices: any = device?.audio?.speakerDevices.get();
      const ringDevices: any = device?.audio?.ringtoneDevices.get();
      let speaksDev: any = [];
      let ringtDev: any = [];
      speakDevices?.forEach((item: any) => {
        speaksDev.push(item);
      });
      ringDevices?.forEach((item: any) => {
        ringtDev.push(item);
      });
    }
  };

  const updateOutputDevice = (deviceId: string) => {
    setSelectedSpeakerDevice(deviceId);
    if (device) {
      device?.audio?.speakerDevices.set([deviceId]);
    }
  };

  const updateRingtoneDevice = (deviceId: string) => {
    setSelectedRingtoneDevice(deviceId);
    if (device) {
      device?.audio?.ringtoneDevices.set([deviceId]);
    }
  };

  const formatCallDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    const formattedHours = hours < 10 ? "0" + hours : hours;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    return hours > 0
      ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
      : `${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    if (outgoingCallAccepted || incomingCallAccepted) {
      const timer = setInterval(() => {
        setCallDuration((prevDuration) => prevDuration + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [outgoingCallAccepted, incomingCallAccepted]);

  return (
    <div
      style={{ zIndex: 999 }}
      className="relative flex items-center justify-center h-screen"
    >
      {isFreePlan ? (
        <FreePlanModal />
      ) : (providerNumber && device) ||
        (providerName === "telnyx" && rtcClient) ? (
        <div
          onClick={
            providerName === "telnyx" ? handleMakeTelnyxCall : makeOutgoingCall
          }
          className="w-6 h-6 cursor-pointer flex items-center justify-center bg-green-500 rounded-full"
        >
          <MdCall size={14} color="white" />
        </div>
      ) : (
        <PopupModal />
      )}
      {outgoingCall && (
        <div className="fixed top-2 right-2 w-full md:w-80 h-64 bg-slate-800 p-4 rounded-md flex flex-col justify-between">
          <div className="relative flex items-center justify-end">
            <div
              onClick={() => setShowSettingsView(!showSettingsView)}
              className="cursor-pointer -mr-2"
            >
              <MdMoreVert size={22} color="white" />
            </div>

            {showSettingsView && (
              <div className="absolute top-1 right-2 flex flex-col gap-2 w-full h-56 overflow-auto custom-scrollbar o bg-white border border-gray-300 shadow-md rounded-md p-2">
                <div className="flex flex-col gap-2">
                  {!showAudioDevicesView ? (
                    <>
                      <h2 className="text-base font-medium">Audio Devices</h2>
                      <div
                        onClick={() =>
                          setShowAudioDevicesView("speakerDevices")
                        }
                        className="flex items-center gap-2 p-2 cursor-pointer rounded-md bg-gray-200"
                      >
                        <span className="text-sm">1.</span>
                        <span className="text-sm">Speaker Devices</span>
                      </div>
                      <div
                        onClick={() =>
                          setShowAudioDevicesView("ringtoneDevices")
                        }
                        className="flex items-center gap-2 p-2 cursor-pointer rounded-md bg-gray-200"
                      >
                        <span className="text-sm">2.</span>
                        <span className="text-sm">Ringtone Devices</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => setShowAudioDevicesView("")}
                        className="flex items-center gap-2 mb-2 cursor-pointer"
                      >
                        <ArrowLeft size={20} />
                        <span className="text-sm">Back</span>
                      </div>
                      {showAudioDevicesView === "speakerDevices"
                        ? Array.isArray(speakerDevices) &&
                          speakerDevices?.map((device: any, index) => (
                            <div
                              key={index}
                              className={`flex items-start gap-2 p-2 cursor-pointer rounded-md ${
                                selectedSpeakerDevice === device?.deviceId
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200"
                              }`}
                              onClick={() =>
                                updateOutputDevice(device?.deviceId)
                              }
                            >
                              <span className="text-sm">{index}.</span>
                              <span className="text-sm">{device?.label}</span>
                            </div>
                          ))
                        : Array.isArray(ringtoneDevices) &&
                          ringtoneDevices?.map((device: any, index) => (
                            <div
                              key={index}
                              className={`flex items-start gap-2 p-2 cursor-pointer rounded-md ${
                                selectedRingtoneDevice === device?.deviceId
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200"
                              }`}
                              onClick={() =>
                                updateRingtoneDevice(device?.deviceId)
                              }
                            >
                              <span className="text-sm">{index}.</span>
                              <span className="text-sm">{device?.label}</span>
                            </div>
                          ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center">
            <img
              className="w-14 h-14 object-fill rounded-full"
              src={AVATAR_IMG}
              alt="avatar-img"
            />
            <div className="flex flex-col mt-4">
              <span className="text- text-center text-white font-medium">
                {/* Jane Smith */}
                {getTitleOfVoiceCall(
                  currentContact?.name,
                  currentContact?.contact
                )}
              </span>
              <span className="text-sm text-center text-gray-500">
                {outgoingCallAccepted
                  ? formatCallDuration(callDuration)
                  : "Connecting.."}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-5">
              <div
                onClick={() => {
                  if (providerName === "twillio") {
                    outgoingCallHangup(outgoingCall);
                  } else if (providerName === "telnyx") {
                    hangupTelnyxOutgoingCall();
                  }
                }}
                className="cursor-pointer bg-red-600 w-10 h-10 rounded-full flex items-center justify-center"
              >
                <ImPhoneHangUp size={22} color="white" />
              </div>
            </div>
          </div>
        </div>
      )}
      {(incomingCall || incomingCallAccepted) && (
        <div className="fixed top-2 right-2 w-full md:w-80 h-64 bg-slate-800 p-4 rounded-md flex flex-col justify-between">
          <div className="relative flex items-center justify-end">
            <div
              onClick={() => setShowSettingsView(!showSettingsView)}
              className="cursor-pointer -mr-2"
            >
              <MdMoreVert size={22} color="white" />
            </div>

            {showSettingsView && (
              <div className="absolute top-1 right-2 flex flex-col gap-2 w-full h-56 overflow-auto custom-scrollbar o bg-white border border-gray-300 shadow-md rounded-md p-2">
                <div className="flex flex-col gap-2">
                  {!showAudioDevicesView ? (
                    <>
                      <h2 className="text-base font-medium">Audio Devices</h2>
                      <div
                        onClick={() =>
                          setShowAudioDevicesView("speakerDevices")
                        }
                        className="flex items-center gap-2 p-2 cursor-pointer rounded-md bg-gray-200"
                      >
                        <span className="text-sm">1.</span>
                        <span className="text-sm">Speaker Devices</span>
                      </div>
                      <div
                        onClick={() =>
                          setShowAudioDevicesView("ringtoneDevices")
                        }
                        className="flex items-center gap-2 p-2 cursor-pointer rounded-md bg-gray-200"
                      >
                        <span className="text-sm">2.</span>
                        <span className="text-sm">Ringtone Devices</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => setShowAudioDevicesView("")}
                        className="flex items-center gap-2 mb-2 cursor-pointer"
                      >
                        <ArrowLeft size={20} />
                        <span className="text-sm">Back</span>
                      </div>
                      {showAudioDevicesView === "speakerDevices"
                        ? Array.isArray(speakerDevices) &&
                          speakerDevices?.map((device: any, index) => (
                            <div
                              key={index}
                              className={`flex items-start gap-2 p-2 cursor-pointer rounded-md ${
                                selectedSpeakerDevice === device?.deviceId
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200"
                              }`}
                              onClick={() =>
                                updateOutputDevice(device?.deviceId)
                              }
                            >
                              <span className="text-sm">{index}.</span>
                              <span className="text-sm">{device?.label}</span>
                            </div>
                          ))
                        : Array.isArray(ringtoneDevices) &&
                          ringtoneDevices?.map((device: any, index) => (
                            <div
                              key={index}
                              className={`flex items-start gap-2 p-2 cursor-pointer rounded-md ${
                                selectedRingtoneDevice === device?.deviceId
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200"
                              }`}
                              onClick={() =>
                                updateRingtoneDevice(device?.deviceId)
                              }
                            >
                              <span className="text-sm">{index}.</span>
                              <span className="text-sm">{device?.label}</span>
                            </div>
                          ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center">
            <img
              className="w-14 h-14 object-fill rounded-full"
              src={AVATAR_IMG}
              alt="avatar-img"
            />
            <div className="flex flex-col mt-4">
              <span className="text- text-center text-white font-medium">
                {incomingCallNumber
                  ? incomingCallNumber
                  : incomingCall?.parameters?.From}
              </span>
              <span className="text-sm text-center text-gray-500">
                {incomingCallAccepted
                  ? formatCallDuration(callDuration)
                  : "Incoming Call"}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-5">
              {!incomingCallAccepted && (
                <div
                  onClick={() => acceptIncomingCall(incomingCall)}
                  className="cursor-pointer bg-green-600 w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <FaPhoneAlt size={18} color="white" />
                </div>
              )}
              {!incomingCallAccepted && (
                <div
                  onClick={() => rejectIncomingCall(incomingCall)}
                  className="cursor-pointer bg-red-600 w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <ImPhoneHangUp size={22} color="white" />
                </div>
              )}

              {incomingCallAccepted && (
                <div
                  onClick={() => hangupIncomingCall(incomingCall)}
                  className="cursor-pointer bg-red-600 w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <ImPhoneHangUp size={22} color="white" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Audio
        stream={outgoingCall?.remoteStream || incomingCall?.remoteStream}
      />
    </div>
  );
};

export default VoiceCall;
