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
