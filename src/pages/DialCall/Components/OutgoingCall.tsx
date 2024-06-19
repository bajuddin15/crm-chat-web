import { MdCallEnd } from "react-icons/md";
import { LiaUserSolid } from "react-icons/lia";

const OutgoingCall = () => {
  return (
    <div className="bg-sky-100 w-full h-full px-5 py-10 flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-sky-500 text-white flex items-center justify-center">
          <LiaUserSolid size={36} />
        </div>

        <div className="mt-2">
          <span className="text-sm">Ready</span>
        </div>
      </div>

      <div>
        <button className="bg-rose-500 text-white w-full py-[10px] px-4 rounded-md flex items-center justify-center transform transition duration-150 ease-in-out hover:bg-rose-600 active:bg-rose-700 active:scale-95">
          <MdCallEnd size={24} />
        </button>
      </div>
    </div>
  );
};

export default OutgoingCall;
