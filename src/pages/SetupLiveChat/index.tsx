type Tabs = "configure" | "availability" | "trackingCode";

interface TabProps {
  activeTab: string;
  setActiveTab: any;
}

const SetupLiveChat = () => {
  const [activeTab, setActiveTab] = useState<Tabs>("configure");

  const getTabComponent = (tab: Tabs) => {
    switch (tab) {
      case "configure":
        return <Configure />;
      case "availability":
        return <Availability />;
      case "trackingCode":
        return <TrackingCode />;
    }
  };
  return (
    <div className="w-full h-screen overflow-y-auto px-4 md:px-10">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-4">{getTabComponent(activeTab)}</div>
    </div>
  );
};

export default SetupLiveChat;

import { useState } from "react";
import Configure from "./Components/Configure";
import Availability from "./Components/Availability";
import TrackingCode from "./Components/TrackingCode";

const TabNavigation: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  const handleTabClick = (tabName: Tabs) => {
    setActiveTab(tabName); // Update the active tab state when a tab is clicked
  };

  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
        {/* Tab 1: Configure */}
        <li className="me-2">
          <a
            href="#"
            onClick={() => handleTabClick("configure")}
            className={`inline-block p-4 border-b-2 rounded-t-lg ${
              activeTab === "configure"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-b-transparent dark:text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            }`}
          >
            Configure
          </a>
        </li>
        {/* Tab 2: Availability */}
        {/* <li className="me-2">
          <a
            href="#"
            onClick={() => handleTabClick("availability")}
            className={`inline-block p-4 border-b-2 rounded-t-lg ${
              activeTab === "availability"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-b-transparent dark:text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            }`}
          >
            Availability
          </a>
        </li> */}
        {/* Tab 3: Tracking Code */}
        <li className="me-2">
          <a
            href="#"
            onClick={() => handleTabClick("trackingCode")}
            className={`inline-block p-4 border-b-2 rounded-t-lg ${
              activeTab === "trackingCode"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-b-transparent dark:text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            }`}
          >
            Tracking Code
          </a>
        </li>
      </ul>
    </div>
  );
};
