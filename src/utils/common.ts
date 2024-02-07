import moment from "moment";

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

export { getFormatedDate, identifyFileType };
