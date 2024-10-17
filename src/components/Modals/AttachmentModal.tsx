import { Modal } from "flowbite-react";
import { Paperclip } from "lucide-react";
import { useState } from "react";
import { Tabs } from "flowbite-react";
import { MdAudiotrack, MdPictureAsPdf, MdVideoLibrary } from "react-icons/md";
import { BiImage } from "react-icons/bi";
import ImagePicker from "../Common/ImagePicker";
import VideoPicker from "../Common/VideoPicker";
import DocumentPicker from "../Common/DocumentPicker";
import AudioPicker from "../Common/AudioPicker";

interface IProps {
  mediaLink: any;
  setMediaLink: any;
}

const AttachmentModal = ({ mediaLink, setMediaLink }: IProps) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpenModal(true)}
        className="cursor-pointer relative"
      >
        <Paperclip color="gray" size={20} />
        {mediaLink && (
          <div className="bg-green-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center absolute -top-2 -right-2">
            <span>1</span>
          </div>
        )}
      </div>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header className="h-16 text-sm">
          <span>Attachments</span>
          {mediaLink && (
            <a
              href={mediaLink}
              target="_blank"
              className="bg-green-500 text-white text-[10px] px-2 py-1 rounded-sm ml-3 mb-3 font-normal"
            >
              View Attached File
            </a>
          )}
        </Modal.Header>
        <Modal.Body>
          <Tabs
            aria-label="Tabs with icons"
            style="underline"
            className="-mt-2"
          >
            <Tabs.Item active title="Image" icon={BiImage}>
              <ImagePicker
                setMediaLink={setMediaLink}
                setOpenModal={setOpenModal}
              />
            </Tabs.Item>
            <Tabs.Item title="Video" icon={MdVideoLibrary}>
              <VideoPicker
                setMediaLink={setMediaLink}
                setOpenModal={setOpenModal}
              />
            </Tabs.Item>
            <Tabs.Item title="Document" icon={MdPictureAsPdf}>
              <DocumentPicker
                setMediaLink={setMediaLink}
                setOpenModal={setOpenModal}
              />
            </Tabs.Item>
            <Tabs.Item title="Audio" icon={MdAudiotrack}>
              <AudioPicker
                setMediaLink={setMediaLink}
                setOpenModal={setOpenModal}
              />
            </Tabs.Item>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AttachmentModal;
