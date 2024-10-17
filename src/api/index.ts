import axios from "axios";
import toast from "react-hot-toast";

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
  const MAX_FILE_SIZE_MB = 16;
  const ALLOWED_EXTENSIONS = [
    "gif",
    "jpg",
    "jpeg",
    "png",
    "mp4",
    "mp3",
    "avi",
    "doc",
    "docx",
    "pdf",
  ];
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    // Convert MB to bytes
    toast.error("File size exceeds the maximum allowed size (16MB)");
    return null; // Stop further processing
  }

  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  if (!fileExtension || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
    toast.error("File type is not supported");
    return null; // Stop further processing
  }
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

const getConvContacts = async (accessToken: string, filterFormData: any) => {
  const { page, status, teamEmail, labelId, ownerId } = filterFormData;
  const url =
    "https://app.crm-messaging.cloud/index.php/api/getConversationContact3";
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const queryParams = {
    page: page,
    filter: status,
    team: teamEmail,
    owner_id: ownerId,
    label_id: labelId,
  };

  let contacts = [];
  try {
    const { data } = await axios.get(url, {
      headers: headers,
      params: queryParams, // Passing query parameters here
    });
    contacts = data;
  } catch (error: any) {
    // Handle error
  }
  return contacts;
};

const getConvViewChats = async (
  token: string,
  contact: string,
  conversationId: string
) => {
  let chatsData = null;
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const getChatsApiUrl =
      "https://app.crm-messaging.cloud/index.php/api/getconversationview4";
    const formData = new FormData();
    formData.append("contact", contact);
    formData.append("cid", conversationId);
    const resp2 = await axios.post(getChatsApiUrl, formData, { headers });
    chatsData = resp2?.data;
  } catch (error: any) {
    chatsData = null;
  }
  return chatsData;
};
export const getConvViewChatsView = async (token: string, contact: string) => {
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
    chatsData = null;
  }
  return chatsData;
};

const sendMessage = async (msgData: any) => {
  let data;
  const {
    token,
    to,
    message,
    fromnum,
    channel,
    selectedTemplate,
    mediaLink,
    source,
    teamEmail,
  } = msgData;
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
    if (source) {
      formData.append("source", source);
    }
    if (teamEmail) {
      formData.append("team", teamEmail);
    }

    const res = await axios.post(url, formData, { headers });
    data = res?.data;
  } catch (err: any) {
    if (err && err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
    } else {
      toast.error(err?.message);
    }
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
  }
  return contactsData;
};

