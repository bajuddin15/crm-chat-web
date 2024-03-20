import React from "react";
import { useSearchParams } from "react-router-dom";
import { getProfileByToken, getSenderIds, sendMessage } from "../../api";
import toast from "react-hot-toast";

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
}

const useData = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const teamEmail = searchParams.get("team");
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
    const data = await getSenderIds(token);
    const providers = data?.Provider;
    if (providers?.length > 0) {
      let provd1 = providers?.filter((item: any) => item?.isDefault === "1");
      let provd2 = providers?.filter((item: any) => item?.isDefault === "0");
      const provd = [...provd1, ...provd2];
      setSenderIds(provd);
      setSelectedSenderId(provd[0]);
    }
  };

  const handleSubmit = async () => {
    if (!phoneNumber) {
      toast.error("Enter valid mobile number");
      return;
    }
    if (!message) {
      toast.error("Enter your message");
      return;
    }
    if (requiredMediaType && !mediaLink) {
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
    };

    setLoading(true);
    const data = await sendMessage(formData);
    if (data && data?.status === 200) {
      setMessage("");
      setMediaLink(null);
      setSelectedTemplate(null);
      setRequiredMediaType(null);
      toast.success("Message sent successfully");
    } else {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (token) {
      Promise.all([fetchProfileInfo(token), fetchProviders()]);
    }
  }, [token]);

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
    handleChangeMessage,
    handleSubmit,
  };
};

export default useData;
