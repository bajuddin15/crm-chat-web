import axios from "axios";

const getSenderIds = async (token: any) => {
  const url =
    "https://app.crm-messaging.cloud/index.php/Api/getProviderDetails/";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const { data } = await axios.get(url, { headers });
    return data;
  } catch (error) {
    return [];
  }
};

const getAllTemplates = async (token: any) => {
  const url = "https://app.crm-messaging.cloud/index.php/Api/getTemplate/";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const { data } = await axios.get(url, { headers });
    const tmpData = data?.Templates.filter(
      (item: any) => item.isApproved === "1"
    );
    return tmpData;
  } catch (err) {
    return null;
  }
};

const getUploadedUrl = async (file: any) => {
  const url = "https://app.crm-messaging.cloud/index.php/api/upload";

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  const formData = new FormData();
  formData.append("userfile", file);

  try {
    const { data } = await axios.post(url, formData, { headers });
    return data;
  } catch (error: any) {
    return null;
  }
};

const getConvContacts = async (acessToken: string, page: number) => {
  const url = `https://app.crm-messaging.cloud/index.php/api/getConversationContact3?page=${page}`;
  const headers = {
    Authorization: `Bearer ${acessToken}`,
  };
  let contacts = [];
  try {
    const { data } = await axios.get(url, { headers });
    contacts = data;
  } catch (error: any) {}
  return contacts;
};

const getConvViewChats = async (token: string, contact: string) => {
  let chatsData = null;
  try {
    // get cid from contact
    const getCidApiUrl =
      "https://app.crm-messaging.cloud/index.php/Api/getcid3";
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const formData = new FormData();
    formData.append("contact", contact);
    const resp1 = await axios.post(getCidApiUrl, formData, { headers });
    if (resp1.status === 200) {
      const cid = resp1.data?.cid;
      const getChatsApiUrl =
        "https://app.crm-messaging.cloud/index.php/api/getconversationview4";
      formData.append("cid", cid);
      const resp2 = await axios.post(getChatsApiUrl, formData, { headers });
      chatsData = resp2?.data;
    }
  } catch (error: any) {
    console.log("Featch chats Error : ", error);
  }
  return chatsData;
};

const sendMessage = async (msgData: any) => {
  let data;
  const { token, to, message, fromnum, channel, selectedTemplate, mediaLink } =
    msgData;
  try {
    const url = "https://app.crm-messaging.cloud/index.php/Api/sendMsg";
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const formData = new FormData();
    formData.append("to", to);
    formData.append("msg", message);
    formData.append("fromnum", fromnum);
    formData.append("channel", channel);
    if (selectedTemplate) {
      formData.append("tempName", selectedTemplate?.unqName);
    }
    if (mediaLink) {
      formData.append("mediaUrl", mediaLink);
    }

    const res = await axios.post(url, formData, { headers });
    data = res?.data;
  } catch (err: any) {
    data = null;
  }
  return data;
};

const createNewContact = async (token: string, contactData: any) => {
  const url = "https://app.crm-messaging.cloud/index.php/Api/createContact";

  const { phone, fname, lname, email } = contactData;

  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("phone", phone);
  formData.append("fname", fname);
  formData.append("lname", lname);
  formData.append("email", email);

  try {
    const { data } = await axios.post(url, formData, { headers });
    return data;
  } catch (error) {
    return null;
  }
};

const getIncomingMessages = async (
  token: any,
  conversationId: any,
  timestamp: any
) => {
  let newResData;
  try {
    const apiUrl =
      "https://app.crm-messaging.cloud/index.php/App/getIncomingMessages";
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };
    const formData = new FormData();
    formData.append("conId", conversationId);
    formData.append("timestamp", timestamp);
    const { data } = await axios.post(apiUrl, formData, { headers });
    newResData = data;
  } catch (error: any) {
    newResData = null;
  }
  return newResData;
};

const getContactDetails = async (token: string, contact: string) => {
  let contactDetails;
  try {
    const apiUrl =
      "https://app.crm-messaging.cloud/index.php/Api/getPhoneDetailsAPI";
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };
    const formData = new FormData();
    formData.append("phone", contact);

    const { data } = await axios.post(apiUrl, formData, { headers });
    contactDetails = data;
  } catch (error: any) {
    contactDetails = null;
  }
  return contactDetails;
};

const getCRMContacts = async (token: string) => {
  const url = "https://app.crm-messaging.cloud/index.php/Api/getContact2";

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const { data } = await axios.get(url, { headers });
    return data;
  } catch (error) {
    return null;
  }
};

const getConvId = async (token: string, contact: string) => {
  try {
    const getCidApiUrl =
      "https://app.crm-messaging.cloud/index.php/Api/getcid3";
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const formData = new FormData();
    formData.append("contact", contact);
    const { data } = await axios.post(getCidApiUrl, formData, { headers });
    return data;
  } catch (error) {
    return null;
  }
};

const getSearchContacts = async (token: string, searchInput: string) => {
  const uri = "https://app.crm-messaging.cloud/index.php/Api/consearchbytoken";
  let contactsData;
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const formData = new FormData();
    formData.append("txt", searchInput);
    const { data } = await axios.post(uri, formData, { headers });
    contactsData = data;
  } catch (error: any) {
    contactsData = null;
    console.log("Error: ", error);
  }
  return contactsData;
};

export {
  getSenderIds,
  getAllTemplates,
  getUploadedUrl,
  getConvContacts,
  getConvViewChats,
  sendMessage,
  createNewContact,
  getIncomingMessages,
  getContactDetails,
  getCRMContacts,
  getConvId,
  getSearchContacts,
};
