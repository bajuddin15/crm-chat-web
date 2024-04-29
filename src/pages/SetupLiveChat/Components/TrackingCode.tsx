import { handleCopy } from "../../../utils/common";
import useData from "../data";

const TrackingCode = () => {
  const { token } = useData();
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">
        Install the tracking code on your website
      </h2>
      <p className="text-sm">
        Place the code right before the end of the {"<body>"} tag on any page
        that you want to enable Live Chat on.
      </p>
      <div className="bg-gray-100 hover:bg-gray-200 w-full md:w-[700px] p-4 rounded-sm">
        <p className="text-sm text-gray-700">
          {/* Start of Live Chat Embed Code */}
          {"<!-- Start of Live Chat Embed Code -->"}
          <br />
          <p className="ml-4">
            {`<script
      type="text/javascript"
      async
      defer
      `}
            <br />
            {`src="https://cdn.jsdelivr.net/gh/njaiswal78/live-chat-widget/chatWidgetScript.js?crmToken=${token}"
    ></script>`}
          </p>
          {/* End of Live Chat Embed Code */}
          {"<!-- End of Live Chat Embed Code -->"}
        </p>
      </div>
      <button
        onClick={async () => {
          let script = `<script
          type="text/javascript"
          async
          defer
          src="https://cdn.jsdelivr.net/gh/njaiswal78/live-chat-widget/chatWidgetScript.js?crmToken=${token}"
        ></script>`;
          await handleCopy(script);
        }}
        className="text-sm text-white bg-blue-700 hover:bg-blue-600 px-5 py-2 rounded-md text-center"
      >
        Copy
      </button>
    </div>
  );
};

export default TrackingCode;
