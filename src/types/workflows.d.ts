export type Workflow = {
  _id: string;
  name: string;
  description?: string;
  token: string;
  isActive: boolean;
  status: "draft" | "publish";
  triggers: string[]; // Array of ObjectIds (string)
  actions: string[]; // Array of ObjectIds (string)
  apiResponse: Array<{
    key: string;
    value: string;
  }>;
  reEnrollment: boolean;
  webhookResponse: Array<{
    key: string;
    value: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type EnrollWorkflowType = {
  _id: string;
  crmToken: string;
  conversationId: string;
  workflow: Workflow; // ObjectId reference to Workflow as string
  isEnrolled: boolean;
  createdAt: string;
  updatedAt: string;
};
