import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getConvContacts, getConvViewChats, sendMessage } from "../../api";
import toast from "react-hot-toast";

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

  // auto scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    let chats = chatsData?.data?.conArr;
    let chatsNew = [...chats].reverse();
    setChats(chatsNew);
  };

  useEffect(() => {
    // Update contacts based on search input
    console.log("searchInput----", searchInput);
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
    scrollToBottom();
  }, [chats]);

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
        await fetchConvContacts(token);
        // if (currentContact) {
        //   await fetchConvChats(token, currentContact?.contact);
        // }
      }
    };

    // Call fetchData every 3 seconds
    const intervalId = setInterval(fetchAppData, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // notifications --------------------

  const state = {
    token,
    rows,
    messagesEndRef,
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
    handleTextareaChange,
    handleSendMessage,
  };
};

export default useData;
