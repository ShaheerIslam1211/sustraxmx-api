import { CheckOutlined } from "@ant-design/icons";
import React, { useState } from "react";

interface TickButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  tickColor?: string;
}

// Assuming you're using placeholder icons here. Replace these with your actual icons.
const TickButton: React.FC<TickButtonProps> = ({
  icon,
  onClick,
  tickColor = "darkgrey",
}) => {
  const TickIcon = <CheckOutlined style={{ color: tickColor }} />;
  const [state, setState] = useState("default"); // 'default' or 'tick'

  const handleClick = () => {
    if (state !== "default") {
      return;
    }
    onClick(); // Call the provided onClick function

    setState("tick"); // Change to tick icon

    // After 2 seconds, revert back to the default icon
    setTimeout(() => {
      setState("default");
    }, 2000);
  };

  return (
    <div style={{ cursor: "pointer" }} onClick={handleClick}>
      {state === "default" ? icon : TickIcon}
    </div>
  );
};

export default TickButton;
