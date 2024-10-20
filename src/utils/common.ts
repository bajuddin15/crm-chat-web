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
  if (companyName?.length > 17) {
    if (companyName?.includes(" ")) {
      return companyName?.split(" ")[0];
    } else {
      return `${companyName.slice(0, 17)}...`;
    }
  } else {
    return companyName;
  }
};

const handleCopy = async (textToCopy: string) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    toast.success("Copied to clipboard!.");
  } catch (err) {
    toast.error("Copied Failed. Please try again.");
  }
};

const extractUsername = (email: string) => {
  // Check if the email is valid
  if (!email.includes("@")) {
    return "Invalid email format";
  }

  // Split the email address at the "@" symbol
  let parts = email.split("@");

  // Extract the portion before the "@" symbol
  let username = parts[0];

  return username;
};

const setJwtTokenInLocalStorage = (token: string) => {
  localStorage.setItem("jwtToken", token);
};

const getJwtTokenFromLocalStorage = () => {
  const token = localStorage.getItem("jwtToken");
  return token;
};

export const getFormatedTime = (timestamp: string) => {
  // like 02:12 pm, Sunday, Monday... etc
  if (!timestamp) return "";
  const now = moment();
  const createdAt = moment(timestamp);
  const diffInSeconds = now.diff(createdAt, "seconds");

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec. ago`;
  } else if (diffInSeconds < 3600) {
    return `${moment.duration(diffInSeconds, "seconds").minutes()} min. ago`;
  } else if (diffInSeconds < 86400) {
    return createdAt.format("h:mm A");
  } else if (diffInSeconds < 604800) {
    return createdAt.format("ddd");
  } else {
    return createdAt.format("MM/DD/YYYY");
  }
};

export const formatCreatedAt = (createdAt: string) => {
  // just like 1s, 1m, 1h, 1w
  const now = moment(); // Current date and time
  const timestamp = moment(createdAt); // Convert createdAt string to moment object

  // Calculate difference in milliseconds between now and createdAt
  const diffMilliseconds = now.diff(timestamp);

  // Calculate difference in seconds, minutes, hours, and weeks
  const diffSeconds = Math.floor(diffMilliseconds / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  // Determine the appropriate relative time format based on the difference
  if (diffWeeks > 0) {
    return `${diffWeeks}w`; // Weeks
  } else if (diffDays > 0) {
    return `${diffDays}d`; // Days
  } else if (diffHours > 0) {
    return `${diffHours}h`; // Hours
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m`; // Minutes
  } else {
    return `${diffSeconds}s`; // Seconds (fallback)
  }
};

export function transformLinks(message: string, color: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return message.replace(
    urlRegex,
    `<a href="$1" target="_blank" style="color: ${color}; text-decoration: underline;">$1</a>`
  );
}

export const decodeUrlString = (value: string) => {
  return decodeURIComponent(value.replace(/\+/g, "%20")).replace(/ /g, "+");
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
  extractUsername,
  setJwtTokenInLocalStorage,
  getJwtTokenFromLocalStorage,
};
