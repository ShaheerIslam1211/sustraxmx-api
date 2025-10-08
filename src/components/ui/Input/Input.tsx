/**
 * Input Component
 * Modern, accessible input component with validation and styling
 */

import React, { forwardRef } from "react";
import { Input as AntInput, InputProps as AntInputProps } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import classNames from "classnames";
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
      variant = "outlined",
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
    const inputClasses = classNames(
      "custom-input",
      `custom-input--${variant}`,
      `custom-input--${size}`,
      {
        "custom-input--error": error,
        "custom-input--disabled": disabled,
        "custom-input--full-width": fullWidth,
        "custom-input--with-left-icon": leftIcon,
        "custom-input--with-right-icon": rightIcon,
      },
      className
    );

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

        {(error || helperText) && (
          <div className="custom-input-message">
            {error && <span className="custom-input-error">{error}</span>}
            {helperText && !error && (
              <span className="custom-input-helper">{helperText}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
