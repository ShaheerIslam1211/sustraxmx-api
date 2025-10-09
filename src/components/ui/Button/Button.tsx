/**
 * Button Component
 * Modern, accessible button component with multiple variants
 */

import React from "react";
import { Button as AntButton, ButtonProps as AntButtonProps } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { cn } from "@/utils/cn";
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
  const getVariantClasses = () => {
    const baseClasses = "custom-button";
    const variantClasses = {
      primary: "custom-button--primary",
      secondary: "custom-button--secondary",
      outline: "custom-button--outline",
      ghost: "custom-button--ghost",
      danger: "custom-button--danger",
      success: "custom-button--success",
    };

    return cn(baseClasses, variantClasses[variant]);
  };

  const getSizeClasses = () => {
    const sizeClasses = {
      small: "custom-button--small",
      medium: "custom-button--medium",
      large: "custom-button--large",
    };

    return sizeClasses[size];
  };

  const getAntdType = (): AntButtonProps["type"] => {
    switch (variant) {
      case "primary":
      case "success":
        return "primary";
      case "danger":
        return "primary";
      case "secondary":
      case "outline":
      case "ghost":
        return "default";
      default:
        return "primary";
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

  const buttonClasses = cn(
    getVariantClasses(),
    getSizeClasses(),
    {
      "custom-button--loading": loading,
      "custom-button--disabled": disabled,
      "custom-button--full-width": fullWidth,
    },
    className
  );

  return (
    <AntButton
      type={getAntdType()}
      size={getAntdSize()}
      loading={loading}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {!loading && leftIcon && (
        <span className="custom-button__left-icon">{leftIcon}</span>
      )}
      {loading && <LoadingOutlined className="custom-button__loading-icon" />}
      {children}
      {!loading && rightIcon && (
        <span className="custom-button__right-icon">{rightIcon}</span>
      )}
    </AntButton>
  );
};

export default Button;
