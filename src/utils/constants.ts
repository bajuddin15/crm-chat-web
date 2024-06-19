import p1 from "../assets/images/phone1.png";

const BASE_URL = "https://app.crm-messaging.cloud/index.php/api";
const API_URLS = {
  getContacts: `${BASE_URL}/getConversationContact2`,
};

const colors = {
  primary: "#2046D0",
  // whatsapp: "#25D366",
  whatsapp: "#128C7E",
};

export const PHONE_IMG1 = p1;

export { API_URLS, colors };
