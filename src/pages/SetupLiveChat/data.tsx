import { useSearchParams } from "react-router-dom";
import { getProfileByToken } from "../../api";
import { useEffect, useState } from "react";

type Tabs =
  | "configureWidgets"
  | "configureChannels"
  | "trackingCode"
  | "botSettings";

const useData = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [userProfileInfo, setUserProfileInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tabs>("configureWidgets");
  const [isFreePlan, setIsFreePlan] = useState<boolean>(false);

  const fetchProfileInfo = async (token: string) => {
    const resData = await getProfileByToken(token);
    if (resData && resData?.status === 200) {
      const profileData = resData?.data;
      if (profileData && profileData?.plan === "1") {
        // it is free plan so update state
        setIsFreePlan(true);
      }
      setUserProfileInfo(resData?.data);
    }
  };

  useEffect(() => {
    if (token) fetchProfileInfo(token);
  }, [token]);

  return {
    token,
    userProfileInfo,
    activeTab,
    isFreePlan,
    setActiveTab,
  };
};

export default useData;
