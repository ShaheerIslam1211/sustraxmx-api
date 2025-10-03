import React from "react";
import { Spin } from "antd";
import "./index.css"; // Make sure this path is correct

interface SpinnerProps {
  isLoading?: boolean;
  size?: "small" | "default" | "large";
}

const Spinner: React.FC<SpinnerProps> = ({ isLoading = true, size = "large" }) => {
  if (!isLoading) return null;

  return (
    <div className="spinner-container">
      <Spin className="green-spinner" size={size} />
    </div>
  );
};

export default Spinner;
