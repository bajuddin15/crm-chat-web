import { Modal } from "flowbite-react";
import { Hash } from "lucide-react";
import React from "react";

interface IProps {
  setMessage: any;
}

interface IState {
  openModal: boolean;
}

const mergeFieldOptions = [
  {
    id: "1",
    value: "{$FIRST_NAME}",
    label: "CONTACT.FIRST_NAME",
  },
  {
    id: "2",
    value: "{$LAST_NAME}",
    label: "CONTACT.LAST_NAME",
  },
  {
    id: "3",
    value: "{$EMAIL}",
    label: "CONTACT.EMAIL",
  },
  {
    id: "4",
    value: "{$PHONE}",
    label: "CONTACT.PHONE_NUMBER",
  },
  {
    id: "5",
    value: "{$CUSTOM1}",
    label: "CUSTOM_FIELD_1",
  },
  {
    id: "6",
    value: "{$CUSTOM2}",
    label: "CUSTOM_FIELD_2",
  },
  {
    id: "7",
    value: "{$CUSTOM3}",
    label: "CUSTOM_FIELD_3",
  },
  {
    id: "8",
    value: "{$CUSTOM4}",
    label: "CUSTOM_FIELD_4",
  },
  {
    id: "9",
    value: "{$CUSTOM5}",
    label: "CUSTOM_FIELD_5",
  },
];

const MergeVariableModal: React.FC<IProps> = ({ setMessage }) => {
  const [openModal, setOpenModal] = React.useState<IState["openModal"]>(false);

  const handleMergeField = (value: string) => {
    setMessage((prevMessage: string) => prevMessage + ` ${value}`);
    setOpenModal(false);
  };

  return (
    <div>
      <button onClick={() => setOpenModal(true)}>
        <Hash size={20} color="gray" />
      </button>

      <Modal
        dismissible
        size="sm"
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header className="h-14 flex items-center">
          <h2 className="text-base">Merge Fields</h2>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-2">
            {mergeFieldOptions.map(
              (item: { id: string; value: string; label: string }) => {
                return (
                  <div
                    key={item.id}
                    onClick={() => handleMergeField(item.value)}
                    className="bg-gray-200/70 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200"
                  >
                    <span className="text-sm">{item.label}</span>
                  </div>
                );
              }
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MergeVariableModal;
