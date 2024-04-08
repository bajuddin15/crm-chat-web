export const VOICE_API_BASE_URL = "https://voice.crm-messaging.cloud";

export const AVATAR_URL =
  "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg";

export const contactStatusData = ["All", "Read", "Unread", "Archived"];
export const getOwnerNameSlice = (name: string) => {
  if (!name) return "";
  let newName = name.split(" ");
  return newName[0]?.length > 12 ? newName[0].slice(0, 11) : newName[0];
};

export const getTitleOfVoiceCall = (name: any, number: any) => {
  return name && name !== " " && name !== "null" && name !== "undefined"
    ? name
    : number;
};
