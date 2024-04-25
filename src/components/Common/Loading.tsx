import { ColorRing } from "react-loader-spinner";
import { colors } from "../../utils/constants";

const Loading = () => {
  return (
    <div>
      <ColorRing
        visible={true}
        height="32"
        width="32"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={[
          colors.primary,
          colors.primary,
          colors.primary,
          colors.primary,
          colors.primary,
        ]}
      />
    </div>
  );
};

export default Loading;
