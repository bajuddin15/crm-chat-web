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
              <p className="text-sm font-normal text-gray-900 dark:text-white">
                {item.message}
              </p>
              {item?.mediaType === "image" && (
                <div className="group relative my-2.5">
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
          {item.message && (
            <div className="flex flex-col gap-1 max-w-[80%]">
              <div className="flex flex-col leading-1.5 px-3 py-2 border-gray-200 bg-blue-100 rounded-s-xl rounded-ee-xl dark:bg-gray-700">
                <p className="text-sm font-normal text-gray-900 dark:text-white">
                  {item.message}
                </p>
                {item?.mediaType === "image" && (
                  <div className="group relative my-2.5">
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

                {item?.mediaType === "pdf" && (
                  <div className="flex items-start bg-gray-50 dark:bg-gray-600 rounded-xl p-2 border border-gray-300">
                    <div className="me-2">
                      <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white pb-2">
                        <svg
                          fill="none"
                          aria-hidden="true"
                          className="w-5 h-5 flex-shrink-0"
                          viewBox="0 0 20 21"
                        >
                          <g clip-path="url(#clip0_3173_1381)">
                            <path
                              fill="#E2E5E7"
                              d="M5.024.5c-.688 0-1.25.563-1.25 1.25v17.5c0 .688.562 1.25 1.25 1.25h12.5c.687 0 1.25-.563 1.25-1.25V5.5l-5-5h-8.75z"
                            />
                            <path
                              fill="#B0B7BD"
                              d="M15.024 5.5h3.75l-5-5v3.75c0 .688.562 1.25 1.25 1.25z"
                            />
                            <path
                              fill="#CAD1D8"
                              d="M18.774 9.25l-3.75-3.75h3.75v3.75z"
                            />
                            <path
                              fill="#F15642"
                              d="M16.274 16.75a.627.627 0 01-.625.625H1.899a.627.627 0 01-.625-.625V10.5c0-.344.281-.625.625-.625h13.75c.344 0 .625.281.625.625v6.25z"
                            />
                            <path
                              fill="#fff"
                              d="M3.998 12.342c0-.165.13-.345.34-.345h1.154c.65 0 1.235.435 1.235 1.269 0 .79-.585 1.23-1.235 1.23h-.834v.66c0 .22-.14.344-.32.344a.337.337 0 01-.34-.344v-2.814zm.66.284v1.245h.834c.335 0 .6-.295.6-.605 0-.35-.265-.64-.6-.64h-.834zM7.706 15.5c-.165 0-.345-.09-.345-.31v-2.838c0-.18.18-.31.345-.31H8.85c2.284 0 2.234 3.458.045 3.458h-1.19zm.315-2.848v2.239h.83c1.349 0 1.409-2.24 0-2.24h-.83zM11.894 13.486h1.274c.18 0 .36.18.36.355 0 .165-.18.3-.36.3h-1.274v1.049c0 .175-.124.31-.3.31-.22 0-.354-.135-.354-.31v-2.839c0-.18.135-.31.355-.31h1.754c.22 0 .35.13.35.31 0 .16-.13.34-.35.34h-1.455v.795z"
                            />
                            <path
                              fill="#CAD1D8"
                              d="M15.649 17.375H3.774V18h11.875a.627.627 0 00.625-.625v-.625a.627.627 0 01-.625.625z"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_3173_1381">
                              <path
                                fill="#fff"
                                d="M0 0h20v20H0z"
                                transform="translate(0 .5)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        Flowbite Terms & Conditions
                      </span>
                      <span className="flex text-xs font-normal text-gray-500 dark:text-gray-400 gap-2">
                        12 Pages
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="self-center"
                          width="3"
                          height="4"
                          viewBox="0 0 3 4"
                          fill="none"
                        >
                          <circle cx="1.5" cy="2" r="1.5" fill="#6B7280" />
                        </svg>
                        18 MB
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="self-center"
                          width="3"
                          height="4"
                          viewBox="0 0 3 4"
                          fill="none"
                        >
                          <circle cx="1.5" cy="2" r="1.5" fill="#6B7280" />
                        </svg>
                        PDF
                      </span>
                    </div>
                    <div className="inline-flex self-center items-center">
                      <a
                        href={item.mediaUrl} // Assuming `item.mediaUrl` is the PDF URL
                        download="Flowbite_Terms_and_Conditions.pdf"
                        className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                      >
                        <svg
                          className="w-4 h-4 text-gray-900 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                          <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                        </svg>
                      </a>
                    </div>
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
