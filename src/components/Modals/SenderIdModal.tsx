import { Button, Modal } from "flowbite-react";
import { FaCommentSms, FaWhatsapp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { getSenderIds, getTeamMembers } from "../../api";
import { MyRoleData } from "../../types/types";
import { useSearchParams } from "react-router-dom";

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
  const [searchParams] = useSearchParams();
  const teamEmail = searchParams.get("team");

  const [openModal, setOpenModal] = useState<IState["openModal"]>(false);
  const [senderIds, setSenderIds] = useState<IState["senderIds"]>([]);
  const [senderIdIndex, setSenderIdIndex] = useState(1);
  const [selectedValue, setSelectedValue] =
    useState<IState["selectedValue"]>(null);

  const handleSave = () => {
    let index = 1;
    for (let i = 0; i < senderIds?.length; i++) {
      if (senderIds[i]?.id === selectedValue?.id) {
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
      if (!token) return;
      const data = await getSenderIds(token);
      const resData = await getTeamMembers(token);
      const teamMembers = resData?.data;
      const providers = data?.Provider;
      if (providers?.length > 0) {
        let provd1 = providers?.filter((item: any) => item?.isDefault === "1");
        let provd2 = providers?.filter((item: any) => item?.isDefault === "0");
        const provd = [...provd1, ...provd2];

        let allNumbers = provd;
        let myRoleData: MyRoleData | null = null;
        if (teamMembers?.length > 0 && teamEmail) {
          const myRole = teamMembers.find(
            (item: MyRoleData) => item?.email === teamEmail
          );
          myRoleData = myRole;
        }

        if (
          myRoleData &&
          (myRoleData?.roll === "admin" || myRoleData?.roll === "adminuser")
        ) {
          allNumbers = provd;
        } else if (myRoleData && myRoleData?.roll === "standard") {
          allNumbers = provd.filter(
            (item: any) => item?.assignTo === myRoleData?.userId
          );
          if (allNumbers.length === 0) {
            allNumbers = provd.filter((item: any) => item?.assignTo === "0");
          }
        }

        setSenderIds(allNumbers);
        setSelectedSenderId(allNumbers[0]);
        setSelectedValue(allNumbers[0]);
      }
    };
    fetchProviders();
  }, [token, teamEmail]);

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

            <div>
              {selectedValue?.defaultChannel === "whatsapp" ? (
                <FaWhatsapp size={20} color={"green"} />
              ) : (
                <FaCommentSms size={20} color={"blue"} />
              )}
            </div>
            <span>{selectedValue?.number}</span>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-6">
            {senderIds?.map((item) => {
              return (
                <div
                  key={item?.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      {item?.defaultChannel === "whatsapp" ? (
                        <FaWhatsapp size={20} color={"green"} />
                      ) : (
                        <FaCommentSms size={20} color={"blue"} />
                      )}
                    </div>

                    <label
                      htmlFor={item?.id}
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {item?.label ? item?.label : item?.number}
                    </label>
                  </div>
                  <input
                    id={item?.id}
                    type="radio"
                    value={item?.numer}
                    name="senderIds"
                    checked={selectedValue?.id === item?.id}
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
          <Button color="blue" size="sm" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SenderIdModal;
