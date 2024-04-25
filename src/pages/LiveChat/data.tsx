import { useSearchParams } from "react-router-dom";
import { getProfileByToken } from "../../api";
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
import { setConversations } from "../../store/slices/storeSlice";
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

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { authUser, setAuthUser } = useAuthContext();

  const [userProfileInfo, setUserProfileInfo] =
    React.useState<IState["userProfileInfo"]>(null);

  const [loading, setLoading] = React.useState<IState["loading"]>(false);

  const handleAuthAdmin = async () => {
    if (!token) return;
    try {
      // crmToken, fullName, username, password, profilePic
      const resData = await getProfileByToken(token);
      console.log({ resDataAuth: resData });
      if (resData && resData?.status === 200) {
        setUserProfileInfo(resData?.data);
        const authInfo = resData?.data;
        const formData = {
          crmToken: token,
          fullName: `${authInfo?.fname} ${authInfo?.lname}`,
          username: extractUsername(authInfo?.email) || authInfo?.phone,
          password: authInfo?.phone,
          profilePic: authInfo?.profilePic,
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

        console.log("loginadmin ", data);
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
        `${LIVE_CHAT_API_URL}/api/v1/users/?crmToken=${authUser?.crmToken}`,
        { headers }
      );
      if (data && data?.success) {
        dispatch(setConversations(data?.data));
      }
      console.log("convs ", { data });
    } catch (error: any) {
      console.log("Fetch live conversations error : ", error?.message);
    }
  };

  React.useEffect(() => {
    handleAuthAdmin();
  }, [token]);

  React.useEffect(() => {
    const fetchCons = async () => {
      setLoading(true);
      await fetchConversations();
      setLoading(false);
    };
    fetchCons();
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
  }, [socket]);

  const state = {
    token,
    userProfileInfo,
    selectedConversation,
    loading,
  };
  return {
    state,
    setLoading,
    setUserProfileInfo,
  };
};

export default useData;
