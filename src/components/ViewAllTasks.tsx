import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  CircleCheckBig,
  Flag,
  Mail,
  PhoneCall,
  Utensils,
} from "lucide-react";
import React, { useState } from "react";
import { Task } from "../types/types";
import moment from "moment";
import EditTaskModal from "./Modals/EditTaskModal";

interface IProps {
  token: string;
  tasks: Task[];
  setShowAllTasksComp: (val: boolean) => void;
  handleCloseOpenTask: (taskId: string) => void;
  handleDeleteTask: (taskId: string) => void;
  fetchTasksForConversation: () => void;
  currentContact: any;
}

const ViewAllTasks: React.FC<IProps> = ({
  token,
  tasks,
  setShowAllTasksComp,
  handleCloseOpenTask,
  handleDeleteTask,
  fetchTasksForConversation,
  currentContact,
}) => {
  const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>([]);
  const toggleTaskExpand = (taskId: string) => {
    if (expandedTaskIds.includes(taskId)) {
      // If the task is already expanded, remove it from the array
      setExpandedTaskIds(expandedTaskIds.filter((id) => id !== taskId));
    } else {
      // Otherwise, add it to the array
      setExpandedTaskIds([...expandedTaskIds, taskId]);
    }
  };
  return (
    <div className="space-y-5 p-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div
          className="cursor-pointer p-1 rounded-md hover:bg-blue-100"
          onClick={() => setShowAllTasksComp(false)}
        >
          <ChevronLeft size={18} color="gray" />
        </div>
        <span className="text-sm">Tasks</span>
      </div>

      {/* tasks */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="bg-blue-100 px-5 py-5 rounded-xl">
            <span className="text-sm">No tasks available</span>
          </div>
        ) : (
          tasks
            // .filter((item) => !item?.completed)
            .map((item) => {
              const isExpanded = expandedTaskIds.includes(item?._id); // Check if the task is expanded
              return (
                <div
                  key={item?._id}
                  className={`shadow-sm rounded-xl ${
                    item?.completed
                      ? "bg-green-500 text-white"
                      : "border border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {item?.type === "To do" && <CircleCheckBig size={18} />}
                        {item?.type === "Email" && <Mail size={18} />}
                        {item?.type === "Call" && <PhoneCall size={18} />}
                        {item?.type === "Meeting" && <Calendar size={18} />}
                        {item?.type === "Lunch" && <Utensils size={18} />}
                        {item?.type === "Deadline" && <Flag size={18} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {item?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {moment(item?.createdAt).format(
                            "DD/MM/YYYY [at] HH:mm"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCloseOpenTask(item?._id)}
                        className={`text-sm border border-gray-300 ${
                          !item.completed
                            ? "hover:bg-gray-50"
                            : "hover:bg-gray-50/20"
                        } px-3 py-[6px] rounded-full`}
                      >
                        {item?.completed ? "Undone" : "Done"}
                      </button>
                      <button onClick={() => toggleTaskExpand(item?._id)}>
                        {isExpanded ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="border-t border-t-gray-300 p-3 space-y-4">
                      <div className="flex items-center gap-10">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Due date
                          </p>
                          <p className="text-xs">
                            {moment(
                              `${item?.dueDate} ${item?.dueTime}`,
                              "YYYY-MM-DD HH:mm"
                            ).format("DD/MM/YYYY [at] HH:mm")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Reminder
                          </p>
                          <p className="text-xs">
                            {item?.reminder
                              ? `${item?.reminderTime?.time} ${item?.reminderTime?.formate} before`
                              : "No reminder"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <EditTaskModal
                          currentTask={item}
                          token={token}
                          fetchTasksForConversation={fetchTasksForConversation}
                          currentContact={currentContact}
                        />
                        <button
                          onClick={() => handleDeleteTask(item?._id)}
                          className="text-xs text-red-500 font-medium hover:text-red-500/90 rounded-xl"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default ViewAllTasks;
