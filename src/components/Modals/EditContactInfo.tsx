import { useState } from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { Pencil } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getContactDetails, updateContactApi } from "../../api";
import toast from "react-hot-toast";

interface IProps {
  token: any;
  contact: any;
  setContactProfileDetails: any;
}

interface IState {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  newPhone: string;
  loading: boolean;
}

const EditContactInfo = ({
  token,
  contact,
  setContactProfileDetails,
}: IProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [fName, setFName] = useState<IState["fName"]>("");
  const [lName, setLName] = useState<IState["lName"]>("");
  const [email, setEmail] = useState<IState["email"]>("");
  const [newPhone, setNewPhone] = useState<IState["newPhone"]>("");
  const [loading, setLoading] = useState<IState["loading"]>(false);

  const onCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async () => {
    if (!contact) {
      toast.error("Phone number is required");
      return;
    }
    const contactData = {
      firstName: fName,
      lastName: lName,
      email,
      phone: contact,
      newPhone,
    };
    setLoading(true);
    const data = await updateContactApi(token, contactData);
    if (data && data?.status === 200) {
      const res = await getContactDetails(token, newPhone || contact);
      setContactProfileDetails(res?.data);
      toast.success(data?.message);
      setFName("");
      setLName("");
      setEmail("");
      setNewPhone("");
      setOpenModal(false);
    }
    setLoading(false);
  };
  return (
    <>
      <div
        className="cursor-pointer w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center"
        onClick={() => setOpenModal(true)}
      >
        <Pencil size={10} color="rgba(0,0,255,0.7)" />
      </div>
      <Modal show={openModal} size="md" onClose={onCloseModal}>
        <Modal.Header className="h-14 flex items-center">
          <span className="ml-4 text-sm">Update Contact</span>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4 text-sm">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="Phone" value="Phone *" />
              </div>
              <PhoneInput
                country={"us"}
                inputStyle={{ width: "100%" }}
                value={contact}
                enableSearch={true}
                disableSearchIcon={true}
                searchStyle={{ width: "90%" }}
                disabled={true}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="newPhone" value="New Phone (optional)" />
              </div>
              <PhoneInput
                country={"us"}
                inputStyle={{ width: "100%" }}
                value={newPhone}
                onChange={(phoneVal) => setNewPhone(phoneVal)}
                enableSearch={true}
                disableSearchIcon={true}
                searchStyle={{ width: "90%" }}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="fName" value="First Name" />
              </div>
              <TextInput
                id="fName"
                placeholder="John"
                value={fName}
                onChange={(event) => setFName(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="lName" value="Last Name" />
              </div>
              <TextInput
                id="lName"
                placeholder="Doe"
                value={lName}
                onChange={(event) => setLName(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                placeholder="johndoe@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="h-14 flex items-center justify-end">
          <Button
            size="sm"
            color="gray"
            className="border border-gray-400"
            onClick={() => setOpenModal(false)}
          >
            Close
          </Button>
          <Button color="blue" size="sm" onClick={handleSubmit}>
            {loading ? "Please wait.." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditContactInfo;
