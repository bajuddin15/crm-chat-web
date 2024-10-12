import axios from "axios";
import { useLocation, useSearchParams } from "react-router-dom";
import { decodeUrlString } from "../../utils/common";
import { EnrollWorkflowType, Workflow } from "../../types/workflows";
import { useCallback, useEffect, useState } from "react";
import { WORKFLOW_BASE_URL } from "../../constants";

interface IState {
  workflows: Workflow[];
  enrollWorkflows: EnrollWorkflowType[];
}

const useData = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  let teamEmail = searchParams.get("team") || "";
  teamEmail = decodeUrlString(teamEmail);
  const location = useLocation();
  const { currentContact, contactProfileDetails } = location?.state || {};

  const [workflows, setWorkflows] = useState<IState["workflows"]>([]);
  const [enrollWorkflows, setEnrollWorkflows] = useState<
    IState["enrollWorkflows"]
  >([]);

  useEffect(() => {
    if (token) {
      fetchWorkflows();
    }
  }, [token]);
  useEffect(() => {
    if (token && currentContact) {
      fetchEnrollWorkflows();
    }
  }, [token, currentContact]);

  const fetchWorkflows = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${WORKFLOW_BASE_URL}/api/workflow/conversationWorkflows/${token}`
      );
      if (data && data?.success) {
        setWorkflows(data?.data);
      }
    } catch (error: any) {
      console.log("Error in fetch workflows: ", error?.message);
    }
  }, [token]);

  const fetchEnrollWorkflows = useCallback(async () => {
    try {
      const formData = {
        crmToken: token,
        conversationId: currentContact?.conversationId,
      };
      const { data } = await axios.post(
        `${WORKFLOW_BASE_URL}/api/enrollWorkflowsInConversation`,
        formData
      );
      if (data && data?.success) {
        setEnrollWorkflows(data?.data);
      }
    } catch (error: any) {
      console.log(
        "Error in fetch enroll workflows in conversation: ",
        error?.message
      );
    }
  }, [token, currentContact]);

  const state = {
    token,
    teamEmail,
    workflows,
    currentContact,
    contactProfileDetails,
    enrollWorkflows,
  };
  return {
    state,
    setWorkflows,
    fetchEnrollWorkflows,
  };
};

export default useData;
