"use client";

import { Button, Modal } from "flowbite-react";
import { NotepadText } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllTemplates } from "../../api";

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
}

const TemplateModal = ({
  token,
  setMessage,
  selectedTemplate,
  setSelectedTemplate,
}: IProps) => {
  const [openModal, setOpenModal] = useState<IState["openModal"]>(false);
  const [templates, setTemplates] = useState<IState["templates"]>([]);
  const [tempVariables, setTempVariables] = useState<IState["tempVariables"]>(
    []
  );

  const handleTemplateChange = (item: any) => {
    const template = item?.template;
    let countVars = 0; // count of all {{}} in template msg
    let tempVars = [];
    for (let i = 0; i < template?.length - 2; i++) {
      console.log(template[i]);
      if (template[i] === "{" && template[i + 1] === "{") {
        tempVars.push("");
        countVars++;
      }
    }
    console.log("variables input---", tempVars);
    setTempVariables(tempVars);
    setSelectedTemplate(item);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      const data = await getAllTemplates(token);
      setTemplates(data);
    };
    fetchTemplates();
  }, []);

  return (
    <>
      <div onClick={() => setOpenModal(true)} className="cursor-pointer">
        <NotepadText color="gray" size={20} />
      </div>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Choose Whatsapp Template</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
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

  const handleTempVarValueChange = (index: any, event: any) => {
    const newValues = [...tempVariables];
    newValues[index] = event.target.value;
    setTempVariables(newValues);
  };
  const handleSubmit = () => {
    let msg = selectedTemplate?.template;
    for (let i = 0; i < tempVariables.length; i++) {
      let key = i + 1;
      let vKey = key.toString();
      let varKey = "{{" + vKey + "}}";
      let result = msg.replace(varKey, `[${tempVariables[i]}]`);
      msg = result;
    }
    setMessage(msg);
    handleCloseModal();
    setOpenModal(false);
  };
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
          <Button size="xs" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TemplateModal;
