import { Button, Modal } from "flowbite-react";
import { Link2 } from "lucide-react";
import { useState } from "react";
import { generateShortUrl } from "../../api";
import toast from "react-hot-toast";
import { handleCopy } from "../../utils/common";

interface IProps {
  setMessage: any;
}

interface IState {
  openModal: boolean;
  longUrl: string;
  shortUrl: string;
}

const ShortUrlModal: React.FC<IProps> = ({ setMessage }) => {
  const [openModal, setOpenModal] = useState<IState["openModal"]>(false);
  const [longUrl, setLongUrl] = useState<IState["longUrl"]>("");
  const [shortUrl, setShortUrl] = useState<IState["shortUrl"]>("");

  const handleGenerateShortUrl = async () => {
    if (!longUrl) {
      toast.error("Plesae add valid long url");
      return;
    }
    const data = await generateShortUrl(longUrl);
    if (data && data?.status === 200) {
      setShortUrl(data?.link);
    }
  };

  const handleUseShortUrl = () => {
    setMessage((prevState: string) => `${prevState} ${shortUrl}`);
    setLongUrl("");
    setShortUrl("");
    setOpenModal(false);
  };

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpenModal(true)}>
        <Link2 color="gray" size={22} />
      </div>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header className="h-16 flex items-center">
          <div>
            <span className="text-base font-medium">Url Short Link</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6 mb-3 mt-1">
            <div className="flex flex-col gap-2">
              <label className="text-sm" htmlFor="longUrl">
                Long Url *
              </label>
              <input
                className="border border-gray-300 focus:ring-0 rounded-md text-sm"
                type="text"
                placeholder="Enter your long url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm" htmlFor="longUrl">
                Short Url
              </label>
              {shortUrl && (
                <div className=" flex items-center gap-0">
                  <span className="border border-gray-300 flex-1 focus:ring-0 rounded-tl-md rounded-bl-md text-sm py-2 px-3">
                    {shortUrl}
                  </span>
                  <button
                    onClick={() => handleCopy(shortUrl)}
                    className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 text-sm rounded-tr-md rounded-br-md py-2 px-3"
                  >
                    Copy
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm font-medium">
                  Note : For custom short links with your domain, contact{" "}
                </span>
                <a
                  href="mailto:care@crm-messaging.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  care@crm-messaging.cloud
                </a>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="h-16 flex items-center justify-end gap-2">
          <Button
            className="border border-gray-400"
            size="sm"
            color="gray"
            onClick={() => setOpenModal(false)}
          >
            Close
          </Button>
          {shortUrl ? (
            <Button size="sm" color="blue" onClick={handleUseShortUrl}>
              Use It
            </Button>
          ) : (
            <Button size="sm" color="blue" onClick={handleGenerateShortUrl}>
              Generate
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ShortUrlModal;
