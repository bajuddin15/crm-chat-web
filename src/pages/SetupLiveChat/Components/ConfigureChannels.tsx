import axios from "axios";
import e from "cors";
import { Button } from "flowbite-react";
import React from "react";
import { LIVE_CHAT_API_URL } from "../../../constants";
import toast from "react-hot-toast";
import useData from "../data";

interface FormState {
  whatsappNumber: string;
  smsNumber: string;
  callNumber: string;
  widgetMessage: string;
  message1: string;
  message2: string;
  snippet1: string;
  snippet2: string;
  snippet3: string;
  snippet4: string;
  snippet5: string;
}

interface IProps {
  setActiveTab: any;
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
    snippet1: "",
    snippet2: "",
    snippet3: "",
    snippet4: "",
    snippet5: "",
  });
  const [disableSaveBtn, setDisableSaveBtn] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const messages = [values.message1, values.message2].filter(
        (message) => message !== ""
      );
      const snippets = [
        values.snippet1,
        values.snippet2,
        values.snippet3,
        values.snippet4,
        values.snippet5,
      ].filter((snippet) => snippet !== "");
      const formData = {
        crmToken: token,
        whatsappNumber: values.whatsappNumber,
        smsNumber: values.smsNumber,
        widgetMessage: values.widgetMessage,
        callNumber: values.callNumber,
        liveChatMessages: messages,
        snippets: snippets,
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
            snippet1: info?.snippets?.length > 0 ? info?.snippets[0] : "",
            snippet2: info?.snippets?.length > 1 ? info?.snippets[1] : "",
            snippet3: info?.snippets?.length > 2 ? info?.snippets[2] : "",
            snippet4: info?.snippets?.length > 3 ? info?.snippets[3] : "",
            snippet5: info?.snippets?.length > 4 ? info?.snippets[4] : "",
          };
          setValues(vals);
        }
      } catch (error: any) {
        console.log("Error in fetch widget config : ", error.message);
      }
    };
    if (token) fetchWidgetConfig(token);
  }, [token]);
  return (
    <form
      onSubmit={handleSubmit}
      className="pb-5 space-y-5 w-full md:w-[500px]"
    >
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

      <div className="flex flex-col gap-2">
        <label htmlFor="addSnippet1" className="text-sm">
          Add Snippet 1 (optional)
        </label>
        <input
          className="text-sm border border-gray-400 outline-none py-2 px-3 rounded-md focus:ring-0"
          name="addSnippet1"
          id="addSnippet1"
          type="text"
          value={values.snippet1}
          onChange={(e: any) =>
            setValues({ ...values, snippet1: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="addSnippet2" className="text-sm">
          Add Snippet 2 (optional)
        </label>
        <input
          className="text-sm border border-gray-400 outline-none py-2 px-3 rounded-md focus:ring-0"
          name="addSnippet2"
          id="addSnippet2"
          type="text"
          value={values.snippet2}
          onChange={(e: any) =>
            setValues({ ...values, snippet2: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="addSnippet3" className="text-sm">
          Add Snippet 3 (optional)
        </label>
        <input
          className="text-sm border border-gray-400 outline-none py-2 px-3 rounded-md focus:ring-0"
          name="addSnippet3"
          id="addSnippet3"
          type="text"
          value={values.snippet3}
          onChange={(e: any) =>
            setValues({ ...values, snippet3: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="addSnippet4" className="text-sm">
          Add Snippet 4 (optional)
        </label>
        <input
          className="text-sm border border-gray-400 outline-none py-2 px-3 rounded-md focus:ring-0"
          name="addSnippet4"
          id="addSnippet4"
          type="text"
          value={values.snippet4}
          onChange={(e: any) =>
            setValues({ ...values, snippet4: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="addSnippet5" className="text-sm">
          Add Snippet 5 (optional)
        </label>
        <input
          className="text-sm border border-gray-400 outline-none py-2 px-3 rounded-md focus:ring-0"
          name="addSnippet5"
          id="addSnippet5"
          type="text"
          value={values.snippet5}
          onChange={(e: any) =>
            setValues({ ...values, snippet5: e.target.value })
          }
        />
      </div>

      <Button disabled={disableSaveBtn} type="submit" color="blue">
        {loading ? "Please wait.." : "Save and Continue"}
      </Button>
    </form>
  );
};

export default ConfigureChannels;
