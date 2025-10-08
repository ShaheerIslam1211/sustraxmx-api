import React, { useState } from "react";
import { Input, Space } from "antd";
import "./formInput.css";

interface Credentials {
  username: string;
  password: string;
}

interface UserAuthInputsProps {
  updateCredentials: (credentials: Credentials) => void;
}

export const UserAuthInputs: React.FC<UserAuthInputsProps> = ({
  updateCredentials,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    updateCredentials({ username: newUsername, password });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    updateCredentials({ username, password: newPassword });
  };

  return (
    <Space.Compact>
      {/* <Input
        addonBefore="Basic"
        value={username}
        placeholder="Username"
        onChange={handleUsernameChange}
        style={{ width: "calc(50% - 2px)", borderRight: "none" }}
      />
      <Input.Password
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        style={{ width: "calc(50% - 2px)" }}
      /> */}
    </Space.Compact>
  );
};

// Styles moved to formInput.css for dark mode support

interface CustomInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  addonBefore?: string;
  readOnly?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onChange,
  placeholder,
  addonBefore,
  readOnly,
}) => (
  <Input
    className="custom-form-input"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    addonBefore={addonBefore}
    readOnly={readOnly}
  />
);

interface SingleInputProps {
  addonBefore?: string;
  value?: string;
  readOnly?: boolean;
}

export const SingleInput: React.FC<SingleInputProps> = ({
  addonBefore,
  value,
  readOnly,
}) => {
  return (
    <Input
      addonBefore={addonBefore}
      value={value}
      readOnly={readOnly}
      style={{ width: "100%" }}
    />
  );
};
