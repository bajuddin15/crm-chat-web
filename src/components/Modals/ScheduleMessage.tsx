import React, { useState } from "react";
import { Button, Modal } from "flowbite-react";
import { Clock } from "lucide-react";

interface IProps {
  date: string;
  time: string;
  setDate: any;
  setTime: any;
  handleScheduleMessage: any;
}

const ScheduleMessage: React.FC<IProps> = ({
  date,
  time,
  setDate,
  setTime,
  handleScheduleMessage,
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleSchedule = async () => {
    setLoading(true);
    await handleScheduleMessage(setOpenModal);
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="bg-gray-100 hover:bg-gray-200 text-black border border-gray-400 py-2 px-4 rounded-md flex items-center gap-2"
      >
        <span className="text-sm hidden sm:flex">Schedule</span>
        <Clock color="black" size={16} />
      </button>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header className="h-16 flex items-center">
          <div>
            <span className="text-base font-medium">Schedule Message</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6 mb-3 mt-2 h-48">
            <div className="flex flex-col gap-2 z-50">
              <label className="text-sm" htmlFor="datePicker">
                Choose Date *
              </label>
              <input
                className="border border-gray-300 rounded-md focus:ring-0"
                type="date"
                id="datePicker"
                name="datePicker"
                value={date}
                onChange={handleDateChange}
              />
            </div>
            <div className="flex flex-col gap-2 z-50">
              <label className="text-sm" htmlFor="timePicker">
                Choose Time *
              </label>
              <input
                className="border border-gray-300 rounded-md focus:ring-0"
                type="time"
                id="timePicker"
                name="timePicker"
                value={time}
                onChange={handleTimeChange}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="h-16 flex items-center">
          <Button size="sm" color="gray" onClick={() => setOpenModal(false)}>
            Close
          </Button>
          <Button size="sm" color="blue" onClick={handleSchedule}>
            {loading ? "Please wait" : "Schedule"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ScheduleMessage;
