import React from "react";
import Select, { ActionMeta, SingleValue } from "react-select";

interface Option {
  value: string;
  label: string;
}

interface SingleSelectProps {
  options: Option[];
  selectedOption: Option | null;
  onChange: (
    selected: SingleValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => void;
  title: string;
  placeholder: string;
}

const SingleSelect: React.FC<SingleSelectProps> = ({
  options,
  selectedOption,
  onChange,
  title,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm">{title}</span>
      <Select
        value={selectedOption}
        onChange={onChange}
        options={options}
        className="single-select-container text-sm"
        classNamePrefix="single-select"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SingleSelect;
