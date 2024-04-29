import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import axios from "axios";
import {
  setConversations,
  setMessages,
  setUsersTypingStatus,
} from "../../../../store/slices/storeSlice";
import toast from "react-hot-toast";
import { getJwtTokenFromLocalStorage } from "../../../../utils/common";
import { useSocketContext } from "../../../../context/SocketContext";
import notificationSound from "../../../../assets/sounds/notification.mp3";
import { useAuthContext } from "../../../../context/AuthContext";
import { LIVE_CHAT_API_URL } from "../../../../constants";

interface IState {
  message: string;
  selectedEmoji: any;
  loading: boolean;
  sendMsgLoading: boolean;
}

type FileType = "image" | "video" | "pdf" | "doc" | "docx" | null; // Define FileType type

const useData = () => {
  const dispatch = useDispatch();
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const selectedConversation = useSelector(
    (state: RootState) => state.store.selectedConversation
  );
  const messages = useSelector((state: RootState) => state.store.messages);

  const lastMessageRef = React.useRef<HTMLDivElement>(null);
  const [message, setMessage] = React.useState<IState["message"]>("");

  const [selectedEmoji, setSelectedEmoji] =
    React.useState<IState["selectedEmoji"]>(null);

  const [loading, setLoading] = React.useState<IState["loading"]>(false);
  const [sendMsgLoading, setSendMsgLoading] =
    React.useState<IState["sendMsgLoading"]>(false);

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null); // State to store selected file
  const [fileType, setFileType] = React.useState<FileType>(null); // State to store type of selected file

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]; // Get the first selected file
    if (file) {
      setSelectedFile(file);
      const fileType = getFileType(file); // Determine the type of file
      setFileType(fileType);

      setSendMsgLoading(true);
      // sending file message
      try {
        const jwtToken = getJwtTokenFromLocalStorage();
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        };

        let mediaUrl = "";
        let mediaType = "";

        const formData = new FormData();
        formData.append("file", file);
        const { data: resData } = await axios.post(
          `${LIVE_CHAT_API_URL}/api/v1/uploadFile`,
          formData,
          { headers: { Authorization: `Bearer ${jwtToken}` } }
        );

        if (resData && resData?.url) {
          mediaUrl = resData.url;
          mediaType = fileType ? fileType : "";
        }

        const msgData = {
          message,
          mediaUrl,
          mediaType,
        };
        const { data } = await axios.post(
          `${LIVE_CHAT_API_URL}/api/v1/messages/send/${selectedConversation?._id}`,
          msgData,
          { headers }
        );
        if (data && data.success) {
          dispatch(setMessages([...messages, data?.data?.newMessage]));
          setMessage("");
          setSelectedFile(null);
          setFileType(null);
          await fetchConversations();
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setSendMsgLoading(false);
      }
    }
  };

  // Function to determine file type
  const getFileType = (file: File): FileType => {
    const type = file.type.split("/")[0]; // Get the type part before '/'
    switch (type) {
      case "image":
        return "image";
      case "video":
        return "video";
      case "application": // Check if it's a document (application/*)
        const fileType = file.type.split("/")[1];
        if (fileType === "pdf") {
          return "pdf";
        } else if (fileType === "doc" || fileType === "docx") {
          return fileType;
        } else {
          return null; // Unknown document type
        }
      default:
        return null;
    }
  };

  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const fetchConversations = async () => {
    try {
      const jwtToken = getJwtTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      const { data } = await axios.get(
        `${LIVE_CHAT_API_URL}/api/v1/users/?crmToken=${authUser?.crmToken}`,
        { headers }
      );
      if (data && data?.success) {
        dispatch(setConversations(data?.data));
      }
    } catch (error: any) {
      console.log("Fetch live conversations error : ", error?.message);
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "") return; // Prevent sending empty messages
    try {
      const jwtToken = getJwtTokenFromLocalStorage();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      };

      const formData = {
        message,
      };
      const { data } = await axios.post(
        `${LIVE_CHAT_API_URL}/api/v1/messages/send/${selectedConversation?._id}`,
        formData,
        { headers }
      );
      if (data && data.success) {
        dispatch(setMessages([...messages, data?.data?.newMessage]));
        setMessage("");
        await fetchConversations();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      // setSendMsgLoading(false);
    }
  };

  React.useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  //   Get all conversation messages
  React.useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const jwtToken = getJwtTokenFromLocalStorage();
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };
        const { data } = await axios.get(
          `${LIVE_CHAT_API_URL}/api/v1/messages/${selectedConversation?._id}`,
          { headers }
        );
        if (data && data.success) {
          dispatch(setMessages(data?.data));
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  //   listen incoming messages
  React.useEffect(() => {
    socket?.on("newMessage", (newMessage: any) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      if (newMessage.senderId === selectedConversation?._id) {
        dispatch(setMessages([...messages, newMessage]));
      }
      fetchConversations();
    });

    socket?.on("startTyping", (startTyping: any) => {
      startTyping.shouldShake = true;
      dispatch(
        setUsersTypingStatus({ userId: startTyping.senderId, status: true })
      );
    });
    socket?.on("stopTyping", (stopTyping: any) => {
      stopTyping.shouldShake = true;
      dispatch(
        setUsersTypingStatus({ userId: stopTyping.senderId, status: false })
      );
    });

    return () => socket?.off("newMessage");
  }, [socket, messages, setMessages]);

  // when message exist then send socket.emit for start typing and when message is empty then stopTyping
  React.useEffect(() => {
    const data = {
      senderId: authUser?._id,
      receiverId: selectedConversation?._id,
    };
    if (message) {
      socket?.emit("startTyping", data);
    } else {
      socket?.emit("stopTyping", data);
    }
  }, [message]);

  const state = {
    message,
    messages,
    selectedEmoji,
    lastMessageRef,
    loading,
    selectedConversation,
    selectedFile,
    fileType,
    sendMsgLoading,
  };

  return {
    state,
    setMessage,
    setSelectedEmoji,
    handleChangeMessage,
    handleSendMessage,
    handleFileChange,
  };
};

export default useData;
