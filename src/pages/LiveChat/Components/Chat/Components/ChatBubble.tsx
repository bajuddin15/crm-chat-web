import React from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { useAuthContext } from "../../../../../context/AuthContext";
import { getFormatedTime } from "../../../../../utils/common";

interface IProps {
  item: any; // message data here
}

const ChatBubble: React.FC<IProps> = ({ item }) => {
  const { authUser } = useAuthContext();
  const messageType =
    authUser?._id === item?.senderId ? "Outgoing" : "Incoming";

  const formatedTime = getFormatedTime(item?.createdAt);

  return (
    <div className="mb-2">
      {messageType === "Incoming" ? (
        <div className="flex justify-start gap-2.5">
          <div className="flex flex-col gap-1 max-w-[80%]">
            <div className="flex flex-col leading-1.5 px-3 py-2 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
              <div
                dangerouslySetInnerHTML={{ __html: item.message }}
                className="text-sm font-normal text-gray-900 dark:text-white"
              />

              {item?.mediaType === "image" && (
                <div className="group relative my-2.5">
                  <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <a
                      // data-tooltip-target="download-image"
                      href={item?.mediaUrl}
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 18"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                        />
                      </svg>
                    </a>
                    <div
                      id="download-image"
                      role="tooltip"
                      className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                    >
                      Download image
                      <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                  </div>
                  <img
                    src={item.mediaUrl}
                    className="w-full h-full rounded-lg"
                  />
                </div>
              )}

              {item?.mediaType === "video" && (
                <div className="my-3">
                  <video className="w-full rounded-lg" controls>
                    <source src={item?.mediaUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {item?.mediaType !== "image" &&
                item?.mediaType !== "video" &&
                item?.mediaType && (
                  <div className="flex items-start">
                    <a
                      href={item?.mediaUrl}
                      target="_blank"
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                    >
                      View File
                    </a>
                  </div>
                )}
              <div className="flex items-center justify-end gap-2 mt-1">
                <span className="text-[10px] text-gray-500 font-normal">
                  {formatedTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-2.5">
          {item?.snippets?.length > 0 && (
            <div className="flex flex-col items-end justify-start gap-2.5">
              {item?.snippets.map((snippet: string, index: number) => {
                return (
                  <div
                    key={index}
                    className="text-sm py-2 px-3 rounded-md border border-solid border-blue-500 text-blue-500"
                  >
                    {snippet}
                  </div>
                );
              })}
            </div>
          )}
          {(item.message || item.mediaUrl) && (
            <div className="flex flex-col gap-1 max-w-[80%]">
              <div className="flex flex-col leading-1.5 px-3 py-2 border-gray-200 bg-blue-100 rounded-s-xl rounded-ee-xl dark:bg-gray-700">
                <div
                  dangerouslySetInnerHTML={{ __html: item.message }}
                  className="text-sm font-normal text-gray-900 dark:text-white"
                />

                {item?.mediaType === "image" && (
                  <div className="group relative my-2.5">
                    <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                      <a
                        // data-tooltip-target="download-image"
                        href={item?.mediaUrl}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50"
                      >
                        <svg
                          className="w-5 h-5 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 16 18"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                          />
                        </svg>
                      </a>
                      <div
                        id="download-image"
                        role="tooltip"
                        className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                      >
                        Download image
                        <div className="tooltip-arrow" data-popper-arrow></div>
                      </div>
                    </div>
                    <img
                      src={item.mediaUrl}
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                )}

                {item?.mediaType === "video" && (
                  <div className="my-3">
                    <video className="w-full rounded-lg" controls>
                      <source src={item?.mediaUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {item?.mediaType !== "image" &&
                  item?.mediaType !== "video" &&
                  item?.mediaType && (
                    <div className="flex items-start">
                      <a
                        href={item?.mediaUrl}
                        target="_blank"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                      >
                        View File
                      </a>
                    </div>
                  )}
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="text-[10px] text-gray-500 font-normal">
                    {formatedTime}
                  </span>
                  <IoCheckmarkDone size={14} color="blue" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBubble;

{
  /* <div className="group relative my-2.5">
                <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <button
                    data-tooltip-target="download-image"
                    className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 16 18"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                      />
                    </svg>
                  </button>
                  <div
                    id="download-image"
                    role="tooltip"
                    className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                  >
                    Download image
                    <div className="tooltip-arrow" data-popper-arrow></div>
                  </div>
                </div>
                <img src={IMAGE_URL} className="rounded-lg" />
              </div> */
}
