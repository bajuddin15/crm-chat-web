import ConfigureWidgets from "./Components/ConfigureWidgets";
import TrackingCode from "./Components/TrackingCode";
import ConfigureChannels from "./Components/ConfigureChannels";
import useData from "./data";
import BotSettings from "./Components/BotSettings";

type Tabs =
  | "configureWidgets"
  | "configureChannels"
  | "trackingCode"
  | "botSettings";

interface TabProps {
  isFreePlan: boolean;
  activeTab: string;
  setActiveTab: any;
}

const SetupLiveChat = () => {
  const { isFreePlan, activeTab, setActiveTab } = useData();

  const getTabComponent = (tab: Tabs) => {
    switch (tab) {
      case "configureWidgets":
        return <ConfigureWidgets setActiveTab={setActiveTab} />;
      case "botSettings":
        return <BotSettings setActiveTab={setActiveTab} />;
      case "configureChannels":
        return <ConfigureChannels setActiveTab={setActiveTab} />;
      case "trackingCode":
        return <TrackingCode />;
    }
  };
  return (
    <div className="w-full h-screen overflow-y-auto px-4 md:px-10">
      <TabNavigation
        isFreePlan={isFreePlan}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="mt-4">{getTabComponent(activeTab)}</div>
    </div>
  );
};

export default SetupLiveChat;

const TabNavigation: React.FC<TabProps> = ({
  isFreePlan,
  activeTab,
  setActiveTab,
}) => {
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
            onClick={() => handleTabClick("configureWidgets")}
            className={`inline-block p-4 border-b-2 rounded-t-lg ${
              activeTab === "configureWidgets"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-b-transparent dark:text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            }`}
          >
            Configure Widgets
          </a>
        </li>
        {!isFreePlan && (
          <li className="me-2">
            <a
              href="#"
              onClick={() => handleTabClick("botSettings")}
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "botSettings"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-b-transparent dark:text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              Bot Settings
            </a>
          </li>
        )}
        {/* Tab 2: Availability */}
        <li className="me-2">
          <a
            href="#"
            onClick={() => handleTabClick("configureChannels")}
            className={`inline-block p-4 border-b-2 rounded-t-lg ${
              activeTab === "configureChannels"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-b-transparent dark:text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            }`}
          >
            Configure Channels
          </a>
        </li>
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
