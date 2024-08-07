import axios from "axios";
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
import { getSenderIds } from "../../api";
import PopupModal from "./Modals/PopupModal";
import toast from "react-hot-toast";
import { AVATAR_IMG } from "../../assets/images";

interface IProps {
  devToken: any;
  currentContact: any;
}

const VoiceCall: React.FC<IProps> = ({ devToken, currentContact }) => {
  // const [clientName, setClientName] = useState("");
  const [incomingCallNumber, setIncomingCallNumber] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [log, setLog] = useState([]);
  const [speakerDevices, setSpeakerDevices] = useState<MediaDeviceInfo[]>([]);
  const [ringtoneDevices, setRingtoneDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedSpeakerDevice, setSelectedSpeakerDevice] = useState("");
  const [selectedRingtoneDevice, setSelectedRingtoneDevice] = useState("");

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

  useEffect(() => {
    const getToken = async () => {
      try {
        const senderIdsData = await getSenderIds(devToken);
        const providers = senderIdsData?.Provider;

        const voiceEnabledProvider = providers?.find(
          (item: any) => item?.voice === "1"
        );
        const provideNumber = voiceEnabledProvider?.number;
        setProviderNumber(provideNumber);

        const formData = {
          devToken,
          providerNumber: provideNumber,
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

    getToken();
  }, [devToken]);

  useEffect(() => {
    intitializeDevice();
  }, [token]);

  useEffect(() => {
    getAudioDevices();

    const status = token ? DEVICE_STATUS.ACTIVE : DEVICE_STATUS.INACTIVE;
    updateDeviceStatus(status);

    return () => {
      // Update deviceStatus to "INACTIVE" when component unmounts
      updateDeviceStatus(DEVICE_STATUS.INACTIVE);
    };
  }, [token]);

  const updateDeviceStatus = async (status: any) => {
    try {
      const senderIdsData = await getSenderIds(devToken);
      const providers = senderIdsData?.Provider;

      const voiceEnabledProvider = providers?.find(
        (item: any) => item?.voice === "1"
      );
      const phoneNumber = voiceEnabledProvider?.number;
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
      {providerNumber && device ? (
        <div
          onClick={makeOutgoingCall}
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
                onClick={() => outgoingCallHangup(outgoingCall)}
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
    </div>
  );
};

export default VoiceCall;
