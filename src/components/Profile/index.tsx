interface IProps {
  contactProfileDetails: any;
}

const Profile = ({ contactProfileDetails }: IProps) => {
  return (
    <div>
      <span className="text-sm">Contact Info</span>
      <div className="border border-gray-300 p-4 my-4 rounded-xl">
        <div className="flex items-center gap-4 pb-4">
          <img
            className="w-7 h-7 rounded-full"
            src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"
            alt="Rounded avatar"
          />
          <span className="text-sm font-semibold">{`${contactProfileDetails?.fname} ${contactProfileDetails?.lname}`}</span>
        </div>
        <hr />
        <div className="flex flex-col gap-4 px-2 py-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Phone:</span>
            <span className="text-xs">{contactProfileDetails?.phone}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Email:</span>
            <span className="text-xs">{contactProfileDetails?.email}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Consent:</span>
            <span className="text-xs">
              {contactProfileDetails?.opt_in === "1" ? "Opted In" : "Opted Out"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
