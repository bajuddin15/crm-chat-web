import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { getSenderIds } from "../../api";
import whatsappImg from "../../assets/images/whatsapp.svg";
import smsImg from "../../assets/images/sms.png";

interface IProps {
  token: any;
  setSelectedSenderId: any;
}

interface IState {
  openModal: boolean;
  senderIds: Array<any>;
  selectedValue: any;
}

const SenderIdModal = ({ token, setSelectedSenderId }: IProps) => {
  const [openModal, setOpenModal] = useState<IState["openModal"]>(false);
  const [senderIds, setSenderIds] = useState<IState["senderIds"]>([]);
  const [senderIdIndex, setSenderIdIndex] = useState(1);
  const [selectedValue, setSelectedValue] =
    useState<IState["selectedValue"]>(null);

  const handleSave = () => {
    let index = 1;
    for (let i = 0; i < senderIds?.length; i++) {
      if (senderIds[i]?.number === selectedValue?.number) {
        index = i + 1;
        break;
      }
    }
    setSenderIdIndex(index);
    setSelectedSenderId(selectedValue);
    setOpenModal(false);
  };
  useEffect(() => {
    const fetchProviders = async () => {
      const data = await getSenderIds(token);
      const providers = data?.Provider;
      if (providers?.length > 0) {
        let provd1 = providers?.filter((item: any) => item?.isDefault === "1");
        let provd2 = providers?.filter((item: any) => item?.isDefault === "0");
        const provd = [...provd1, ...provd2];
        setSenderIds(provd);
        setSelectedSenderId(provd[0]);
        setSelectedValue(provd[0]);
      }
    };
    fetchProviders();
  }, []);

  return (
    <>
      <div
        className="cursor-pointer text-gray-400 border border-gray-300 text-xs px-2 py-1 rounded-md"
        onClick={() => setOpenModal(true)}
      >
        {senderIdIndex}
      </div>
      <Modal
        // dismissible
        size="sm"
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>
          <span>Choose SenderId</span>
          <div className="flex items-center gap-1 text-xs mt-2">
            <span>Selected: </span>
            <img
              src={
                selectedValue?.defaultChannel === "sms" ? smsImg : whatsappImg
              }
              alt="channel-img"
              className="w-4 h-4 object-cover"
            />
            <span>{selectedValue?.number}</span>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-6">
            {senderIds?.map((item, index) => {
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        item?.defaultChannel === "sms" ? smsImg : whatsappImg
                      }
                      alt="channel-img"
                      className="w-8 h-8 object-cover"
                    />

                    <label
                      htmlFor={item?.number}
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {item?.label ? item?.label : item?.number}
                    </label>
                  </div>
                  <input
                    id={item?.number}
                    type="radio"
                    value={item?.numer}
                    name="senderIds"
                    checked={selectedValue?.number === item?.number}
                    onChange={() => setSelectedValue(item)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SenderIdModal;
