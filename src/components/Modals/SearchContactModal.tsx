import { Modal } from "flowbite-react";
import { ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getCRMContacts, getConvId } from "../../api";

interface IProps {
  token: any;
  setCurrentContact: any;
}

interface IState {
  openModal: boolean;
  contacts: Array<any>;
  allContacts: Array<any>;
  searchInput: string;
}

const SearchContactModal = ({ token, setCurrentContact }: IProps) => {
  const [openModal, setOpenModal] = useState<IState["openModal"]>(false);
  const [contacts, setContacts] = useState<IState["contacts"]>([]);
  const [allContacts, setAllContacts] = useState<IState["allContacts"]>([]);
  const [searchInput, setSearchInput] = useState<IState["searchInput"]>("");

  const handleSearch = () => {
    if (!searchInput.trim()) {
      // If search input is empty, display all contacts
      return allContacts;
    } else {
      return allContacts.filter((item: any) => {
        let name = "" + item?.fname + item?.lname;
        return (
          item.phone.toLowerCase().includes(searchInput.toLowerCase()) ||
          name.toLowerCase().includes(searchInput.toLowerCase())
        );
      });
    }
  };

  const handleNavigateToChatView = async (item: any) => {
    let fullName =
      item?.fname !== "undefined" && item?.lname !== "undefined"
        ? `${item?.fname} ${item?.lname}`
        : "";

    const cidData = await getConvId(token, item?.phone);
    if (cidData && cidData?.status === 200) {
      const currContact = {
        name: fullName !== "" && fullName !== " " ? fullName : "",
        contact: item?.phone,
        conversationId: cidData?.cid,
      };
      setCurrentContact(currContact);
      setOpenModal(false);
    }
  };

  useEffect(() => {
    const fetchConvContacts = async (token: string) => {
      const data = await getCRMContacts(token);
      if (data && data?.status === 200) {
        setContacts(data?.Contact);
        setAllContacts(data?.Contact);
      }
    };
    fetchConvContacts(token);
  }, [openModal]);

  useEffect(() => {
    // Update contacts based on search input
    const newContacts = handleSearch();
    setContacts(newContacts);
  }, [searchInput, allContacts]);

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpenModal(true)}>
        <Search size={20} color="black" />
      </div>
      <Modal
        size="2xl"
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header className="h-16 flex items-center">
          <div className="text-sm flex items-center">
            <div className="bg-gray-200 w-16 py-[12px] flex items-center justify-center rounded-tl-md rounded-bl-md">
              <Search size={20} color="gray" />
            </div>
            <input
              className="w-full md:w-[470px] border border-gray-300 rounded-tr-md rounded-br-md"
              type="text"
              placeholder="Search Contact.."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </Modal.Header>
        <Modal.Body className="py-2 px-5">
          <div style={{ height: "80vh" }} className="flex flex-col gap-2">
            <div>
              <span className="text-sm">Total ({contacts?.length})</span>
            </div>
            {contacts?.map((contact) => {
              let fullName =
                contact?.fname !== "undefined" && contact?.lname !== "undefined"
                  ? `${contact?.fname} ${contact?.lname}`
                  : "";
              return (
                <div
                  key={contact?.id}
                  className="flex items-center gap-5 py-3 cursor-pointer px-4 rounded-md bg-gray-50 hover:bg-gray-200"
                  onClick={() => handleNavigateToChatView(contact)}
                >
                  <img
                    className="w-12 h-12 rounded-full"
                    src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"
                    alt="Rounded avatar"
                  />
                  <div className="flex items-center justify-between flex-1">
                    <div>
                      <h2 className="text-base font-semibold">{fullName}</h2>
                      <span
                        className={`${
                          fullName !== "" && fullName !== " "
                            ? "text-sm text-gray-500"
                            : "text-base font-semibold"
                        }`}
                      >
                        {contact?.phone}
                      </span>
                    </div>
                    <div>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SearchContactModal;
