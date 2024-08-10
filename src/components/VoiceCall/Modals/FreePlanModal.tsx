import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { MdCall } from "react-icons/md";

const FreePlanModal = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleUpgrade = () => {
    window.open(
      "https://crm-messaging.cloud/pricing?utm_source=voice-chat",
      "_blank"
    ); // Replace with your upgrade link
    setOpenModal(false);
  };

  return (
    <>
      <div
        onClick={() => setOpenModal(true)}
        className="w-6 h-6 cursor-pointer flex items-center justify-center bg-green-500 rounded-full"
      >
        <MdCall size={14} color="white" />
      </div>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              You are currently on the Free Plan. Please upgrade your plan to
              make outgoing call.
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="blue" onClick={handleUpgrade}>
                {"Upgrade Now"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FreePlanModal;
