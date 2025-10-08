/**
 * Button Component
 * Modern, accessible button component with multiple variants
 */

import React from "react";
import { Button as AntButton, ButtonProps as AntButtonProps } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import classNames from "classnames";
import "./Button.css";

export interface ButtonProps
  extends Omit<AntButtonProps, "type" | "size" | "variant"> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}) => {
  const buttonClasses = classNames(
    "custom-button",
    `custom-button--${variant}`,
    `custom-button--${size}`,
    {
      "custom-button--loading": loading,
      "custom-button--full-width": fullWidth,
      "custom-button--disabled": disabled,
    },
    className
  );

  const getAntdType = (): AntButtonProps["type"] => {
    switch (variant) {
      case "primary":
      case "success":
        return "primary";
      case "danger":
        return "primary";
      case "secondary":
        return "default";
      case "outline":
        return "default";
      case "ghost":
        return "text";
      default:
        return "default";
    }
  };

  const getAntdSize = (): AntButtonProps["size"] => {
    switch (size) {
      case "small":
        return "small";
      case "large":
        return "large";
      default:
        return "middle";
    }
  };

  return (
    <AntButton
      type={getAntdType()}
      size={getAntdSize()}
      loading={loading}
      disabled={disabled || loading}
      className={buttonClasses}
      icon={loading ? <LoadingOutlined /> : leftIcon}
      {...props}
    >
      {children}
      {rightIcon && !loading && rightIcon}
    </AntButton>
  );
};

export default Button;
