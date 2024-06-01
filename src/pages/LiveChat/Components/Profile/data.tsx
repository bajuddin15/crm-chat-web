import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import axios from "axios";
import { LIVE_CHAT_API_URL } from "../../../../constants";
import { getJwtTokenFromLocalStorage } from "../../../../utils/common";
import { setLabels } from "../../../../store/slices/storeSlice";
import toast from "react-hot-toast";

interface IState {
  showNotifications: boolean;
  unreadNotifications: any[];
  showDeleteLabelId: string | null;
}

const useData = () => {
  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state: RootState) => state.store.selectedConversation
  );
  const notifications = useSelector(
    (state: RootState) => state.store.notifications
  );

  const labels = useSelector((state: RootState) => state.store.labels);

  const [showNotifications, setShowNotifications] =
    React.useState<IState["showNotifications"]>(false);
  const [unreadNotifications, setUnreadNotifications] = React.useState<
    IState["unreadNotifications"]
  >([]);

  const [showDeleteLabelId, setShowDeleteLabelId] =
    React.useState<IState["showDeleteLabelId"]>(null);

  const [convStatus, setConvStatus] = React.useState("");

  const fetchAllLabelsOfConversation = async () => {
    try {
      const jwtToken = getJwtTokenFromLocalStorage();
      if (jwtToken) {
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };
        const { data } = await axios.get(
          `${LIVE_CHAT_API_URL}/api/v1/labels/${selectedConversation?._id}`,
          { headers }
        );
        if (data && data?.success) {
          dispatch(setLabels(data?.data));
        }
      }
    } catch (error: any) {
      console.log("Error : ", error?.message);
    }
  };
  const handleRemoveLabel = async (labelId: string) => {
    try {
      const jwtToken = getJwtTokenFromLocalStorage();
      if (jwtToken) {
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };
        const formData = { labelId, userId: selectedConversation?._id };
        const { data } = await axios.post(
          `${LIVE_CHAT_API_URL}/api/v1/labels/removeLabel`,
          formData,
          { headers }
        );
        if (data && data?.success) {
          const labels = data?.data?.labels;
          dispatch(setLabels(labels));
          toast.success(data?.message);
        }
      }
    } catch (error: any) {
      console.log("Error : ", error?.message);
    }
  };

  const handleChangeConversationStatus = async (status: string) => {
    try {
      const jwtToken = getJwtTokenFromLocalStorage();
      if (jwtToken) {
        const headers = {
          Authorization: `Bearer ${jwtToken}`,
        };
        const formData = {
          status,
          userId: selectedConversation?._id,
        };
        const { data } = await axios.put(
          `${LIVE_CHAT_API_URL}/api/v1/conversations/editStatus`,
          formData,
          { headers }
        );
        if (data && data?.success) {
          setConvStatus(data?.data?.status);
          toast.success(data?.message);
        }
      }
    } catch (error: any) {
      console.log("Error: ", error?.message);
    }
  };

  React.useEffect(() => {
    if (selectedConversation) {
      fetchAllLabelsOfConversation();
      setConvStatus(selectedConversation?.status);
    }
  }, [selectedConversation]);

  React.useEffect(() => {
    const countUnreadNotifications = () => {
      let unread = notifications.filter((item) => item.read === false);
      setUnreadNotifications(unread);
    };
    countUnreadNotifications();
  }, [notifications]);

  const state = {
    showNotifications,
    unreadNotifications,
    showDeleteLabelId,
    labels,
    convStatus,
  };

  return {
    state,
    setShowNotifications,
    setUnreadNotifications,
    setShowDeleteLabelId,
    setConvStatus,
    handleRemoveLabel,
    handleChangeConversationStatus,
  };
};

export default useData;
