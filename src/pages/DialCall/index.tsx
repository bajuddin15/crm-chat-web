import DialPad from "./Components/DialPad";
// import OutgoingCall from "./Components/OutgoingCall";

const DialCall = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 w-full h-screen">
      <div className="col-span-3"></div>
      <div>
        <DialPad />
        {/* <OutgoingCall /> */}
      </div>
    </div>
  );
};

export default DialCall;
