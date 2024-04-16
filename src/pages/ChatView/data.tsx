import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  addLabelByCid,
  assignConversationByCid,
  getAllLabelsByToken,
  getConvId,
  getConvViewChats,
  getIncomingMessages,
  getTeamMembers,
  sendMessage,
} from "../../api";
import notificationSound from "../../assets/sounds/notification.mp3";

interface IState {
  allContacts: Array<any>;
  contacts: Array<any>;
  searchedContacts: Array<any>;
  currentContact: any;
  chats: Array<any>;
  showEmojiPicker: boolean;
  selectedEmoji: any;
  sendMsgLoading: boolean;
  selectedSenderId: any;
  selectedTemplate: any;
  searchInput: string;
  mediaLink: any;
  requiredMediaType: string | null;
  contactProfileDetails: any;
  whatsTimer: any;
  lastTimestamp: any;
}

const useData = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const phone = searchParams.get("phone");
  const teamEmail = searchParams.get("team");
  const source = searchParams.get("source");

  const [message, setMessage] = useState("");
  const [rows, setRows] = useState(1); // Initial rows

  const [currentContact, setCurrentContact] =
    useState<IState["currentContact"]>(null);
  const [chats, setChats] = useState<IState["chats"]>([]);
  const [showEmojiPicker, setShowEmojiPicker] =
    useState<IState["showEmojiPicker"]>(false);
  const [selectedEmoji, setSelectedEmoji] =
    useState<IState["selectedEmoji"]>(null);
  const [sendMsgLoading, setSendMsgLoading] =
    useState<IState["sendMsgLoading"]>(false);
  const [selectedSenderId, setSelectedSenderId] =
    useState<IState["selectedSenderId"]>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<IState["selectedTemplate"]>(null);
  const [mediaLink, setMediaLink] = useState<IState["mediaLink"]>(null);
  const [requiredMediaType, setRequiredMediaType] =
    useState<IState["requiredMediaType"]>(null);
  useState<IState["contactProfileDetails"]>(null);

  const [whatsTimer, setWhatsTimer] = useState<IState["whatsTimer"]>(null);
  const [lastTimestamp, setLastTimestamp] =
    useState<IState["lastTimestamp"]>(null);
  const [chatLoading, setChatLoading] = useState<boolean>(true);

  const [teamMembers, setTeamMembers] = useState<Array<any>>([]);
  const [showTeamMembers, setShowTeamMembers] = useState<boolean>(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<any>(null);
  const [label, setLabel] = useState<string>(""); // for creating a new label
  const [labelsOfToken, setLabelsOfToken] = useState<Array<any>>([]); // for fetch labels
  const [addLabelLoading, setAddLabelLoading] = useState<boolean>(false);
  const [assignLabelLoading, setAssignLabelLoading] = useState<boolean>(false);

  // auto scrolling

  const lastMessageRef = useRef<any>();

  const handleTextareaChange = (event: any) => {
    const textareaRows = event.target.value.split("\n").length;
    const newRows = Math.min(Math.max(1, textareaRows), 5);

    setRows(newRows);
    setMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    const formData = {
      token,
      to: currentContact?.contact,
      message,
      fromnum: selectedSenderId?.number,
      channel: selectedSenderId?.defaultChannel,
      selectedTemplate,
      mediaLink,
      source,
    };

    setSendMsgLoading(true);
    const data = await sendMessage(formData);

    if (token && currentContact) {
      Promise.all([fetchConvChats(token, currentContact?.contact)]);
    }
    if (data && data?.status === 200) {
      setMessage("");
      setMediaLink(null);
      setSelectedTemplate(null);
      toast.success("Message sent successfully");
    } else {
      toast.error("Something went wrong");
    }
    setSendMsgLoading(false);
  };

  const fetchConvChats = async (token: any, contact: string) => {
    const chatsData = await getConvViewChats(token, contact);
    if (chatsData && chatsData?.status === 200) {
      let newChats = chatsData?.data?.conArr;
      let chatsNew = [...newChats].reverse();
      setChats(chatsNew);
      setLastTimestamp(chatsData?.data?.timestamp);
      if (chatsData?.data?.whatsTimer !== "") {
        setWhatsTimer(chatsData?.data?.whatsTimer);
      } else {
        setWhatsTimer(null);
      }
    } else {
      setChats([]);
    }
  };

  const fetchIncomingMessages = async (
    token: any,
    conversationId: any,
    timestamp: any
  ) => {
    let newTimestamp = null;
    const data = await getIncomingMessages(token, conversationId, timestamp);
    if (data && (data?.status === 200 || data?.status === 201)) {
      newTimestamp = data?.timestamp;
      if (data?.status === 201) {
        return newTimestamp;
      }
      let newMsgArr = [];
      const dataFromFile = data?.data_from_file;
      // Iterate over keys in data_from_file
      for (let key in dataFromFile) {
        if (dataFromFile.hasOwnProperty(key)) {
          // Push the object into the dataArray
          newMsgArr.push(dataFromFile[key]);
        }
      }
      if (newMsgArr.length > 0) {
        const sound = new Audio(notificationSound);
        sound.play();
      }
      // setLastTimestamp(data?.timestamp)
      setChats([...chats, ...newMsgArr]);
    }
    return newTimestamp;
  };

  const fetchTeamMembers = async () => {
    if (!token) return;
    const data = await getTeamMembers(token);
    if (data && data?.status === 200) {
      setTeamMembers(data?.data);
    }
  };

  const handleAssignConversation = async (
    token: string,
    memberEmail: string,
    conversationId: string,
    teamEmail: string
  ) => {
    if (!token || !memberEmail || !conversationId || !teamEmail) return;
    const data = await assignConversationByCid(
      token,
      memberEmail,
      conversationId,
      teamEmail
    );
    if (data && data?.status === 200) {
      toast.success(data?.success);
      setShowTeamMembers(false);
    }
  };

  const handleAddLabel = async (
    token: string,
    conversationId: string,
    label: string
  ) => {
    setAddLabelLoading(true);
    const data = await addLabelByCid(token, conversationId, label);
    if (data && data?.code === "200") {
      toast.success(data?.status);
    }
    setLabel("");
    setAddLabelLoading(false);
  };
  const handleAssignLabel = async (
    token: string,
    conversationId: string,
    label: string
  ) => {
    setAssignLabelLoading(true);
    const data = await addLabelByCid(token, conversationId, label);
    if (data && data?.code === "200") {
      toast.success(data?.status);
    }
    setLabel("");
    setAssignLabelLoading(false);
  };

  const fetchLabelsOfToken = async (token: string) => {
    if (!token) return;
    const data = await getAllLabelsByToken(token);
    if (data && data?.code === 200) {
      setLabelsOfToken(data?.data);
    }
  };

  const handleExistingFilteredLabels = (label: string) => {
    let labels = [];
    labels = labelsOfToken?.filter((item) =>
      item?.label?.toLowerCase()?.includes(label?.toLowerCase())
    );
    return labels;
  };

  // fetch cid and chats from phone
  useEffect(() => {
    const fetchConvDetails = async () => {
      if (token && phone) {
        setChatLoading(true);
        const resData = await getConvId(token, phone);
        if (resData && resData?.status === 200) {
          setCurrentContact({
            name: phone,
            contact: phone,
            conversationId: resData.cid,
          });

          await fetchConvChats(token, phone);
        }
        setChatLoading(false);
      }
    };
    fetchConvDetails();
  }, [phone, token]);

  useEffect(() => {
    const textareaRows = message.split("\n").length;
    const newRows = Math.min(Math.max(1, textareaRows), 5);

    setRows(newRows);
  }, [message]);

  useEffect(() => {
    if (token) {
      Promise.all([fetchTeamMembers(), fetchLabelsOfToken(token)]);
    }
  }, [token]);

  useEffect(() => {
    if (token && currentContact) {
      const fetchChats = async () => {
        setChatLoading(true);
        await fetchConvChats(token, currentContact?.contact);
        setChatLoading(false);
      };
      fetchChats();
    }

    setSelectedTeamMember(null);
    setShowTeamMembers(false);
  }, [currentContact?.contact]);

  useEffect(() => {
    if (selectedTemplate) {
      let mType: string = selectedTemplate?.headertype;
      if (mType && mType !== "none") {
        const mediaType =
          mType?.charAt(0).toUpperCase() + mType.slice(1).toLowerCase();
        setRequiredMediaType(mediaType);
      }
    }
  }, [selectedTemplate]);

  useEffect(() => {
    let timestamp: any = null;
    const fetchAppData = async () => {
      // Convert to Unique timestamp
      if (currentContact?.conversationId) {
        let timestampValue = timestamp ? timestamp : lastTimestamp;
        const newTimestamp = await fetchIncomingMessages(
          token,
          currentContact?.conversationId,
          timestampValue
        );
        timestamp = newTimestamp;
      }
    };

    // Call fetchData every 10 seconds
    const intervalId = setInterval(fetchAppData, 10000); // call this in every 10 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentContact?.conversationId, lastTimestamp]);

  // auto scroll
  const autoTopToBottomScroll = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    setTimeout(() => {
      autoTopToBottomScroll();
    }, 100);
  }, [chats]);

  const state = {
    token,
    teamEmail,
    phone,
    rows,
    message,
    currentContact,
    chats,
    showEmojiPicker,
    selectedEmoji,
    sendMsgLoading,
    selectedSenderId,
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
  };

  return {
    state,
    setMessage,
    setChats,
    setShowEmojiPicker,
    setSelectedEmoji,
    setSendMsgLoading,
    setSelectedSenderId,
    setSelectedTemplate,
    setMediaLink,
    setWhatsTimer,
    setChatLoading,
    setTeamMembers,
    setShowTeamMembers,
    setSelectedTeamMember,
    setLabel,
    setAddLabelLoading,
    setLabelsOfToken,
    setAssignLabelLoading,
    handleTextareaChange,
    handleSendMessage,
    autoTopToBottomScroll,
    handleAssignConversation,
    handleAddLabel,
    handleAssignLabel,
    handleExistingFilteredLabels,
  };
};

export default useData;
