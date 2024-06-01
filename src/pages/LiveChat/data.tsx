import { useSearchParams } from "react-router-dom";
import { getProfileByToken, getTeamMembers } from "../../api";
import React from "react";
import {
  extractUsername,
  getJwtTokenFromLocalStorage,
  setJwtTokenInLocalStorage,
} from "../../utils/common";
import axios from "axios";
import notificationSound from "../../assets/sounds/notification.mp3";
import { useAuthContext } from "../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllLabels,
  setConversations,
  setNotifications,
  setTeamMembers,
} from "../../store/slices/storeSlice";
import { RootState } from "../../store";
import { useSocketContext } from "../../context/SocketContext";
import { LIVE_CHAT_API_URL } from "../../constants";

interface IState {
  userProfileInfo: any;
  loading: boolean;
}

const useData = () => {
  const dispatch = useDispatch();
  const { socket } = useSocketContext();
  const selectedConversation = useSelector(
    (state: RootState) => state.store.selectedConversation
  );
  const notifications = useSelector(
    (state: RootState) => state.store.notifications
  );

  const status = useSelector((state: RootState) => state.store.status);
  const filterLabelId = useSelector(
    (state: RootState) => state.store.filterLabelId
  );
  const filterOwnerId = useSelector(
    (state: RootState) => state.store.filterOwnerId
  );

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { authUser, setAuthUser } = useAuthContext();

  const [userProfileInfo, setUserProfileInfo] =
    React.useState<IState["userProfileInfo"]>(null);

  const [loading, setLoading] = React.useState<IState["loading"]>(false);
  const [showMobileChatView, setShowMobileChatView] =
    React.useState<boolean>(false);

  const handleAuthAdmin = async () => {
    if (!token) return;
    try {
      // crmToken, fullName, username, password, profilePic
      const resData = await getProfileByToken(token);
      if (resData && resData?.status === 200) {
        setUserProfileInfo(resData?.data);
        const authInfo = resData?.data;
        const formData = {
          crmToken: token,
          fullName: `${authInfo?.fname} ${authInfo?.lname}`,
          username: extractUsername(authInfo?.email) || authInfo?.phone,
          password: authInfo?.phone,
          profilePic: authInfo?.profilePic,
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

  const fetchConversations = async () => {
    try {
      const jwtToken = getJwtTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
      const { data } = await axios.get(
        `${LIVE_CHAT_API_URL}/api/v1/users/?crmToken=${authUser?.crmToken}&status=${status}&labelId=${filterLabelId}&ownerId=${filterOwnerId}`,
        { headers }
      );
      if (data && data?.success) {
        dispatch(setConversations(data?.data));
      }
    } catch (error: any) {
      console.log("Fetch live conversations error : ", error?.message);
    }
  };

  // fetchAllLabels
  const fetchAllLabels = async () => {
    try {
      const jwtToken = getJwtTokenFromLocalStorage();
      if (jwtToken) {
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };
        const { data } = await axios.get(
          `${LIVE_CHAT_API_URL}/api/v1/labels/allLabelsOfAdmin`,
          { headers }
        );
        if (data && data?.success) {
          dispatch(setAllLabels(data?.data));
        }
      }
    } catch (error: any) {
      console.log("Error : ", error?.message);
    }
  };

  // Feath team members
  const fetchTeamMembers = async () => {
    if (!token) return;
    const data = await getTeamMembers(token);
    if (data && data?.status === 200) {
      let teams = data?.data;
      let teamMembers = teams?.filter((item: any) => item?.userId);
      dispatch(setTeamMembers(teamMembers));
    }
  };

  React.useEffect(() => {
    handleAuthAdmin();
  }, [token]);

  // Feath team members useEffect
  React.useEffect(() => {
    if (token) {
      fetchTeamMembers();
    }
  }, [token]);

  React.useEffect(() => {
    const fetchCons = async () => {
      setLoading(true);
      await fetchConversations();
      setLoading(false);
    };
    fetchCons();
  }, [authUser, status, filterLabelId, filterOwnerId]);

  // fetch all notifications
  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const jwtToken = getJwtTokenFromLocalStorage();
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };
        const { data } = await axios.get(
          `${LIVE_CHAT_API_URL}/api/v1/notifications`,
          {
            headers,
          }
        );
        if (data && data?.success) {
          const notificationData = data?.data?.notifications;
          dispatch(setNotifications(notificationData));
        }
      } catch (error: any) {
        console.log("Fetch notifications error : ", error?.message);
      }
    };
    fetchNotifications();
  }, [authUser]);

  //   listen incoming messages
  React.useEffect(() => {
    socket?.on("newMessage", (newMessage: any) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      fetchConversations();
    });

    return () => socket?.off("newMessage");
  }, [socket, status]);

  React.useEffect(() => {
    socket?.on("newNotification", (newNotification: any) => {
      // newNotification.shouldShake = true;
      // if (newNotification.to === authUser._id) {
      // }
      const updatedNotifications = [...notifications, newNotification];
      dispatch(setNotifications(updatedNotifications));
      // const sound = new Audio(notificationSound);
      // sound.play();
      // fetchConversations();
    });
    return () => socket?.off("newNotification");
  }, [socket, notifications, setNotifications]);

  // fetchAllLabels of an admin
  React.useEffect(() => {
    fetchAllLabels();
  }, [authUser]);

  const state = {
    token,
    userProfileInfo,
    selectedConversation,
    loading,
    showMobileChatView,
  };
  return {
    state,
    setLoading,
    setUserProfileInfo,
    setShowMobileChatView,
    fetchConversations,
  };
};

export default useData;
