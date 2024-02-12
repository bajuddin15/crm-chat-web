import React, { ChangeEvent, useState, DragEvent } from "react";
import { getUploadedUrl } from "../../api";

interface IProps {
  setMediaLink: any;
  setOpenModal: any;
}

const DocumentPicker: React.FC<IProps> = ({ setMediaLink, setOpenModal }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleDocumentPreviewClick = () => {
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

  const handleUploadDocument = async () => {
    setLoading(true);
    // Assuming you have a getUploadedDocumentUrl function in your API
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
          dragOver ? "border-yellow-500" : ""
        }`}
      >
        <div className="px-4 py-6">
          <div
            id="document-preview"
            className={`max-w-full mx-1 p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center text-center cursor-pointer ${
              selectedFile ? "" : "border-dashed"
            }`}
            onClick={handleDocumentPreviewClick}
          >
            <input
              id="uploadDocument"
              type="file"
              className="hidden"
              accept=".pdf, .doc, .docx"
              onChange={handleFileChange}
              ref={uploadInputRef}
            />
            <label htmlFor="uploadDocument" className="cursor-pointer">
              {selectedFile ? (
                <div className="text-gray-700">
                  <span role="img" aria-label="Document Icon">
                    📄
                  </span>
                  <p>{selectedFile.name}</p>
                </div>
              ) : (
                <div className="bg-gray-200 h-52 rounded-lg flex flex-col items-center justify-center text-gray-500">
                  <p>
                    {dragOver ? "Drop document here" : "No document preview"}
                  </p>
                  <div>
                    {/* Add an appropriate document upload icon here */}
                    <span role="img" aria-label="Document Icon">
                      📄
                    </span>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                      Upload document
                    </h5>
                    <p className="font-normal text-sm text-gray-400 md:px-6">
                      Choose document size should be less than{" "}
                      <b className="text-gray-600">5mb</b>
                    </p>
                    <p className="font-normal text-sm text-gray-400 md:px-6">
                      Supported formats:{" "}
                      <b className="text-gray-600">PDF, DOC, DOCX</b>.
                    </p>
                  </div>
                </div>
              )}
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
                }   font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center mr-2 mb-2`}
                onClick={handleUploadDocument}
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

export default DocumentPicker;
