import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getContactDetails,
  getConvContacts,
  getConvViewChats,
  getIncomingMessages,
  sendMessage,
} from "../../api";
import notificationSound from "../../assets/sounds/notification.mp3";

interface IState {
  allContacts: Array<any>;
  contacts: Array<any>;
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
}

const useData = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState(1); // Initial rows
  const [contacts, setContacts] = useState<IState["contacts"]>([]);
  const [allContacts, setAllContacts] = useState<IState["allContacts"]>([]);
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
  const [searchInput, setSearchInput] = useState<IState["searchInput"]>("");
  const [mediaLink, setMediaLink] = useState<IState["mediaLink"]>(null);
  const [requiredMediaType, setRequiredMediaType] =
    useState<IState["requiredMediaType"]>(null);
  const [contactProfileDetails, setContactProfileDetails] =
    useState<IState["contactProfileDetails"]>(null);

  const [showMobileChatView, setShowMobileChatView] = useState<boolean>(false);

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
    };
    console.log({
      "senderId: ": selectedSenderId,
      formdata: formData,
      selectedTemplate,
    });

    setSendMsgLoading(true);
    const data = await sendMessage(formData);

    if (token && currentContact) {
      Promise.all([
        fetchConvChats(token, currentContact?.contact),
        fetchConvContacts(token),
      ]);
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
    console.log("Send msg resp :", data);
  };

  const handleSearch = () => {
    if (!searchInput.trim()) {
      // If search input is empty, display all contacts
      return allContacts;
    } else {
      return allContacts.filter(
        (item: any) =>
          item.contact.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
  };

  const fetchConvContacts = async (token: string) => {
    const data = await getConvContacts(token);
    setContacts(data);
    setAllContacts(data);
  };

  const fetchConvChats = async (token: string, contact: string) => {
    const chatsData = await getConvViewChats(token, contact);
    if (chatsData) {
      let newChats = chatsData?.data?.conArr;
      // if(newChats.length > 0 && chats.length > 0 && (newChats[0]?.msgId !== chats[chats.length -1]?.msgId)){}
      let chatsNew = [...newChats].reverse();
      setChats(chatsNew);
    }
  };

  const fetchIncomingMessages = async (
    token: any,
    conversationId: any,
    timestamp: any
  ) => {
    let newTimestamp = null;
    const data = await getIncomingMessages(token, conversationId, timestamp);
    console.log("incoming msg data--", {
      "data?.timestamp": data?.timestamp,
      timestamp: timestamp,
    });
    console.log("incoming--", data);
    if (data && (data?.status === 200 || data?.status === 201)) {
      // setTimestamp(data?.timestamp);
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
      setChats([...chats, ...newMsgArr]);
    }
    return newTimestamp;
  };

  useEffect(() => {
    // Update contacts based on search input
    const newContacts = handleSearch();
    setContacts(newContacts);
  }, [searchInput, allContacts]);

  useEffect(() => {
    const textareaRows = message.split("\n").length;
    const newRows = Math.min(Math.max(1, textareaRows), 5);

    setRows(newRows);
  }, [message]);

  useEffect(() => {
    if (token) {
      fetchConvContacts(token);
      if (currentContact) {
        fetchConvChats(token, currentContact?.contact);
      }
    }
  }, [token, currentContact]);

  useEffect(() => {
    console.log("selectedTemp :", selectedTemplate);
    if (selectedTemplate) {
      let mType: string = selectedTemplate?.headertype;
      const mediaType =
        mType?.charAt(0).toUpperCase() + mType.slice(1).toLowerCase();
      setRequiredMediaType(mediaType);
    }
  }, [selectedTemplate]);

  // fetch data in every 3 seconds for incoming
  useEffect(() => {
    const fetchAppData = async () => {
      if (token) {
        console.log("res--");
        await fetchConvContacts(token);
      }
    };

    // Call fetchData every 3 seconds
    const intervalId = setInterval(fetchAppData, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    let timestamp: any = null;
    const fetchAppData = async () => {
      console.log("chat resnnnn");
      let currentDateTime = new Date();

      // Convert to Unix timestamp
      let tmp = Math.floor(currentDateTime.getTime() / 1000);
      let currentTimestamp = tmp.toString();
      let timestampValue = timestamp ? timestamp : currentTimestamp;
      // console.log("tims---------", timestamp);
      const newTimestamp = await fetchIncomingMessages(
        token,
        currentContact?.conversationId,
        timestampValue
      );
      timestamp = newTimestamp;
    };

    // Call fetchData every 3 seconds
    const intervalId = setInterval(fetchAppData, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchContactDetails = async () => {
      if (token && currentContact) {
        const res = await getContactDetails(token, currentContact?.contact);
        setContactProfileDetails(res?.data);
        console.log("profile detail---", res);
      }
    };
    fetchContactDetails();
  }, [currentContact]);

  // auto scroll
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [chats]);

  // notifications --------------------

  const state = {
    token,
    rows,
    message,
    contacts,
    currentContact,
    chats,
    showEmojiPicker,
    selectedEmoji,
    sendMsgLoading,
    selectedSenderId,
    selectedTemplate,
    searchInput,
    mediaLink,
    requiredMediaType,
    lastMessageRef,
    contactProfileDetails,
    showMobileChatView,
  };

  return {
    state,
    setMessage,
    setContacts,
    setCurrentContact,
    setChats,
    setShowEmojiPicker,
    setSelectedEmoji,
    setSendMsgLoading,
    setSelectedSenderId,
    setSelectedTemplate,
    setSearchInput,
    setMediaLink,
    setContactProfileDetails,
    setShowMobileChatView,
    handleTextareaChange,
    handleSendMessage,
  };
};

export default useData;