const changeReadStatus = async (data: any) => {
  const { conId, id, token, tab } = data;
  const url = "https://app.crm-messaging.cloud/index.php/Message/readstatus";
  if (!conId || !id || !token || !tab) {
    return;
  }
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const formData = new FormData();
  formData.append("conId", conId);
  formData.append("id", id);
  formData.append("tab", tab);

  let resData;
  try {
    const { data } = await axios.post(url, formData, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const getProfileByToken = async (token: string) => {
  const url = "https://app.crm-messaging.cloud/index.php/Api/getProfileInfo";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  let resData;
  try {
    const { data } = await axios.get(url, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const makeArchivedContact = async (
  token: string,
  conversationId: string,
  arc: string
) => {
  const url = "https://app.crm-messaging.cloud/index.php/Message/makeArchive";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("conId", conversationId);
  formData.append("arc", arc);

  let resData;
  try {
    const { data } = await axios.post(url, formData, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const addTagByCid = async (token: string, tag: string, cid: string) => {
  const url = "https://app.crm-messaging.cloud/index.php/Message/addTag";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("cid", cid);
  formData.append("tag", tag);

  let resData;
  try {
    const { data } = await axios.post(url, formData, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};
const addNoteByCid = async (token: string, note: string, cid: string) => {
  const url = "https://app.crm-messaging.cloud/index.php/Message/addNote";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("cid", cid);
  formData.append("note", note);

  let resData;
  try {
    const { data } = await axios.post(url, formData, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const getAllTagsByCid = async (token: string, conversationId: string) => {
  const url = "https://app.crm-messaging.cloud/index.php/Message/viewTag";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("cid", conversationId);

  let resData;

  try {
    const { data } = await axios.post(url, formData, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};
const getAllNotesByCid = async (token: string, conversationId: string) => {
  const url = "https://app.crm-messaging.cloud/index.php/Message/viewNote";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("cid", conversationId);

  let resData;

  try {
    const { data } = await axios.post(url, formData, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const deleteTag = async (token: string, tagId: string) => {
  const url = "https://app.crm-messaging.cloud/index.php/Message/deleteTag";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("tagId", tagId);

  let resData;

  try {
    const { data } = await axios.post(url, formData, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};
const deleteNote = async (token: string, noteId: string) => {
  const url = "https://app.crm-messaging.cloud/index.php/Message/deleteNote";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("noteId", noteId);

  let resData;

  try {
    const { data } = await axios.post(url, formData, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const getUnreadMessages = async (token: string) => {
  const url =
    "https://app.crm-messaging.cloud/index.php/App/fetchUnreadMessages";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  let resData;

  try {
    const { data } = await axios.get(url, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const getTeamMembers = async (token: string) => {
  const url = "https://app.crm-messaging.cloud/index.php/Team/getTeamMembers";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  let resData;

  try {
    const { data } = await axios.get(url, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const assignConversationByCid = async (
  token: string,
  memberEmail: string,
  conversationId: string,
  teamEmail: string
) => {
  const url = "https://app.crm-messaging.cloud/index.php/Team/assignCon";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("member", memberEmail);
  formData.append("con_id", conversationId);
  formData.append("team", teamEmail);

  let resData;

  try {
    const { data } = await axios.post(url, formData, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const addLabelByCid = async (
  token: string,
  conversationId: string,
  label: string
) => {
  const url = "https://app.crm-messaging.cloud/index.php/Message/addLabel";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("cid", conversationId);
  formData.append("label", label);

  let resData;

  try {
    const { data } = await axios.post(url, formData, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const fetchLabelsByCid = async (token: string, conversationId: string) => {
  const url = "https://app.crm-messaging.cloud/index.php/Message/viewLabel";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("cid", conversationId);

  let resData;

  try {
    const { data } = await axios.post(url, formData, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const deleteLabel = async (
  token: string,
  labelId: string,
  conversationId: string
) => {
  const url = "https://app.crm-messaging.cloud/index.php/Message/deleteLabel";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("label_id", labelId);
  formData.append("cid", conversationId);

  let resData;

  try {
    const { data } = await axios.post(url, formData, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const getAllLabelsByToken = async (token: string) => {
  const url = "https://app.crm-messaging.cloud/index.php/Message/fetchlabels";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  let resData;

  try {
    const { data } = await axios.get(url, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const generateShortUrl = async (longUrl: string) => {
  const url = "https://app.crm-messaging.cloud/index.php/App/shortUrl";

  const formData = new FormData();
  formData.append("url", longUrl);

  let resData;

  try {
    const { data } = await axios.post(url, formData);
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const scheduleMessage = async (token: string, scheduleData: any) => {
  const {
    teamEmail,
    date,
    time,
    body,
    to,
    fromId,
    media,
    tempType,
    tempId,
    channel,
    contactId,
    location,
  } = scheduleData;
  if (!teamEmail) {
    toast.error("Team email is mandatory");
    return;
  }
  if (!date) {
    toast.error("Select date for schedule message");
    return;
  }
  if (!time) {
    toast.error("Select time for schedule message");
    return;
  }
  if (!body) {
    toast.error("Please write a valid message");
    return;
  }
  if (!to) {
    toast.error("Phone number should be valid");
    return;
  }
  if (!fromId) {
    toast.error("Please select a sender number");
    return;
  }

  const url =
    "https://app.crm-messaging.cloud/index.php/Schedule/scheduleMessage";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();

  formData.append("team", teamEmail);
  formData.append("date", date);
  formData.append("time", time);
  formData.append("body", body);
  formData.append("to", to);
  formData.append("fromId", fromId);
  formData.append("channel", channel);
  if (media) {
    formData.append("media", media);
  }
  if (channel === "whatsapp" && tempType && tempId) {
    formData.append("tempType", tempType);
    formData.append("tempId", tempId);
  }
  if (channel === "whatsapp" && contactId) {
    formData.append("contactId", contactId);
  }
  if (channel === "whatsapp" && location) {
    formData.append("location", location);
  }

  let resData;

  try {
    const { data } = await axios.post(url, formData, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

const updateContactApi = async (token: string, contactData: any) => {
  const { firstName, lastName, email, phone, newPhone } = contactData;
  const url = "https://app.crm-messaging.cloud/index.php/api/updateContactApi";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("phone", phone);

  if (firstName) {
    formData.append("fname", firstName);
  }
  if (lastName) {
    formData.append("lname", lastName);
  }
  if (email) {
    formData.append("email", email);
  }
  if (newPhone) {
    formData.append("new_phone", newPhone);
  }

  let resData;

  try {
    const { data } = await axios.post(url, formData, { headers });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};

// const getProviderDetails = async (token: string, providerNumber: string) => {
//   const url =
//     "https://app.crm-messaging.cloud/index.php/api/fetchProviderDetails";

//   const headers = {
//     Authorization: `Bearer ${token}`,
//   };

//   const formData = new FormData();
//   formData.append("provider_number", providerNumber);

//   let resData;
//   try {
//     const { data } = await axios.post(url, formData, { headers });
//     resData = data;
//   } catch (error) {
//     resData = null;
//   }
//   return resData;
// };

const generateMessageFromAi = async (userId: string, convId: string) => {
  if (!userId) {
    console.log("User id required");
    return;
  }
  if (!convId) {
    console.log("Conversation id required");
    return;
  }
  let resData;
  try {
    const apiUrl = "https://app.crm-messaging.cloud/index.php/OpenAI/compose";
    const formData = new FormData();
    formData.append("key", "openai-doremon");
    formData.append("type", "con");
    formData.append("id", userId);
    formData.append("conId", convId);

    const { data } = await axios.post(apiUrl, formData);
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
};
const addAiCredit = async (credits: any, userId: any) => {
  const url = "https://app.crm-messaging.cloud/index.php/Admin/addAiCredit";

  let resData;
  try {
    const cred = `-${credits}`;
    const uid = userId;
    const formData = new FormData();
    formData.append("cred", cred);
    formData.append("uid", uid);

    const { data } = await axios.post(url, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    resData = data;
  } catch (error) {
    resData = null;
  }
  return resData;
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
  changeReadStatus,
  getProfileByToken,
  makeArchivedContact,
  addTagByCid,
  addNoteByCid,
  getAllTagsByCid,
  getAllNotesByCid,
  deleteTag,
  deleteNote,
  getUnreadMessages,
  getTeamMembers,
  assignConversationByCid,
  addLabelByCid,
  fetchLabelsByCid,
  deleteLabel,
  getAllLabelsByToken,
  generateShortUrl,
  scheduleMessage,
  updateContactApi,
  // getProviderDetails,
  generateMessageFromAi,
  addAiCredit,
};
