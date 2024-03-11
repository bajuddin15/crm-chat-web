export const contactStatusData = ["All", "Read", "Unread"];
export const getFullName = (firstName: string, lastName: string) => {
  let fullName;
  if (firstName && lastName) fullName = `${firstName} ${lastName}`;
  else if (firstName) fullName = firstName;
  else if (lastName) fullName = lastName;
  else fullName = "";
  return fullName;
};
