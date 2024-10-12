export type MyRoleData = {
  name: string;
  email: string;
  roll: string;
  userId: string;
};

export type TaskType =
  | "To do"
  | "Email"
  | "Call"
  | "Meeting"
  | "Lunch"
  | "Deadline";

export type Task = {
  crmToken: string;
  _id: string;
  type: TaskType;
  name: string;
  dueDate: string;
  dueTime: string;
  reminder: boolean;
  reminderTime: {
    time: number;
    formate: string;
  };
  priority: boolean;
  completed: boolean;
  note: string;
  contacts: string[];
  accounts: string[];
  deals: string[];
  createdAt: string;
  updatedAt: string;
};

export type Template = {
  _id: string;
  crmToken: string;
  name: string;
  subject: string;
  preheader: string;
  content: string;
  imageUrl: string;
  type: "html" | "text";
  designJson: Object | null;
  createdAt: string;
  updatedAt: string;
};
