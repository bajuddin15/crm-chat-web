import React from "react";
import { MdOutlineCall } from "react-icons/md";
import CountryCodeSelect from "../../../components/Common/CountryCodeSelect";

interface IState {
  countryCode: string;
  phoneNumber: string;
  // errorMessage: string;
}

const dialButtons = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "*",
  "0",
  "#",
];

const DialPad = () => {
  const [countryCode, setCountryCode] =
    React.useState<IState["countryCode"]>("+1");
  const [phoneNumber, setPhoneNumber] =
    React.useState<IState["phoneNumber"]>("");

  // const [errorMessage, setErrorMessage] =
  //   React.useState<IState["errorMessage"]>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleButtonClick = (buttonText: string) => {
    if (/^\d$/.test(buttonText) && phoneNumber.length < 10) {
      setPhoneNumber(phoneNumber + buttonText);
    }
  };

  const handleDelete = () => {
    setPhoneNumber(phoneNumber.slice(0, -1));
  };

  //   const handleMakeCall

  React.useEffect(() => {
    // console.log({ countryCode });
  }, [countryCode]);

  return (
    <div className="bg-sky-100 w-full h-full px-5 py-6 flex flex-col items-center justify-end">
      <div className="w-full space-y-6">
        {/* input number */}
        <div className="">
          <CountryCodeSelect setCountryCode={setCountryCode} />
          <div className="flex items-center bg-white border border-gray-300 px-2 rounded-md mb-2 mt-5">
            <span className="sm:text-base">{countryCode}</span>
            <input
              className="border-none px-2 outline-none focus:ring-0 w-full py-2 bg-inherit sm:text-base"
              type="text"
              value={phoneNumber}
              onChange={handleChange}
            />
          </div>
          {/* {errorMessage && (
            <span className="text-sm text-rose-500">{errorMessage}</span>
          )} */}
        </div>

        {/* dial buttons */}
        <div className="grid grid-cols-3 gap-3">
          {dialButtons.map((buttonText: string) => (
            <div
              className="px-5 py-3 rounded-full cursor-pointer bg-white border border-gray-200 shadow flex items-center justify-center transform transition duration-150 ease-in-out hover:bg-gray-100 active:bg-gray-200 active:scale-95"
              key={buttonText}
              onClick={() => handleButtonClick(buttonText)}
            >
              <span className="text-base">{buttonText}</span>
            </div>
          ))}
        </div>

        {/* call button */}
        <div className="grid grid-cols-3 gap-3">
          <div></div>
          <button className="bg-green-600 text-white shadow flex items-center gap-1 px-4 py-3 rounded-full transform transition duration-150 ease-in-out hover:bg-green-700 active:bg-green-800 active:scale-95">
            <MdOutlineCall size={20} />
            <span className="text-base">Call</span>
          </button>
          <button
            className="bg-rose-500 text-white text-base shadow flex items-center justify-center gap-1 px-4 py-3 rounded-full transform transition duration-150 ease-in-out hover:bg-rose-600 active:bg-rose-700 active:scale-95"
            onClick={handleDelete}
          >
            DEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialPad;
