import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getProfileByToken,
  getSenderIds,
  getTeamMembers,
  scheduleMessage,
  sendMessage,
} from "../../api";
import toast from "react-hot-toast";
import { MyRoleData } from "../../types/types";

interface IState {
  message: string;
  phone: string;
  senderIds: Array<any>;
  selectedSenderId: any;
  selectedEmoji: any;
  mediaLink: any;
  selectedTemplate: any;
  requiredMediaType: string | null;
  loading: boolean;
  date: string;
  time: string;
}

const useData = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const teamEmail = searchParams.get("team");
  const source = searchParams.get("source");
  const cid = searchParams.get("cid");
  const contact = searchParams.get("contact");

  const [message, setMessage] = React.useState<IState["message"]>("");
  const [phoneNumber, setPhoneNumber] = React.useState<IState["phone"]>("");
  const [senderIds, setSenderIds] = React.useState<IState["senderIds"]>([]);
  const [selectedSenderId, setSelectedSenderId] =
    React.useState<IState["selectedSenderId"]>(null);
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<IState["selectedTemplate"]>(null);
  const [selectedEmoji, setSelectedEmoji] =
    React.useState<IState["selectedEmoji"]>(null);
  const [mediaLink, setMediaLink] = React.useState<IState["mediaLink"]>(null);
  const [requiredMediaType, setRequiredMediaType] =
    React.useState<IState["requiredMediaType"]>(null);
  const [userProfileInfo, setUserProfileInfo] = React.useState<any>(null);

  const [charactersCount, setCharactersCount] = React.useState<number>(0);
  const [totalCharacters, setTotalCharacters] = React.useState<number>(0);
  const [creditCount, setCreditCount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<IState["loading"]>(false);
  const [date, setDate] = React.useState<IState["date"]>("");
  const [time, setTime] = React.useState<IState["time"]>("");

  const handleChangeMessage = (e: any) => {
    const inputValue = e.target.value;
    if (inputValue?.length <= totalCharacters) {
      setMessage(inputValue);
      countCharacters(inputValue);
    }
  };

  const countCharacters = (inputValue: string) => {
    const unicodeCharacters = [...inputValue];
    const hasUnicodeChars = /[^ -~]/.test(inputValue); // Check for any non-ASCII characters
    const unicodeCharacterCount = unicodeCharacters.length;
    let creditCount = 0;
    if (selectedSenderId?.defaultChannel === "sms") {
      if (hasUnicodeChars) {
        creditCount = Math.ceil(unicodeCharacterCount / 70);
      } else {
        creditCount = Math.ceil(inputValue.length / 160);
      }
    }
    if (mediaLink) {
      creditCount = 4;
    }
    setCharactersCount(inputValue.length);
    setCreditCount(creditCount);
  };

  const fetchProfileInfo = async (token: string) => {
    const resData = await getProfileByToken(token);
    if (resData && resData?.status === 200) {
      setUserProfileInfo(resData?.data);
    }
  };

  const fetchProviders = async () => {
    if (!token) return;
    const data = await getSenderIds(token);
    const providers = data?.Provider;
    const resData = await getTeamMembers(token);
    const teamMembers = resData?.data;
    if (providers?.length > 0) {
      let provd1 = providers?.filter((item: any) => item?.isDefault === "1");
      let provd2 = providers?.filter((item: any) => item?.isDefault === "0");
      const provd = [...provd1, ...provd2];

      let allNumbers = provd;
      let myRoleData: MyRoleData | null = null;
      if (teamMembers?.length > 0 && teamEmail) {
        const myRole = teamMembers.find(
          (item: MyRoleData) => item?.email === teamEmail
        );
        myRoleData = myRole;
      }

      if (
        myRoleData &&
        (myRoleData?.roll === "admin" || myRoleData?.roll === "adminuser")
      ) {
        allNumbers = provd;
      } else if (myRoleData && myRoleData?.roll === "standard") {
        allNumbers = provd.filter(
          (item: any) => item?.assignTo === myRoleData?.userId
        );
        if (allNumbers.length === 0) {
          allNumbers = provd.filter((item: any) => item?.assignTo === "0");
        }
      }

      setSenderIds(allNumbers);
      setSelectedSenderId(allNumbers[0]);
    }
  };

  const handleSubmit = async () => {
    if (!token) return;
    if (!phoneNumber) {
      toast.error("Enter valid mobile number");
      return;
    }
    if (!message) {
      toast.error("Enter your message");
      return;
    }
    if (
      requiredMediaType &&
      requiredMediaType.toLowerCase() !== "none" &&
      requiredMediaType.toLowerCase() !== "text" &&
      !mediaLink
    ) {
      toast.error("Attachment should be valid");
      return;
    }
    const formData = {
      token,
      to: phoneNumber,
      message,
      fromnum: selectedSenderId?.number,
      channel: selectedSenderId?.defaultChannel,
      selectedTemplate,
      mediaLink,
      source,
      teamEmail,
    };

    setLoading(true);
    const data = await sendMessage(formData);
    if (data && data?.status === 200) {
      setMessage("");
      setMediaLink(null);
      setSelectedTemplate(null);
      setRequiredMediaType(null);
      toast.success("Message sent successfully");
      let navigateUrl = `/?token=${token}`;
      if (teamEmail) {
        navigateUrl += `&team=${teamEmail}`;
      }
      navigate(navigateUrl);
    } else {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  const handleScheduleMessage = async (setOpenModal: any) => {
    if (!token) return;
    const data = {
      teamEmail,
      date,
      time,
      body: message,
      to: phoneNumber,
      fromId: selectedSenderId?.id,
      media: mediaLink,
      tempType: selectedTemplate?.type,
      tempId: selectedTemplate?.id,
      channel: selectedSenderId?.defaultChannel,
      contactId: null,
      location: null,
    };
    const resData = await scheduleMessage(token, data);
    if (resData && resData?.status === 200) {
      toast.success("Message scheduled.");
      setDate("");
      setTime("");
      setMessage("");
      setMediaLink(null);
      setPhoneNumber("");
      setSelectedTemplate(null);
      setOpenModal(false);
    }
  };

  React.useEffect(() => {
    if (token) {
      Promise.all([fetchProfileInfo(token), fetchProviders()]);
    }
  }, [token, teamEmail]);

  React.useEffect(() => {
    if (selectedTemplate) {
      let mType: string = selectedTemplate?.headertype;
      const mediaType =
        mType?.charAt(0).toUpperCase() + mType?.slice(1).toLowerCase();
      setRequiredMediaType(mediaType);
    } else {
      setRequiredMediaType(null);
    }
  }, [selectedTemplate]);

  React.useEffect(() => {
    if (selectedSenderId?.defaultChannel === "whatsapp") {
      setTotalCharacters(1024);
    } else if (selectedSenderId?.defaultChannel === "sms") {
      setTotalCharacters(640);
    }
  }, [selectedSenderId]);

  const state = {
    token,
    teamEmail,
    cid,
    contact,
    message,
    userProfileInfo,
    phoneNumber,
    senderIds,
    selectedEmoji,
    selectedSenderId,
    selectedTemplate,
    mediaLink,
    requiredMediaType,
    charactersCount,
    totalCharacters,
    creditCount,
    loading,
    date,
    time,
  };
  return {
    state,
    setMessage,
    setPhoneNumber,
    setSelectedEmoji,
    setSelectedSenderId,
    setSelectedTemplate,
    setMediaLink,
    setRequiredMediaType,
    setCharactersCount,
    setTotalCharacters,
    setCreditCount,
    setLoading,
    setDate,
    setTime,
    handleChangeMessage,
    handleSubmit,
    handleScheduleMessage,
  };
};

export default useData;
