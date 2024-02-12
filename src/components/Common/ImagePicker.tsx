import React, { ChangeEvent, useState, DragEvent } from "react";
import { getUploadedUrl } from "../../api";

interface IProps {
  setMediaLink: any;
  setOpenModal: any;
}

const ImagePicker: React.FC<IProps> = ({ setMediaLink, setOpenModal }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleImagePreviewClick = () => {
    if (selectedFile) {
      uploadInputRef.current?.click();
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadImage = async () => {
    setLoading(true);
    const data = await getUploadedUrl(selectedFile);
    if (data && data?.url) {
      setMediaLink(data?.url);
      setOpenModal(false);
    }
    setLoading(false);
  };

  const [dragOver, setDragOver] = useState(false);
  const uploadInputRef = React.createRef<HTMLInputElement>();

  return (
    <section
      className="container w-full mx-auto items-center"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden items-center ${
          dragOver ? "border-green-500" : ""
        }`}
      >
        <div className="px-4 py-6">
          <div
            id="image-preview"
            className={`max-w-full mx-1 p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center text-center cursor-pointer ${
              selectedFile ? "" : "border-dashed"
            }`}
            onClick={handleImagePreviewClick}
          >
            <input
              id="upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              ref={uploadInputRef}
            />
            <label htmlFor="upload" className="cursor-pointer">
              {selectedFile ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  className="max-h-52 rounded-lg mx-auto"
                  alt="Image preview"
                />
              ) : (
                <div className="bg-gray-200 h-52 rounded-lg flex flex-col items-center justify-center text-gray-500">
                  <p>{dragOver ? "Drop image here" : "No image preview"}</p>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-8 h-8 text-gray-700 mx-auto mb-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                      Upload picture
                    </h5>
                    <p className="font-normal text-sm text-gray-400 md:px-6">
                      Choose photo size should be less than{" "}
                      <b className="text-gray-600">2mb</b>
                    </p>
                    <p className="font-normal text-sm text-gray-400 md:px-6">
                      and should be in{" "}
                      <b className="text-gray-600">JPG, PNG, or GIF</b> format.
                    </p>
                  </div>
                </div>
              )}
              <span id="filename" className="text-gray-500  z-50 mt-5">
                {selectedFile?.name || ""}
              </span>
            </label>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full">
              <button
                disabled={!selectedFile ? true : false}
                className={`w-full text-white ${
                  selectedFile
                    ? "bg-[#050708] hover:bg-[#050708]/90 cursor-pointer"
                    : "bg-[#697176]"
                }  font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center mr-2 mb-2`}
                onClick={handleUploadImage}
              >
                <span className="text-center ml-2">
                  {loading ? "Please wait.." : "Upload"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImagePicker;
