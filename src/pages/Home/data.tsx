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
import { getUniqueContacts } from "../../utils/common";

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
  whatsTimer: any;
  lastTimestamp: any;
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
  const [whatsTimer, setWhatsTimer] = useState<IState["whatsTimer"]>(null);
  const [lastTimestamp, setLastTimestamp] =
    useState<IState["lastTimestamp"]>(null);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [contactLoading, setContactLoading] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(0);

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

    setSendMsgLoading(true);
    const data = await sendMessage(formData);

    const fetchNewContacts = async (token: any) => {
      const data = await getConvContacts(token, 0);
      if (data && data?.status === 200) {
        let contData = data?.data?.contactArr;
        let fetchedContacts = [...contData, ...allContacts];
        let uniqueContacts = getUniqueContacts(fetchedContacts);
        setContacts(uniqueContacts);
        setAllContacts(uniqueContacts);
      }
    };

    if (token && currentContact) {
      Promise.all([
        fetchConvChats(token, currentContact?.contact),
        fetchNewContacts(token),
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

  const fetchConvContacts = async (token: any) => {
    setContactLoading(true);
    const data = await getConvContacts(token, pageNumber);
    if (data && data?.status === 200) {
      let contData = data?.data?.contactArr;
      let fetchedContacts = [...allContacts, ...contData];
      let uniqueContacts = getUniqueContacts(fetchedContacts);
      setContacts(uniqueContacts);
      setAllContacts(uniqueContacts);
    }
    setContactLoading(false);
  };

  const fetchConvChats = async (token: any, contact: string) => {
    const chatsData = await getConvViewChats(token, contact);
    if (chatsData) {
      let newChats = chatsData?.data?.conArr;
      let chatsNew = [...newChats].reverse();
      setChats(chatsNew);
      setLastTimestamp(chatsData?.data?.timestamp);
      if (chatsData?.data?.whatsTimer !== "") {
        setWhatsTimer(chatsData?.data?.whatsTimer);
      } else {
        setWhatsTimer(null);
      }
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
  }, [currentContact]);

  useEffect(() => {
    if (token) {
      fetchConvContacts(token);
    }
  }, [pageNumber]);

  useEffect(() => {
    if (selectedTemplate) {
      let mType: string = selectedTemplate?.headertype;
      const mediaType =
        mType?.charAt(0).toUpperCase() + mType.slice(1).toLowerCase();
      setRequiredMediaType(mediaType);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    let timestamp: any = null;
    const fetchAppData = async () => {
      // Convert to Unique timestamp
      let timestampValue = timestamp ? timestamp : lastTimestamp;
      const newTimestamp = await fetchIncomingMessages(
        token,
        currentContact?.conversationId,
        timestampValue
      );
      timestamp = newTimestamp;
    };

    // Call fetchData every 3 seconds
    const intervalId = setInterval(fetchAppData, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentContact?.conversationId, lastTimestamp]);

  useEffect(() => {
    const fetchContactDetails = async () => {
      if (token && currentContact) {
        const res = await getContactDetails(token, currentContact?.contact);
        setContactProfileDetails(res?.data);
      }
    };
    fetchContactDetails();
  }, [currentContact]);

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
    whatsTimer,
    chatLoading,
    contactLoading,
    pageNumber,
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
    setWhatsTimer,
    setChatLoading,
    setContactLoading,
    setPageNumber,
    handleTextareaChange,
    handleSendMessage,
    autoTopToBottomScroll,
  };
};

export default useData;
