import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  addNoteByCid,
  addTagByCid,
  changeReadStatus,
  deleteNote,
  deleteTag,
  getAllNotesByCid,
  getAllTagsByCid,
  getContactDetails,
  getConvContacts,
  getConvViewChats,
  getIncomingMessages,
  getProfileByToken,
  getSearchContacts,
  makeArchivedContact,
  sendMessage,
} from "../../api";
import notificationSound from "../../assets/sounds/notification.mp3";
import { getUniqueContacts } from "../../utils/common";

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
  const cid = searchParams.get("cid");
  const contact = searchParams.get("contact");

  const [message, setMessage] = useState("");
  const [rows, setRows] = useState(1); // Initial rows
  const [showContactStatus, setShowContactStatus] = useState<boolean>(false);
  const [contactStatusVal, setContactStatusVal] = useState<string>("All");
  const [contacts, setContacts] = useState<IState["contacts"]>([]);
  const [allContacts, setAllContacts] = useState<IState["allContacts"]>([]);
  const [searchedContacts, setSearchedContacts] = useState<
    IState["searchedContacts"]
  >([]);
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
  const [readStatus, setReadStatus] = useState<boolean>(false);
  const [archiveStatus, setArchiveStatus] = useState<boolean>(false); // if true then contact in archive
  const [showTagsComp, setShowTagsComp] = useState<boolean>(false); // for show tags comp
  const [showNotesComp, setShowNotesComp] = useState<boolean>(false); // for show notes comp

  const [tagValue, setTagValue] = useState<string>("");
  const [noteValue, setNoteValue] = useState<string>("");
  const [tags, setTags] = useState<Array<any>>([]);
  const [notes, setNotes] = useState<Array<any>>([]);

  const [userProfileInfo, setUserProfileInfo] = useState<any>(null);

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
      const data = await getConvContacts(token, 0, contactStatusVal);
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

  const handleSearchSubmit = async () => {
    if (searchInput == "") {
      setSearchedContacts([]);
    }
    if (!searchInput || !token) {
      return;
    }

    const searchedData = await getSearchContacts(token, searchInput);
    if (searchedData) setSearchedContacts(searchedData);
  };

  const fetchConvContacts = async (token: any, status: string) => {
    let readContStatus = status.toLowerCase();
    setContactLoading(true);
    const data = await getConvContacts(token, pageNumber, readContStatus);
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

  const filterContactsByStatus = async (status: string, token: any) => {
    let readContStatus = status.toLowerCase();
    const data = await getConvContacts(token, 0, readContStatus);
    if (data && data?.status === 200) {
      let contData = data?.data?.contactArr;
      if (contData?.length > 0) setCurrentContact(contData[0]);
      else setCurrentContact(null);
      setContacts(contData);
      setAllContacts(contData);
    }
  };

  const handleChangeReadStatus = async (data: any) => {
    const resData = await changeReadStatus(data);
    if (resData) {
      setReadStatus(!readStatus);
      fetchConvContacts(token, contactStatusVal);
    }
  };

  const fetchProfileInfo = async (token: string) => {
    const resData = await getProfileByToken(token);
    if (resData && resData?.status === 200) {
      setUserProfileInfo(resData?.data);
    }
  };

  const handleChangeArchive = async (token: string) => {
    let conId = currentContact?.conversationId;
    let arc = archiveStatus ? "1" : "0";
    const data = await makeArchivedContact(token, conId, arc);
    if (data) {
      toast.success(
        `${archiveStatus ? "Unarchived" : "Archived"} Successfully`
      );
      setArchiveStatus(!archiveStatus);
    }
  };

  const fetchAllTags = async () => {
    if (!token) return;
    const data = await getAllTagsByCid(token, currentContact?.conversationId);
    if (data && data?.code === 200) {
      setTags(data?.data);
    }
  };
  const fetchAllNotes = async () => {
    if (!token) return;
    const data = await getAllNotesByCid(token, currentContact?.conversationId);
    if (data && data?.code === 200) {
      setNotes(data?.data);
    }
  };

  const handleAddTag = async () => {
    if (!token || !tagValue || !currentContact) return;
    const data = await addTagByCid(
      token,
      tagValue,
      currentContact?.conversationId
    );
    if (data && data?.code === "200") {
      await fetchAllTags();
      toast.success(data?.status);
      setTagValue("");
    }
  };
  const handleAddNote = async () => {
    if (!token || !noteValue || !currentContact) return;
    const data = await addNoteByCid(
      token,
      noteValue,
      currentContact?.conversationId
    );
    if (data && data?.code === "200") {
      await fetchAllNotes();
      toast.success(data?.status);
      setNoteValue("");
    }
  };

  const handleDeleteTag = async (
    tagId: string,
    token: string,
    conversationId: string
  ) => {
    if (!tagId || !token || !conversationId) return;
    const data = await deleteTag(token, tagId);
    if (data && data?.code === "200") {
      const resp = await getAllTagsByCid(token, conversationId);
      if (resp && resp?.code === 200) {
        setTags(resp?.data);
      }
      toast.success(data?.status);
    }
  };

  const handleDeleteNote = async (
    noteId: string,
    token: string,
    conversationId: string
  ) => {
    if (!noteId || !token || !conversationId) return;
    const data = await deleteNote(token, noteId);
    if (data && data?.code === "200") {
      const resp = await getAllNotesByCid(token, conversationId);
      if (resp && resp?.code === 200) {
        setNotes(resp?.data);
      }
      toast.success(data?.status);
    }
  };

  // navigate to chatview if cid and contact exist in url
  useEffect(() => {
    if (cid && contact) {
      const contactData = {
        contact: contact,
        conversationId: cid,
      };
      setCurrentContact(contactData);
    }
  }, [cid, contact]);

  useEffect(() => {
    filterContactsByStatus(contactStatusVal, token);
  }, [contactStatusVal]);

  useEffect(() => {
    const textareaRows = message.split("\n").length;
    const newRows = Math.min(Math.max(1, textareaRows), 5);

    setRows(newRows);
  }, [message]);

  useEffect(() => {
    if (token) {
      fetchProfileInfo(token);
      fetchConvContacts(token, contactStatusVal);
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
    if (currentContact?.isRead === "1") {
      setReadStatus(true);
    } else if (currentContact?.isRead === "0") {
      setReadStatus(false);
    }
    if (currentContact?.isArchived === "1") {
      setArchiveStatus(true);
    } else if (currentContact?.isArchived === "0") {
      setArchiveStatus(false);
    }
    fetchAllTags();
    fetchAllNotes();
  }, [currentContact]);

  useEffect(() => {
    if (token) {
      fetchConvContacts(token, contactStatusVal);
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

  // search global contacts when user is typing
  useEffect(() => {
    handleSearchSubmit();
  }, [searchInput]);

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
    searchedContacts,
    showContactStatus,
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
    setSearchedContacts,
    setShowContactStatus,
    setContactStatusVal,
    setReadStatus,
    setUserProfileInfo,
    setArchiveStatus,
    setShowTagsComp,
    setShowNotesComp,
    setTags,
    setNotes,
    setTagValue,
    setNoteValue,
    handleTextareaChange,
    handleSendMessage,
    autoTopToBottomScroll,
    handleSearchSubmit,
    handleChangeReadStatus,
    handleChangeArchive,
    handleAddTag,
    handleAddNote,
    handleDeleteTag,
    handleDeleteNote,
  };
};

export default useData;
