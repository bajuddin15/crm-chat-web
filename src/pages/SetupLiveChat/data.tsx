import { useSearchParams } from "react-router-dom";
import { getProfileByToken } from "../../api";
import { useEffect, useState } from "react";

const useData = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [userProfileInfo, setUserProfileInfo] = useState<any>(null);

  const fetchProfileInfo = async (token: string) => {
    const resData = await getProfileByToken(token);
    if (resData && resData?.status === 200) {
      setUserProfileInfo(resData?.data);
    }
  };

  useEffect(() => {
    if (token) fetchProfileInfo(token);
  }, [token]);

  return {
    token,
    userProfileInfo,
  };
};

export default useData;
