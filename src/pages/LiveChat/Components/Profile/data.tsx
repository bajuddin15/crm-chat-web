import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

interface IState {
  showNotifications: boolean;
  unreadNotifications: any[];
}
const useData = () => {
  const notifications = useSelector(
    (state: RootState) => state.store.notifications
  );

  const [showNotifications, setShowNotifications] =
    React.useState<IState["showNotifications"]>(false);
  const [unreadNotifications, setUnreadNotifications] = React.useState<
    IState["unreadNotifications"]
  >([]);

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
  };

  return {
    state,
    setShowNotifications,
    setUnreadNotifications,
  };
};

export default useData;
