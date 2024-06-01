import { Button } from "flowbite-react";
import { X } from "lucide-react";
import React from "react";
import { SingleValue } from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import SingleSelect from "../../../../../components/Common/SingleSelect";
import {
  setFilterLabelId,
  setFilterOwnerId,
} from "../../../../../store/slices/storeSlice";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IState {
  labelOptions: any;
  teamOptions: any;
  selectedLabels: any;
}

const FilterDrawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const filterLabelId = useSelector(
    (state: RootState) => state.store.filterLabelId
  );
  const filterOwnerId = useSelector(
    (state: RootState) => state.store.filterOwnerId
  );

  const allLabels = useSelector((state: RootState) => state.store.allLabels);
  // teamMembers
  const teamMembers = useSelector(
    (state: RootState) => state.store.teamMembers
  );

  const [labelOptions, setLabelOptions] = React.useState<
    IState["labelOptions"]
  >([]);
  const [teamOptions, setTeamOptions] = React.useState<IState["teamOptions"]>(
    []
  );

  const [selectedLabel, setSelectedLabel] = React.useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedConvOwner, setSelectedConvOwner] = React.useState<{
    value: string;
    label: string;
  } | null>(null);

  const handleChangeLabel = (
    selected: SingleValue<{ value: string; label: string }>
  ) => {
    setSelectedLabel(selected);
  };
  const handleChangeOwner = (
    selected: SingleValue<{ value: string; label: string }>
  ) => {
    setSelectedConvOwner(selected);
  };

  // handle apply filer
  const handleApplyFilter = () => {
    const labelId = selectedLabel?.value || "";
    const ownerId = selectedConvOwner?.value || "";
    dispatch(setFilterLabelId(labelId));
    dispatch(setFilterOwnerId(ownerId));
    onClose();
  };

  const handleResetFilter = () => {
    dispatch(setFilterLabelId(""));
    dispatch(setFilterOwnerId(""));
    setSelectedLabel(null);
    setSelectedConvOwner(null);
    onClose();
  };

  React.useEffect(() => {
    const options = allLabels.map((item) => ({
      value: item?._id,
      label: item?.label,
    }));
    const selected = options.find((item) => item?.value === filterLabelId);
    if (selected) {
      setSelectedLabel(selected);
    }
    setLabelOptions(options);
  }, [allLabels]);
  React.useEffect(() => {
    const options = teamMembers.map((item) => ({
      value: item?.userId,
      label: item?.name,
    }));
    const selected = options.find((item) => item?.value === filterOwnerId);
    if (selected) {
      setSelectedLabel(selected);
    }
    setTeamOptions(options);
  }, [teamMembers]);
  return (
    <div
      className={`absolute top-0 left-0 h-full w-full bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="flex items-center justify-between py-[13px] px-4">
        <span className="text-base font-medium text-gray-700">
          Select Filters
        </span>
        <button
          className="text-gray-700 hover:text-gray-800 rounded-lg p-1 hover:bg-gray-200"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      <div className="h-[80vh] px-4 py-2 space-y-5">
        <SingleSelect
          options={labelOptions}
          selectedOption={selectedLabel}
          onChange={handleChangeLabel}
          title="Labels"
          placeholder="Select label"
        />
        <SingleSelect
          options={teamOptions}
          selectedOption={selectedConvOwner}
          onChange={handleChangeOwner}
          title="Conversation Owner"
          placeholder="Select Owner"
        />
      </div>

      {/* footer */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3">
        <Button onClick={handleResetFilter} color="light" size="sm">
          Reset
        </Button>
        <Button onClick={handleApplyFilter} color="blue" size="sm">
          Apply
        </Button>
      </div>
    </div>
  );
};

export default FilterDrawer;
