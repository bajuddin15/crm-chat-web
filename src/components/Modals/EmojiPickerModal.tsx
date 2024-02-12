import React, { useState } from "react";
import { Modal } from "flowbite-react";
import { Smile } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface IProps {
  setSelectedEmoji: any;
  setMessage: any;
}

const EmojiPickerModal: React.FC<IProps> = ({
  setSelectedEmoji,
  setMessage,
}) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpenModal(true)}>
        <Smile color="gray" size={20} />
      </div>
      <Modal
        dismissible
        size="sm"
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <div className="flex items-center justify-center">
          <Picker
            data={data}
            onEmojiSelect={(val: any) => {
              setSelectedEmoji(val?.native);
              setMessage((prevMsg: string) => prevMsg + val?.native);
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default EmojiPickerModal;
