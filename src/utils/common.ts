import moment from "moment";
import toast from "react-hot-toast";

const getFormatedDate = (providedDate: string) => {
  const parsedDate = moment(providedDate, "YYYY-MM-DD HH:mm:ss");
  const today = moment().startOf("day");
  const yesterday = moment().subtract(1, "days").startOf("day");
  if (parsedDate.isSame(today, "d")) {
    const formattedTime = parsedDate.format("h:mm A");
    return formattedTime;
  } else if (parsedDate.isSame(yesterday, "d")) {
    //   const formattedTime = parsedDate.format('h:mm A');
    return "Yesterday";
  } else {
    const formattedDate = parsedDate.format("DD MMM YYYY");
    return formattedDate;
  }
};

function identifyFileType(url: string): string {
  if (!url) return "";
  const imageExtensions: string[] = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
  const documentExtensions: string[] = [
    "doc",
    "docx",
    "pdf",
    "txt",
    "rtf",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
  ];
  const videoExtensions: string[] = ["mp4", "avi", "mov", "wmv", "flv", "mkv"];

  const fileExtension: string = url.split(".").pop()?.toLowerCase() || "";

  if (imageExtensions.includes(fileExtension)) {
    return "image";
  } else if (documentExtensions.includes(fileExtension)) {
    return "document";
  } else if (videoExtensions.includes(fileExtension)) {
    return "video";
  } else {
    if (url) {
      return "unknown";
    }
    return "";
  }
}

const getUniqueContacts = (contacts: any) => {
  let uniqueIds = new Set();
  let uniqueContacts: any = [];

  contacts.forEach((obj: any) => {
    if (!uniqueIds.has(obj?.conversationId)) {
      uniqueIds.add(obj?.conversationId);
      uniqueContacts.push(obj);
    }
  });

  return uniqueContacts;
};

const getFullName = (firstName: string, lastName: string) => {
  let fullName;
  if (firstName === "null" && lastName === "null") {
    fullName = "";
  } else if (firstName === "undefined" && lastName === "undefined") {
    fullName = "";
  }

  if (firstName && lastName) {
    fullName = `${firstName} ${lastName}`;
  } else if (firstName) {
    fullName = firstName;
  } else if (lastName) {
    fullName = lastName;
  } else fullName = "";
  return fullName;
};

const getUnreadMsgCountByCid = (unreadMsgs: any, cid: string, contact: any) => {
  let findItem;
  for (let i = 0; i < unreadMsgs?.length; i++) {
    let item = unreadMsgs[i];
    if (item?.cid === cid || item?.fromnumber === contact) {
      findItem = item;
      break;
    }
  }

  return findItem ? findItem?.message_count : 1;
};

function formatDateOfChat(dateString: string) {
  const parsedDate = moment(dateString, "YYYY-MM-DD HH:mm:ss");
  const today = moment().startOf("day");
  const yesterday = moment().subtract(1, "days").startOf("day");
  if (parsedDate.isSame(today, "d")) {
    const formattedTime = parsedDate.format("h:mm A");
    return formattedTime;
  } else if (parsedDate.isSame(yesterday, "d")) {
    const formattedTime = parsedDate.format("h:mm A");
    return `Yesterday, ${formattedTime}`;
  } else {
    return moment(dateString).format("DD MMM YYYY, hh:mm A");
  }
}

const trimCompanyName = (companyName: string): string => {
  if (companyName?.length > 20) {
    if (companyName?.includes(" ")) {
      return companyName?.split(" ")[0];
    } else {
      return `${companyName.slice(0, 20)}...`;
    }
  } else {
    return companyName;
  }
};

const handleCopy = async (textToCopy: string) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    toast.success("Url Copied.");
  } catch (err) {
    toast.error("Copied Failed. Please try again.");
  }
};

export {
  getFormatedDate,
  identifyFileType,
  getUniqueContacts,
  getFullName,
  getUnreadMsgCountByCid,
  formatDateOfChat,
  trimCompanyName,
  handleCopy,
};
