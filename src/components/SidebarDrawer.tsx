import { useState } from "react";
import { contactStatusData } from "../constants";
import { Filter } from "lucide-react";
import { colors } from "../utils/constants";
import { Badge } from "flowbite-react";

interface IProps {
  allLabels: Array<any>;
  teamMembers: Array<any>;
  contactStatusVal: string;
  setContactStatusVal: any;
  setSelectedFilterLabelId: any;
  setSelectedFilterOwnerId: any;
}

interface IState {
  status: string;
}

const SidebarDrawer = ({
  allLabels,
  teamMembers,
  contactStatusVal,
  setContactStatusVal,
  setSelectedFilterLabelId,
  setSelectedFilterOwnerId,
}: IProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [status, setStatus] = useState<IState["status"]>(contactStatusVal);
  const [labelId, setLabelId] = useState<any>("");
  const [ownerId, setOwnerId] = useState<any>("");
  const [cntAppliedFilter, setCntAppliedFilter] = useState<number>(0);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleApplyFilter = () => {
    setContactStatusVal(status);
    setSelectedFilterLabelId(labelId);
    setSelectedFilterOwnerId(ownerId);
    let cntFilter = 1;
    if (labelId) {
      cntFilter++;
    }
    if (ownerId) {
      cntFilter++;
    }
    setCntAppliedFilter(cntFilter);
    setIsDrawerOpen(false);
  };

  const handleReset = () => {
    setStatus(contactStatusVal);
    setLabelId("");
    setOwnerId("");
    setContactStatusVal("All");
    setSelectedFilterLabelId(null);
    setSelectedFilterOwnerId(null);
    setCntAppliedFilter(0);
    setIsDrawerOpen(false);
  };

  return (
    <div>
      <div>
        <button className="mt-2 relative" onClick={toggleDrawer}>
          <Filter size={20} />

          {cntAppliedFilter > 0 && (
            <span
              style={{ backgroundColor: colors.whatsapp }}
              className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center text-[10px] text-white rounded-full"
            >
              {cntAppliedFilter}
            </span>
          )}
        </button>
      </div>

      <div
        id="drawer-example"
        className={`fixed top-0 left-0 z-40 h-screen overflow-hidden transition-transform ${
          isDrawerOpen ? "" : "-translate-x-full"
        } bg-white w-80 dark:bg-gray-800`}
        tabIndex={-1}
        aria-labelledby="drawer-label"
      >
        <div className="bg-white h-screen relative">
          <div className="fixed top-0 left-0 borderBottom h-14 w-80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h5
                id="drawer-label"
                className="inline-flex items-center ml-4 text-base font-semibold text-gray-700 dark:text-gray-400"
              >
                Select filters
              </h5>
              {cntAppliedFilter > 0 && (
                <Badge color="success">{cntAppliedFilter} filter applied</Badge>
              )}
            </div>
            <button
              type="button"
              onClick={toggleDrawer}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <div className="custom-scrollbar mt-16 h-screen overflow-y-auto overflow-x-hidden p-4 flex-1">
            {/* hhs */}

            <form className="max-w-sm mx-auto">
              <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Chat Status
              </label>
              <select
                id="chatStatus"
                className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setStatus(e.target.value)}
              >
                {contactStatusData?.map((item, index) => {
                  return (
                    <option key={index} value={item} selected={status === item}>
                      {item}
                    </option>
                  );
                })}
              </select>
            </form>
            <form className="max-w-sm mx-auto my-5">
              <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Labels
              </label>
              <select
                id="labels"
                className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setLabelId(e.target.value)}
              >
                <option value="" selected={labelId === ""}>
                  Choose Label
                </option>
                {allLabels?.map((item, index) => {
                  return (
                    <option
                      key={index}
                      value={item?.labelId}
                      selected={labelId === item?.labelId}
                    >
                      {item?.label}
                    </option>
                  );
                })}
              </select>
            </form>
            <form className="max-w-sm mx-auto my-5">
              <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Conversation Owner
              </label>
              <select
                id="assignee"
                className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setOwnerId(e.target.value)}
              >
                <option value="" selected={ownerId === ""}>
                  Choose Owner
                </option>
                {teamMembers
                  ?.filter((item) => item?.name)
                  ?.map((item, index) => {
                    return (
                      <option
                        key={index}
                        value={item?.userId}
                        selected={ownerId === item?.userId}
                      >
                        {item?.name}
                      </option>
                    );
                  })}
              </select>
            </form>
          </div>
          <div className="fixed bottom-0 left-0 w-80 flex p-4 items-center justify-between">
            <button
              onClick={handleReset}
              className="text-sm border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-100"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilter}
              className="text-sm bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarDrawer;
