import React from "react";
import "./customInputs.css";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  backgroundColor?: string;
  borderRadius?: string;
  border?: string;
  focusBorderColor?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  backgroundColor = "transparent",
  borderRadius = "4px",
  border = "1px solid var(--border-color)",
  focusBorderColor = "var(--primary-color)",
  ...restProps
}) => {
  const inputStyle = {
    backgroundColor,
    borderRadius,
    border,
    padding: "10px",
    width: "100%",
    transition: "border-color 0.3s ease", // Add transition for smoother effect
  };

  return <input style={inputStyle} {...restProps} />;
};

export default CustomInput;
