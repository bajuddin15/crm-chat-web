import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { MdCall } from "react-icons/md";

const PopupModal = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleSubmit = () => {
    window.open("mailto:care@crm-messaging.cloud", "_blank");
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
              Please contact to{" "}
              <a
                href="mailto:care@crm-messaging.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                care@crm-messaging.cloud
              </a>{" "}
              for voice calling setup
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="blue" onClick={handleSubmit}>
                {"Yes, contact"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PopupModal;
