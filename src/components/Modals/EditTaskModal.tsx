import axios from "axios";
import { Modal, ToggleSwitch } from "flowbite-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CAMPAIGN_BASE_URL } from "../../constants";
import { Task, TaskType } from "../../types/types";
import { calculateReminderDateTime } from "../../utils/helper";
import { getProfileByToken, getTeamMembers } from "../../api";

interface IProps {
  token: string;
  currentTask: Task; // This is the task to be edited
  currentContact: any;
  fetchTasksForConversation: () => void;
}

const EditTaskModal: React.FC<IProps> = ({
  token,
  currentTask,
  currentContact,
  fetchTasksForConversation,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({
    name: currentTask?.name || "To do",
    type: currentTask?.type || "To do",
    dueDate: currentTask?.dueDate || "",
    dueTime: currentTask?.dueTime || "",
    reminder: currentTask?.reminder || false,
    reminderTime:
      `${currentTask?.reminderTime?.time} ${currentTask?.reminderTime?.formate} before` ||
      "15 minutes before",
    priority: currentTask?.priority || false,
    note: currentTask?.note || "",
  });

  // Get today's date in the format YYYY-MM-DD for the `min` attribute
  const today = new Date().toISOString().split("T")[0];

  // Get the current time in the format HH:MM for time comparison
  const currentTime = new Date().toTimeString().slice(0, 5);

  // Pre-populate form values when the modal opens
  useEffect(() => {
    if (currentTask) {
      setFormValues({
        name: currentTask?.name || "To do",
        type: currentTask?.type || "To do",
        dueDate: currentTask?.dueDate || "",
        dueTime: currentTask?.dueTime || "",
        reminder: currentTask?.reminder || false,
        reminderTime:
          `${currentTask?.reminderTime?.time} ${currentTask?.reminderTime?.formate} before` ||
          "15 minutes before",
        priority: currentTask?.priority || false,
        note: currentTask?.note || "",
      });
    }
  }, [currentTask]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "dueTime") {
      // Check if the selected date is today and the selected time is in the past
      if (formValues.dueDate === today && value < currentTime) {
        toast.error("Please select a future time.");
        return;
      }
    }

    if (name === "type") {
      setFormValues({ ...formValues, type: value as TaskType, name: value });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleUpdateTask = async () => {
    if (!formValues.name) {
      toast.error("Task name is required");
      return;
    }

    if (!formValues.dueDate) {
      toast.error("Due date is required");
      return;
    }
    if (!formValues.dueTime) {
      toast.error("Due time is required");
      return;
    }

    try {
      // find toEmail for send reminder
      let toEmail = "";
      if (currentContact?.owner) {
        let owner = currentContact?.owner;
        const resData = await getTeamMembers(token);
        const teamMembers = resData?.data;
        if (teamMembers?.length > 0) {
          let findMember = teamMembers?.find(
            (item: any) => item?.userId === owner
          );
          toEmail = findMember?.email || "";
        }
      } else {
        const resData = await getProfileByToken(token);
        if (resData && resData?.status === 200) {
          const profileData = resData?.data;
          toEmail = profileData?.email || "";
        }
      }

      const reminderTimeData = formValues.reminderTime
        ? formValues.reminderTime.split(" ")
        : ["15", "minutes", "before"];
      const reminderTime = {
        time: parseInt(reminderTimeData[0]),
        formate: reminderTimeData[1],
      };

      if (formValues.reminder) {
        // check reminder time is valid or not
        const reminderDateTime = calculateReminderDateTime(
          formValues.dueDate,
          formValues.dueTime,
          formValues.reminderTime
        );

        const now = Date.now();

        // Check if the calculated reminder time is in the past
        if (reminderDateTime < now) {
          toast.error("Reminder time cannot be in the past.");
          return;
        }
      }

      const formData = {
        type: formValues.type,
        name: formValues.name,
        dueDate: formValues.dueDate,
        dueTime: formValues.dueTime,
        reminder: formValues.reminder,
        reminderTime,
        priority: formValues.priority,
        note: formValues.note,
        toEmail,
      };

      setLoading(true);
      const { data } = await axios.put(
        `${CAMPAIGN_BASE_URL}/api/tasks/editTaskForConversation/${currentTask?._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data && data?.success) {
        fetchTasksForConversation();
        toast.success(data?.message);
        setOpenModal(false);
      }
    } catch (error: any) {
      console.log("Error in updating task: ", error);
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error(error?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="text-xs text-blue-600 font-medium hover:text-blue-600/90 rounded-xl"
      >
        Edit
      </button>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>
          <h2 className="text-lg font-semibold">Edit Task</h2>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {/* Task Type */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 text-sm font-medium">
                Task type
              </label>
              <select
                name="type"
                value={formValues.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 hover:border-blue-500"
              >
                <option value="To do">To do</option>
                <option value="Call">Call</option>
                <option value="Meeting">Meeting</option>
                <option value="Email">Email</option>
              </select>
            </div>

            {/* Task Name */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 text-sm font-medium">
                Task name
              </label>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                placeholder="Task name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 hover:border-blue-500"
              />
            </div>

            {/* Due Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-sm font-medium">
                  Due date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  min={today}
                  value={formValues.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 hover:border-blue-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-sm font-medium">
                  Due time
                </label>
                <input
                  type="time"
                  name="dueTime"
                  value={formValues.dueTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 hover:border-blue-500"
                  disabled={!formValues.dueDate}
                />
              </div>
            </div>

            {/* Set Reminder */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 text-sm font-medium">
                Set reminder
              </label>
              <div className="flex items-center gap-2">
                <ToggleSwitch
                  checked={formValues.reminder}
                  onChange={() =>
                    setFormValues({
                      ...formValues,
                      reminder: !formValues.reminder,
                    })
                  }
                />
                <span className="text-sm text-gray-500">No reminder</span>
              </div>
            </div>

            {formValues.reminder && (
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-sm font-medium">
                  Reminder time
                </label>
                <select
                  name="reminderTime"
                  value={formValues.reminderTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 hover:border-blue-500"
                >
                  <option value="15 minutes before">15 minutes before</option>
                  <option value="30 minutes before">30 minutes before</option>
                  <option value="1 hour before">1 hour before</option>
                  <option value="2 hours before">2 hours before</option>
                  <option value="1 day before">1 day before</option>
                  <option value="2 days before">2 days before</option>
                </select>
              </div>
            )}

            {/* Priority */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 text-sm font-medium">
                Priority
              </label>
              <div className="flex items-center gap-2">
                <ToggleSwitch
                  checked={formValues.priority}
                  onChange={() =>
                    setFormValues({
                      ...formValues,
                      priority: !formValues.priority,
                    })
                  }
                />
                <span className="text-sm text-gray-500">
                  Set task to high priority
                </span>
              </div>
            </div>

            {/* Note */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 text-sm font-medium">Note</label>
              <div className="border border-gray-300 rounded-md">
                <textarea
                  name="note"
                  value={formValues.note}
                  onChange={handleInputChange}
                  className="w-full rounded-md bg-inherit focus-within:border-blue-500 hover:border-blue-500"
                  placeholder="Add a note"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="text-sm border border-gray-300 px-3 py-[8px] rounded-lg hover:bg-gray-50"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateTask}
            className="text-sm bg-blue-600 hover:bg-blue-600/90 text-white px-3 py-[8px] rounded-lg"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditTaskModal;
