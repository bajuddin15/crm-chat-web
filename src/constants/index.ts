export const contactStatusData = ["All", "Read", "Unread", "Archived"];
export const getOwnerNameSlice = (name: string) => {
  if (!name) return "";
  let newName = name.split(" ");
  return newName[0]?.length > 12 ? newName[0].slice(0, 11) : newName[0];
};
