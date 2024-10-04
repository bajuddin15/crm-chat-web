import { Button } from "flowbite-react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import useData from "../data";
import { LIVE_CHAT_API_URL } from "../../../constants";
import axios from "axios";
import toast from "react-hot-toast";

interface Faq {
  question: string;
  answer: string;
}

interface BotSettingsProps {
  setActiveTab: any;
}

const BotSettings: React.FC<BotSettingsProps> = ({ setActiveTab }) => {
  const { token } = useData();

  // States to store input data
  const [domain, setDomain] = useState<string>("");
  const [uploadedLinks, setUploadedLinks] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([{ question: "", answer: "" }]);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle domain input
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  };

  // Handle question/answer input change
  const handleFaqChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof Faq
  ) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = e.target.value;
    setFaqs(newFaqs);
  };

  // Add new FAQ entry
  const addNewFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const deleteFaq = (index: number) => {
    const updatedFaqs = faqs.filter((_, faqIndex) => faqIndex !== index);
    setFaqs(updatedFaqs);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const formData = {
      crmToken: token,
      faqs,
      domainLinks: uploadedLinks,
    };

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${LIVE_CHAT_API_URL}/api/v1/widgetConfig/create`,
        formData
      );
      if (data?.success) {
        setActiveTab("configureChannels");
        toast.success(data.message);
      }
    } catch (error: any) {
      console.error("Error in update config:", error?.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchWidgetConfig = async (token: string) => {
      try {
        const { data } = await axios.get(
          `${LIVE_CHAT_API_URL}/api/v1/widgetConfig/${token}`
        );
        if (data && data?.success) {
          const info = data?.data;
          const uploadedLinks = info?.domainLinks || [];
          const faqs = info?.faqs || [{ question: "", answer: "" }];
          setUploadedLinks(uploadedLinks);
          setFaqs(faqs);
        }
      } catch (error: any) {
        console.log("Error in fetch widget config : ", error.message);
      }
    };
    if (token) fetchWidgetConfig(token);
  }, [token]);

  return (
    <div className="space-y-10 my-10">
      <div className="bg-white shadow-sm border border-gray-300 px-8 py-8 rounded-md">
        <h2 className="text-base font-medium">Web crawler</h2>
        <div className="flex flex-col gap-2 mt-3">
          <label htmlFor="enterDomain" className="text-sm">
            Enter domain <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              className="text-sm rounded-md py-2 md:w-[300px]"
              value={domain}
              onChange={handleDomainChange}
            />
            <Button
              onClick={() => {
                setUploadedLinks((prevLinks) => [...prevLinks, domain]);
                setDomain(""); // Clear input after adding
              }}
              color="blue"
            >
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-4 mt-10 shadow-sm border border-gray-200 rounded-md p-5">
          <div className="flex items-center gap-5">
            <h2>Uploaded Links</h2>
            <button className="bg-blue-100 rounded-full px-3 py-[6px] text-sm text-blue-500 border border-blue-400">
              {uploadedLinks.length} links
            </button>
          </div>

          <div className="space-y-2">
            {uploadedLinks.map((link, index) => (
              <div
                key={index}
                className="text-sm px-3 py-2 rounded-md flex items-center justify-between bg-white border border-gray-300"
              >
                <span>
                  {index + 1}. {link}
                </span>
                <button
                  onClick={() =>
                    setUploadedLinks((prevLinks) =>
                      prevLinks.filter((_, linkIndex) => linkIndex !== index)
                    )
                  }
                  className="text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shadow-sm border border-gray-300 px-8 py-8 rounded-md space-y-6">
        <div className="space-y-1">
          <h2 className="text-base font-medium">Customize bot responses</h2>
          <p className="text-sm text-gray-500">
            Include FAQs to train the bot to handle missing information to a
            question
          </p>
        </div>

        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white shadow-sm p-5 rounded-md border border-gray-300 space-y-4"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor={`question-${index}`} className="text-sm">
                {index + 1}. Question
              </label>
              <input
                type="text"
                className="text-sm rounded-md py-2"
                value={faq.question}
                onChange={(e) => handleFaqChange(e, index, "question")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor={`answer-${index}`} className="text-sm">
                {index + 1}. Answer
              </label>
              <input
                type="text"
                className="text-sm rounded-md py-2"
                value={faq.answer}
                onChange={(e) => handleFaqChange(e, index, "answer")}
              />
            </div>

            <button
              onClick={() => deleteFaq(index)}
              className="bg-red-500 text-white text-sm rounded-md px-3 py-2"
            >
              Delete
            </button>
          </div>
        ))}

        <Button onClick={addNewFaq} color="blue">
          <Plus size={18} />
          <span className="text-sm ml-2">Add Question</span>
        </Button>

        <div className="flex items-center justify-end">
          <Button disabled={loading} onClick={handleSubmit} color="blue">
            {loading ? "Saving.." : "Save"}
          </Button>
        </div>
      </div>

      {/* pricing */}
      <div className="bg-white shadow-sm p-5 border border-gray-300 rounded-md">
        <h2 className="text-base font-medium">Pricing</h2>
        <div className="flex items-center justify-between bg-gray-50 p-5 rounded-md border border-gray-300 mt-2">
          <div>
            <h2 className="text-sm font-medium">Current plan</h2>
            <p className="text-sm">$0.02 per response</p>
          </div>
          <a
            href="https://buy.crm-messaging.cloud/b/bIY15K6k2eQl5Bm5l5"
            target="_blank"
            className="text-sm bg-blue-50 text-blue-600 flex items-center gap-1 px-3 py-2 rounded-md"
          >
            <ExternalLink size={18} />
            <span className="text-sm">
              Upgrade to unlimited plan for Open AI responses to ($79/month)
              {/* Upgrade to unlimited plan ($49/month) */}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BotSettings;
