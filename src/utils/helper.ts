export const calculateReminderDateTime = (
  dueDate: string,
  dueTime: string,
  reminderTime: string
): number => {
  // Parse reminderTime, e.g., "15 minutes before"
  const [reminderTimeValue, reminderTimeFormat] = reminderTime.split(" ");
  const reminderOffset = parseInt(reminderTimeValue);

  // Convert dueDate and dueTime to a timestamp (using the system timezone)
  const dueDateTime = new Date(`${dueDate}T${dueTime}`).getTime();

  // Calculate reminder offset based on format
  let offsetMs = 0;
  switch (reminderTimeFormat) {
    case "minutes":
      offsetMs = reminderOffset * 60 * 1000;
      break;
    case "hours":
      offsetMs = reminderOffset * 60 * 60 * 1000;
      break;
    case "days":
      offsetMs = reminderOffset * 24 * 60 * 60 * 1000;
      break;
    default:
      throw new Error("Invalid reminder format");
  }

  // Subtract the reminder offset from the due date-time
  return dueDateTime - offsetMs;
};

export const handleDownload = (docLink: string) => {
  // fetch(docLink)
  //   .then((response) => response.blob()) // Convert response to a blob
  //   .then((blob) => {
  //     const url = window.URL.createObjectURL(blob); // Create a temporary URL for the blob
  //     const link: any = document.createElement("a");
  //     link.href = url;
  //     link.download = docLink ? docLink.split("/").pop() : "file"; // Extract filename from the URL
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link); // Clean up the link
  //     window.URL.revokeObjectURL(url); // Release the blob URL
  //   })
  //   .catch((error) => {
  //     console.error("Download error:", error);
  //   });

  const link = document.createElement("a");
  link.href = docLink;
  link.setAttribute("download", docLink.split("/").pop() || "file"); // Set download attribute to suggest a file name
  link.setAttribute("target", "_blank"); // This helps with some file types
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // Clean up the link
};
