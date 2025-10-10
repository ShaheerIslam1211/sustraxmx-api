/**
 * Form Field Component
 * Reusable form field with validation and styling
 */

import React from "react";
import { Form, FormItemProps } from "antd";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils";
import "./FormField.css";

export interface FormFieldProps extends Omit<FormItemProps, "children"> {
  name: string;
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "outlined";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  className?: string;
  value?: any;
  onChange?: (value: any) => void;
  onBlur?: (e: React.FocusEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  readOnly = false,
  helperText,
  leftIcon,
  rightIcon,
  variant = "default",
  size = "medium",
  fullWidth = false,
  className,
  value,
  onChange,
  onBlur,
  onFocus,
  ...formItemProps
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const inputProps = {
    type,
    placeholder,
    disabled,
    readOnly,
    leftIcon,
    rightIcon,
    variant,
    size,
    fullWidth,
    value,
    onChange: handleChange,
    onBlur,
    onFocus,
  };

  return (
    <Form.Item
      name={name}
      label={label}
      required={required}
      className={cn("form-field", className)}
      {...formItemProps}
    >
      <Input {...inputProps} />
      {helperText && <div className="form-field-helper">{helperText}</div>}
    </Form.Item>
  );
};

export default FormField;
