import { useState } from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { UserPlus } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { createNewContact } from "../../api";
import toast from "react-hot-toast";

interface IProps {
  token: any;
}

interface IState {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  loading: boolean;
}

const CreateContactModal = ({ token }: IProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [fName, setFName] = useState<IState["fName"]>("");
  const [lName, setLName] = useState<IState["lName"]>("");
  const [email, setEmail] = useState<IState["email"]>("");
  const [phone, setPhone] = useState<IState["phone"]>("");
  const [loading, setLoading] = useState<IState["loading"]>(false);

  const onCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async () => {
    if (!fName) {
      toast.error("Please enter first name");
      return;
    }
    if (!lName) {
      toast.error("Please enter last name");
      return;
    }
    if (!email) {
      toast.error("Please enter email address");
      return;
    }
    if (!phone) {
      toast.error("Please enter phone number");
      return;
    }
    const contactData = {
      fname: fName,
      lname: lName,
      email,
      phone,
    };
    setLoading(true);
    const data = await createNewContact(token, contactData);
    setLoading(false);

    if (data && data?.status === 200) {
      toast.success(data?.message);
      setFName("");
      setLName("");
      setEmail("");
      setPhone("");
      setOpenModal(false);
    }
  };
  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpenModal(true)}>
        <UserPlus size={18} color="black" />
      </div>
      <Modal show={openModal} size="md" onClose={onCloseModal}>
        <Modal.Header className="h-16">
          <span className="ml-4 text-sm">Add New Contact</span>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4 text-sm">
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
            <div>
              <div className="mb-2 block">
                <Label htmlFor="Phone" value="Phone" />
              </div>
              <PhoneInput
                country={"in"}
                inputStyle={{ width: "100%" }}
                value={phone}
                onChange={(phoneVal) => setPhone(phoneVal)}
                enableSearch={true}
                disableSearchIcon={true}
                searchStyle={{ width: "90%" }}
              />
            </div>
            <Button size="sm" fullSized onClick={handleSubmit}>
              {loading ? "Please wait.." : "Add Contact"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateContactModal;
