import axios from "axios";
import { Button } from "flowbite-react";
import React from "react";
import { LIVE_CHAT_API_URL } from "../../../constants";
import toast from "react-hot-toast";
import useData from "../data";
import { Minus, Plus } from "lucide-react";

interface FormState {
  whatsappNumber: string;
  smsNumber: string;
  callNumber: string;
  widgetMessage: string;
  message1: string;
  message2: string;
}

interface IProps {
  setActiveTab: any;
}

interface IState {
  snippets: Array<string>;
  loading: boolean;
}

const ConfigureChannels: React.FC<IProps> = ({ setActiveTab }) => {
  const { token } = useData();
  const [values, setValues] = React.useState<FormState>({
    whatsappNumber: "",
    smsNumber: "",
    callNumber: "",
    widgetMessage: "Hi, How can I Help You?",
    message1: "",
    message2: "",
  });
  const [snippets, setSnippets] = React.useState<IState["snippets"]>([""]);
  const [disableSaveBtn, setDisableSaveBtn] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<IState["loading"]>(false);

  const handleAddSnippet = () => {
    const updated = [...snippets, ""];
    setSnippets(updated);
  };

  const handleDeleteSnippet = (indexToDelete: number) => {
    const updated = [...snippets].filter((_, index) => index !== indexToDelete);
    setSnippets(updated);
  };

  const handleSubmit = async () => {
    try {
      const messages = [values.message1, values.message2].filter(
        (message) => message !== ""
      );
      const snippetsData = [...snippets].filter((snippet) => snippet !== "");
      const formData = {
        crmToken: token,
        whatsappNumber: values.whatsappNumber,
        smsNumber: values.smsNumber,
        widgetMessage: values.widgetMessage,
        callNumber: values.callNumber,
        liveChatMessages: messages,
        snippets: snippetsData,
      };
      setLoading(true);
      const { data } = await axios.post(
        `${LIVE_CHAT_API_URL}/api/v1/widgetConfig/create`,
        formData
      );
      if (data && data?.success) {
        setActiveTab("trackingCode");
        toast.success(data?.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (values.whatsappNumber || values.smsNumber || values.callNumber) {
      setDisableSaveBtn(false);
    }
  }, [values]);

  React.useEffect(() => {
    const fetchWidgetConfig = async (token: string) => {
      try {
        const { data } = await axios.get(
          `${LIVE_CHAT_API_URL}/api/v1/widgetConfig/${token}`
        );
        if (data && data?.success) {
          const info = data?.data;

          let vals = {
            whatsappNumber: info?.whatsappNumber,
            smsNumber: info?.smsNumber,
            callNumber: info?.callNumber,
            widgetMessage: info?.widgetMessage,
            message1:
              info?.liveChatMessages?.length > 0
                ? info?.liveChatMessages[0]
                : "",
            message2:
              info?.liveChatMessages?.length > 1
                ? info?.liveChatMessages[1]
                : "",
          };
          if (info?.snippets?.length > 0) {
            setSnippets(info?.snippets);
          }
          setValues(vals);
        }
      } catch (error: any) {
        console.log("Error in fetch widget config : ", error.message);
      }
    };
    if (token) fetchWidgetConfig(token);
  }, [token]);
  return (
    <div className="pb-5 space-y-5 w-full md:w-[500px]">
      <div className="flex flex-col gap-2">
        <label htmlFor="whatsappNumber" className="text-sm">
          WhatsApp Number
        </label>
        <input
          className="text-sm border border-gray-400 outline-none py-2 px-3 rounded-md focus:ring-0"
          name="whatsappNumber"
          id="whatsappNumber"
          type="text"
          placeholder="+917818000021"
          value={values.whatsappNumber}
          onChange={(e: any) =>
            setValues({ ...values, whatsappNumber: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="smsNumber" className="text-sm">
          SMS Number
        </label>
        <input
          className="text-sm border border-gray-400 outline-none py-2 px-3 rounded-md focus:ring-0"
          name="smsNumber"
          id="smsNumber"
          type="text"
          placeholder="+917818000021"
          value={values.smsNumber}
          onChange={(e: any) =>
            setValues({ ...values, smsNumber: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="callNumber" className="text-sm">
          Call Number
        </label>
        <input
          className="text-sm border border-gray-400 outline-none py-2 px-3 rounded-md focus:ring-0"
          name="callNumber"
          id="callNumber"
          type="text"
          placeholder="+917818000021"
          value={values.callNumber}
          onChange={(e: any) =>
            setValues({ ...values, callNumber: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="widgetMessage" className="text-sm">
          Widget Message
        </label>
        <div className="border border-gray-400 rounded-md hover:border-gray-400 focus:ring-[1px] focus:ring-gray-600">
          <textarea
            className="text-sm border-none outline-none py-2 px-3 w-full focus:ring-0 rounded-md"
            name="widgetMessage"
            id="widgetMessage"
            placeholder="Write widget message here..."
            value={values.widgetMessage}
            onChange={(e: any) =>
              setValues({ ...values, widgetMessage: e.target.value })
            }
            rows={3}
          ></textarea>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message1" className="text-sm">
          Live Chat Message 1 (optional)
        </label>
        <div className="border border-gray-400 rounded-md hover:border-gray-400 focus:ring-[1px] focus:ring-gray-600">
          <textarea
            className="text-sm border-none outline-none py-2 px-3 w-full focus:ring-0 rounded-md"
            name="message1"
            id="message1"
            placeholder="Write message here..."
            value={values.message1}
            onChange={(e: any) =>
              setValues({ ...values, message1: e.target.value })
            }
            rows={3}
          ></textarea>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message2" className="text-sm">
          Live Chat Message 2 (optional)
        </label>
        <div className="border border-gray-400 rounded-md hover:border-gray-400 focus:ring-[1px] focus:ring-gray-600">
          <textarea
            className="text-sm border-none outline-none py-2 px-3 w-full focus:ring-0 rounded-md"
            name="message2"
            id="message2"
            placeholder="Write message here..."
            value={values.message2}
            onChange={(e: any) =>
              setValues({ ...values, message2: e.target.value })
            }
            rows={3}
          ></textarea>
        </div>
      </div>

      <>
        {snippets.map((value, index) => {
          return (
            <div key={index} className="flex flex-col gap-2">
              <label htmlFor={`addSnippet${index + 1}`} className="text-sm">
                Add Snippet {index + 1} (optional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  className="text-sm w-full border border-gray-400 outline-none py-2 px-3 rounded-md focus:ring-0"
                  name={`addSnippet${index + 1}`}
                  id={`addSnippet${index + 1}`}
                  type="text"
                  value={value}
                  onChange={(e: any) => {
                    const updated = snippets.map((item, idx) =>
                      index === idx ? e.target.value : item
                    );
                    setSnippets(updated);
                  }}
                />
                <button
                  onClick={() => handleDeleteSnippet(index)}
                  className="border border-gray-400 p-[5px] bg-gray-100 rounded-md"
                >
                  <Minus size={24} color="gray" />
                </button>
              </div>
            </div>
          );
        })}

        <button
          onClick={handleAddSnippet}
          className="flex items-center gap-2 border border-blue-500 rounded-md py-2 px-3"
        >
          <div className="bg-blue-500 p-[2px] rounded-full">
            <Plus size={16} color="white" />
          </div>
          <span className="text-sm text-blue-500 font-medium">Add Snippet</span>
        </button>
      </>

      <Button disabled={disableSaveBtn} onClick={handleSubmit} color="blue">
        {loading ? "Please wait.." : "Save and Continue"}
      </Button>
    </div>
  );
};

export default ConfigureChannels;
