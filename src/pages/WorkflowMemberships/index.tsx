import { Table } from "flowbite-react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getFullName } from "../../utils/common";
import useData from "./data";
import { EnrollWorkflowType } from "../../types/workflows";
import EnrollWorkflow from "./components/EnrollWorkflow";
import moment from "moment";

const WorkflowMemberships = () => {
  const navigate = useNavigate();

  const { state, fetchEnrollWorkflows } = useData();
  const {
    token,
    currentContact,
    contactProfileDetails,
    enrollWorkflows,
    workflows,
  } = state;

  return (
    <div className="">
      {/* header */}
      <div className="container border-b border-b-gray-300 h-[10vh] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-blue-50 rounded-md"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-base font-medium">
            Workflow memberships for{" "}
            {getFullName(
              contactProfileDetails?.fname,
              contactProfileDetails?.lname
            )}
          </h2>
        </div>
        <EnrollWorkflow
          token={token as string}
          conversationId={currentContact?.conversationId}
          contactProfileDetails={contactProfileDetails}
          workflows={workflows}
          fetchEnrollWorkflows={fetchEnrollWorkflows}
        />
      </div>

      <div className="container overflow-x-autos my-10">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Enroll date</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {enrollWorkflows?.map((item: EnrollWorkflowType) => {
              return (
                <Table.Row
                  key={item?._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {item?.workflow?.name}
                  </Table.Cell>
                  <Table.Cell>
                    {moment(item?.createdAt).format("MMM D, YYYY h:mm A")}
                  </Table.Cell>
                  <Table.Cell>
                    {item?.isEnrolled ? (
                      <span>Enrolled</span>
                    ) : (
                      <span>Completed</span>
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default WorkflowMemberships;
