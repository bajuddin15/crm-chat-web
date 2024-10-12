import { Button, Modal } from "flowbite-react";
import React, { useState } from "react";
import { getFullName } from "../../../utils/common";
import { Workflow } from "../../../types/workflows";
import toast from "react-hot-toast";
import axios from "axios";
import { WORKFLOW_BASE_URL } from "../../../constants";

interface IProps {
  token: string;
  conversationId: string;
  contactProfileDetails: any;
  workflows: Workflow[];
  fetchEnrollWorkflows: () => void;
}

const EnrollWorkflow: React.FC<IProps> = ({
  token,
  conversationId,
  contactProfileDetails,
  workflows,
  fetchEnrollWorkflows,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleEnrollWorkflow = async () => {
    try {
      if (!contactProfileDetails?.phone) {
        toast.error("Phone number is required");
        return;
      }
      setLoading(true);
      const contactFullName = getFullName(
        contactProfileDetails?.fname,
        contactProfileDetails?.lname
      );
      const formData = {
        crmToken: token,
        conversationId: conversationId,
        workflow: selectedWorkflowId,
        isEnrolled: true,
        email: contactProfileDetails?.email || "",
        phoneNumber: contactProfileDetails?.phone || "",
        contactName: contactFullName,
      };
      const { data } = await axios.post(
        `${WORKFLOW_BASE_URL}/api/enrollWorkflowsInConversation/enroll`,
        formData
      );
      if (data?.success) {
        toast.success(data.message);
        fetchEnrollWorkflows();
        setOpenModal(false); // Close modal after successful enrollment
      }
    } catch (error: any) {
      console.log("Error in enroll workflow: ", error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setOpenModal(true)} color="blue" size="sm">
        Enroll in workflow
      </Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>
          Enroll{" "}
          {getFullName(
            contactProfileDetails?.fname,
            contactProfileDetails?.lname
          )}{" "}
          in a workflow
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <select
              className="w-full rounded-md"
              name="selectWorkflow"
              id="selectWorkflow"
              value={selectedWorkflowId}
              onChange={(e) => setSelectedWorkflowId(e.target.value)} // Fix onChange handler
            >
              <option value="">Select workflow</option>
              {workflows.map((item: Workflow) => (
                <option value={item._id} key={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={loading}
            onClick={handleEnrollWorkflow}
            size="sm"
            color="blue"
          >
            Enroll
          </Button>
          <Button size="sm" color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default React.memo(EnrollWorkflow);
