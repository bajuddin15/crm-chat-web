import { Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Template } from "../../types/types";
import axios from "axios";
import { CAMPAIGN_BASE_URL } from "../../constants";
import { ExternalLink, Mail } from "lucide-react";
import { IoSearch } from "react-icons/io5";
import toast from "react-hot-toast";
import { getContactDetails } from "../../api";

interface IProps {
  token: string;
  currentContact: any;
  selectedSenderId: any;
}

const EmailTemplatesModal: React.FC<IProps> = ({
  token,
  currentContact,
  selectedSenderId,
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [allTemplates, setAllTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [searchInput, setSearchInput] = useState<string>("");
  // State to track all dynamic field inputs
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
  const [placeholders, setPlaceholders] = useState<string[]>([]);

  // Function to handle input changes
  const handleChange = (key: string, value: string) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const handleCloseModal = () => setOpenModal(false);

  const fetchTemplates = async () => {
    try {
      const { data } = await axios.get(`${CAMPAIGN_BASE_URL}/api/templates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data && data?.success) {
        setTemplates(data?.data);
        setAllTemplates(data?.data);
      }
    } catch (error: any) {
      console.log("Error in fetch email templates: ", error?.message);
    }
  };
  const handleSearch = () => {
    if (!searchInput.trim()) {
      // If search input is empty, display all contacts
      return allTemplates;
    } else {
      return allTemplates.filter((item: any) =>
        item.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
  };
  const handleTemplateChange = (item: Template) => {
    setSelectedTemplate(item);
  };

  useEffect(() => {
    fetchTemplates();
  }, [token]);
  useEffect(() => {
    // Update contacts based on search input
    const newTemps = handleSearch();
    setTemplates(newTemps);
  }, [searchInput, allTemplates]);

  useEffect(() => {
    if (selectedTemplate) {
      const placeholdersData = [
        ...new Set(selectedTemplate?.content.match(/%\w+%/g) || []),
      ];
      setPlaceholders(placeholdersData);
    }
  }, [selectedTemplate]);
  return (
    <>
      <div onClick={() => setOpenModal(true)} className="cursor-pointer">
        <Mail color="gray" size={20} />
      </div>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header className="h-16 flex items-center">
          <div className="flex flex-col rounded-md">
            <span className="text-base">Choose Email Template</span>
            <a
              className="text-sm font-normal text-blue-600 flex items-center gap-1 hover:underline"
              href={`https://campaigns.crm-messaging.cloud/email-templates/?token=${token}`}
              target="_blank"
            >
              <span>Create New Template</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </Modal.Header>
        <Modal.Body className="relative">
          <div className="w-full bg-white pb-4 sticky -top-7 left-0">
            <TextInput
              id="search"
              type="text"
              className="w-full"
              icon={IoSearch}
              placeholder="Search template.."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-4">
            {templates?.map((item) => {
              return (
                <div key={item?._id}>
                  <TemplateEditModal
                    token={token}
                    item={item}
                    selectedTemplate={selectedTemplate}
                    handleTemplateChange={handleTemplateChange}
                    currentContact={currentContact}
                    selectedSenderId={selectedSenderId}
                    placeholders={placeholders}
                    fieldValues={fieldValues}
                    handleChange={handleChange}
                    handleCloseModal={handleCloseModal}
                  />
                </div>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

interface TemplateEditProps {
  token: string;
  item: Template;
  selectedTemplate: Template | null;
  currentContact: any;
  selectedSenderId: any;
  placeholders: string[];
  fieldValues: { [key: string]: string };
  handleChange: (key: string, value: string) => void;
  handleTemplateChange: (item: Template) => void;
  handleCloseModal: () => void;
}

const TemplateEditModal: React.FC<TemplateEditProps> = ({
  token,
  item,
  selectedTemplate,
  currentContact,
  selectedSenderId,
  placeholders,
  fieldValues,
  handleChange,
  handleCloseModal,
  handleTemplateChange,
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [disabledSubmitBtn, setDisabledSubmitBtn] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>(item?.subject || "");
  const [preheader, setPreheader] = useState<string>(item?.preheader || "");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      let toEmail = currentContact?.email || "";
      if (!currentContact?.email) {
        const res = await getContactDetails(token, currentContact?.contact);
        const resData = res?.data;
        if (!resData?.email) {
          toast.error("Contact email is required");
          return;
        }
        toEmail = resData?.email;
      }

      if (!toEmail) {
        toast.error("Contact email is required");
        return;
      }

      let content = item?.content;
      // Find all placeholders in the template (anything inside %%)
      const placeholders = [...new Set(content.match(/%\w+%/g) || [])]; // Remove duplicates using Set

      // Replace each placeholder with the corresponding value from state
      placeholders.forEach((placeholder) => {
        const key = placeholder.slice(1, -1); // Remove the '%' from both ends
        const value = fieldValues[key] || ""; // Get the input value, or empty if not provided
        content = content.replace(new RegExp(placeholder, "g"), value);
      });

      const formData = {
        from: selectedSenderId?.number,
        to: toEmail,
        subject,
        preheader,
        content,
        conversationId: currentContact?.conversationId,
      };
      const { data } = await axios.post(
        `${CAMPAIGN_BASE_URL}/api/sendEmailMessage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data && data?.success) {
        toast.success(data?.message);
        setOpenModal(false);
        handleCloseModal();
      }
    } catch (error: any) {
      console.log("Error in send email: ", error?.message);
      if (error && error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error(error?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subject) {
      setDisabledSubmitBtn(false);
    } else {
      setDisabledSubmitBtn(true);
    }
  }, [subject, preheader]);

  return (
    <div>
      <div
        className={`${
          item?._id === selectedTemplate?._id
            ? "bg-blue-600 text-white"
            : "bg-gray-200"
        } p-2 rounded-md cursor-pointer`}
        onClick={() => {
          handleTemplateChange(item);
          setOpenModal(true);
        }}
      >
        <span>{item?.name}</span>
      </div>
      <Modal show={openModal} size="4xl" onClose={() => setOpenModal(false)}>
        <Modal.Header className="h-16">Send Template</Modal.Header>
        <Modal.Body className="text-sm flex flex-col space-y-8">
          <div className="flex flex-col gap-2">
            <div>Template Name:</div>
            <div className="text-sm text-gray-500">
              {selectedTemplate?.name}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="subject">Subject</label>
            <input
              className="w-full py-[6px] rounded-md"
              id="subject"
              type="text"
              placeholder=""
              value={subject}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSubject(e.target.value)
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="preheader">Preheader</label>
            <input
              className="w-full py-[6px] rounded-md"
              id="preheader"
              type="text"
              placeholder=""
              value={preheader}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPreheader(e.target.value)
              }
            />
          </div>
          {placeholders.map((placeholder) => {
            const key = placeholder.slice(1, -1); // Remove % from both sides to get field name
            return (
              <div key={key} className="flex flex-col gap-2">
                <label htmlFor={key}>{key.replace(/_/g, " ")}:</label>
                <input
                  id={key}
                  type="text"
                  className="w-full py-[6px] rounded-md"
                  value={fieldValues[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </div>
            );
          })}
          <div className="flex flex-col gap-2">
            <div>Preview:</div>
            <div className="relative w-full h-[400px] overflow-hidden rounded-lg border border-gray-300">
              {/* Use iframe for rendering HTML content */}
              <iframe
                srcDoc={item?.content}
                className="w-full h-full border-none transition-transform duration-300 ease-in-out group-hover:scale-105"
                style={{
                  height: "100%",
                  width: "100%",
                  zoom: "0.4", // Adjust this zoom factor as needed
                  border: "none", // Remove border for better appearance
                  padding: "20px",
                }}
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
          {/* <div className="flex flex-col space-y-4">
            {tempVariables?.map((value: any, index: number) => {
              return (
                <div key={index} className="flex items-center">
                  <div style={{ flex: 1 }}>Variable {`{{${index + 1}}}`}:</div>
                  <div style={{ flex: 4 }}>
                    <input
                      className="w-full rounded-md text-sm border-gray-300"
                      type="text"
                      placeholder="Enter Fallback Value"
                      value={value}
                      onChange={(event) =>
                        // handleTempVarValueChange(index, event)
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div> */}
        </Modal.Body>
        <Modal.Footer className="h-16">
          <Button size="xs" color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button
            color="blue"
            disabled={disabledSubmitBtn || loading}
            size="xs"
            onClick={handleSendEmail}
          >
            {loading ? "Sending" : "Send"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmailTemplatesModal;
