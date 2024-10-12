import { Button, Modal, TextInput } from "flowbite-react";
import { ExternalLink, NotepadText } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllTemplates } from "../../api";
import { IoSearch } from "react-icons/io5";

interface IProps {
  token: any;
  setMessage: any;
  selectedTemplate: any;
  setSelectedTemplate: any;
}

interface IState {
  openModal: boolean;
  templates: Array<any>;
  tempVariables: any;
  searchInput: string;
}

const TemplateModal = ({
  token,
  setMessage,
  selectedTemplate,
  setSelectedTemplate,
}: IProps) => {
  const [openModal, setOpenModal] = useState<IState["openModal"]>(false);
  const [templates, setTemplates] = useState<IState["templates"]>([]);
  const [allTemplates, setAllTemplates] = useState<IState["templates"]>([]);
  const [tempVariables, setTempVariables] = useState<IState["tempVariables"]>(
    []
  );

  const [searchInput, setSearchInput] = useState<IState["searchInput"]>("");

  const handleTemplateChange = (item: any) => {
    const template = item?.template;
    const uniqueVars = new Set();
    const regex = /{{\d+}}/g;
    let match;
    while ((match = regex.exec(template)) !== null) {
      uniqueVars.add(match[0]);
    }
    setTempVariables(Array.from(uniqueVars).map(() => ""));
    setSelectedTemplate(item);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSearch = () => {
    if (!searchInput.trim()) {
      // If search input is empty, display all contacts
      return allTemplates;
    } else {
      return allTemplates.filter(
        (item: any) =>
          item.unqName.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.Name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      const data = await getAllTemplates(token);
      setTemplates(data);
      setAllTemplates(data);
    };
    fetchTemplates();
  }, []);

  useEffect(() => {
    // Update contacts based on search input
    const newTemps = handleSearch();
    setTemplates(newTemps);
  }, [searchInput, allTemplates]);

  return (
    <>
      <div onClick={() => setOpenModal(true)} className="cursor-pointer">
        <NotepadText color="gray" size={20} />
      </div>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header className="h-16 flex items-center">
          <div className="flex flex-col rounded-md">
            <span className="text-base">Choose Template</span>
            <a
              className="text-sm font-normal text-blue-600 flex items-center gap-1 hover:underline"
              href="https://app.crm-messaging.cloud/index.php/App/template"
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
            {templates?.map((item, index) => {
              return (
                <div key={index}>
                  <TemplateValueEdit
                    item={item}
                    setMessage={setMessage}
                    tempVariables={tempVariables}
                    setTempVariables={setTempVariables}
                    selectedTemplate={selectedTemplate}
                    handleTemplateChange={handleTemplateChange}
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

const TemplateValueEdit = ({
  item,
  setMessage,
  tempVariables,
  setTempVariables,
  selectedTemplate,
  handleTemplateChange,
  handleCloseModal,
}: {
  item: any;
  setMessage: any;
  tempVariables: any;
  setTempVariables: any;
  selectedTemplate: any;
  handleTemplateChange: any;
  handleCloseModal: any;
}) => {
  const [openModal, setOpenModal] = useState<IState["openModal"]>(false);
  const [disabledSubmitBtn, setDisabledSubmitBtn] = useState<boolean>(false);

  const handleTempVarValueChange = (index: any, event: any) => {
    const newValues = [...tempVariables];
    newValues[index] = event.target.value;
    setTempVariables(newValues);
  };
  const handleSubmit = () => {
    let msg = selectedTemplate?.template;
    for (let i = 0; i < tempVariables.length; i++) {
      const placeholder = `{{${i + 1}}}`;
      const value = tempVariables[i];
      msg = msg.replace(placeholder, `[${value}]`);
      msg = msg.replaceAll(placeholder, value);
    }
    setMessage(msg);
    handleCloseModal();
    setOpenModal(false);
  };

  useEffect(() => {
    let cntEmpty = 0;
    for (let i = 0; i < tempVariables?.length; i++) {
      if (tempVariables[i] === "") {
        cntEmpty++;
      }
    }
    const flag = cntEmpty > 0 ? true : false;
    setDisabledSubmitBtn(flag);
  }, [tempVariables]);
  return (
    <>
      <div
        className={`${
          item?.unqName === selectedTemplate?.unqName
            ? "bg-blue-600 text-white"
            : "bg-gray-200"
        } p-2 rounded-md cursor-pointer`}
        onClick={() => {
          handleTemplateChange(item);
          setOpenModal(true);
        }}
      >
        <span>{item?.Name}</span>
      </div>
      <Modal show={openModal} size="4xl" onClose={() => setOpenModal(false)}>
        <Modal.Header className="h-16">Send Template</Modal.Header>
        <Modal.Body className="text-sm flex flex-col space-y-8">
          <div className="flex items-center">
            <div style={{ flex: 1 }}>Template Id:</div>
            <div style={{ flex: 4 }}>{selectedTemplate?.unqName}</div>
          </div>
          <hr />
          <div className="flex items-center">
            <div style={{ flex: 1 }}>Body:</div>
            <div style={{ flex: 4 }}>{selectedTemplate?.template}</div>
          </div>
          <hr />
          <div className="flex flex-col space-y-4">
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
                        handleTempVarValueChange(index, event)
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer className="h-16">
          <Button size="xs" color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button
            color="blue"
            disabled={disabledSubmitBtn}
            size="xs"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TemplateModal;
