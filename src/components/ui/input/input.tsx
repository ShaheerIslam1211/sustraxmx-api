/**
 * Input Component
 * Modern, accessible input component with validation and styling
 */

import React, { forwardRef } from "react";
import { Input as AntInput, InputProps as AntInputProps } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { cn } from "@/utils/cn";
import "./Input.css";

export interface InputProps extends Omit<AntInputProps, "size" | "variant"> {
  variant?: "default" | "filled" | "outlined";
  size?: "small" | "medium" | "large";
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  required?: boolean;
}

export const Input = forwardRef<any, InputProps>(
  (
    {
      variant = "default",
      size = "medium",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      required = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const getVariantClasses = () => {
      const baseClasses = "custom-input";
      const variantClasses = {
        default: "custom-input--default",
        filled: "custom-input--filled",
        outlined: "custom-input--outlined",
      };

      return cn(baseClasses, variantClasses[variant]);
    };

    const getSizeClasses = () => {
      const sizeClasses = {
        small: "custom-input--small",
        medium: "custom-input--medium",
        large: "custom-input--large",
      };

      return sizeClasses[size];
    };

    const getAntdSize = (): AntInputProps["size"] => {
      switch (size) {
        case "small":
          return "small";
        case "large":
          return "large";
        default:
          return "middle";
      }
    };

    const inputClasses = cn(
      getVariantClasses(),
      getSizeClasses(),
      {
        "custom-input--error": !!error,
        "custom-input--disabled": disabled,
        "custom-input--full-width": fullWidth,
        "custom-input--with-left-icon": !!leftIcon,
        "custom-input--with-right-icon": !!rightIcon,
      },
      className
    );

    const renderInput = () => {
      if (props.type === "password") {
        return (
          <AntInput.Password
            ref={ref}
            size={getAntdSize()}
            className={inputClasses}
            disabled={disabled}
            iconRender={visible =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            {...props}
          />
        );
      }

      return (
        <AntInput
          ref={ref}
          size={getAntdSize()}
          className={inputClasses}
          disabled={disabled}
          prefix={leftIcon}
          suffix={rightIcon}
          {...props}
        />
      );
    };

    return (
      <div className="custom-input-wrapper">
        {label && (
          <label className="custom-input-label">
            {label}
            {required && <span className="custom-input-required">*</span>}
          </label>
        )}

        {renderInput()}

        {error && <div className="custom-input-error">{error}</div>}

        {helperText && !error && (
          <div className="custom-input-helper">{helperText}</div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
