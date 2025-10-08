"use client";

import React, { useCallback, useMemo } from "react";
import { Form, Input, DatePicker, Select, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { EmissionDataField } from "../../types";
import { useFormManager } from "../../hooks/useFormManager";

interface FormRendererProps {
  fields: EmissionDataField[];
  onExecute: (values: Record<string, string>) => void;
  isLoading?: boolean;
  category: string;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  fields,
  onExecute,
  isLoading = false,
  category,
}) => {
  const {
    handleFieldChange,
    handleFormSubmit,
    getFieldValue,
    getFieldError,
    isFieldTouched,
    isFormValid,
  } = useFormManager({
    category,
    onFormSubmit: onExecute,
  });

  // Determine field type based on field properties
  const getFieldType = useCallback(
    (field: EmissionDataField): "date" | "number" | "text" | "select" => {
      const name = field.name?.toLowerCase() || "";

      if (name.includes("date") || name.includes("time")) return "date";
      if (
        name.includes("amount") ||
        name.includes("quantity") ||
        name.includes("value")
      )
        return "number";
      if (
        name.includes("type") ||
        name.includes("category") ||
        name.includes("unit")
      )
        return "select";

      return "text";
    },
    []
  );

  // Render field label with tooltip
  const renderFieldLabel = useCallback(
    (title: string, description?: string) => (
      <span>
        {title}
        {description && (
          <Tooltip title={description} placement="topLeft">
            <InfoCircleOutlined style={{ marginLeft: 4, color: "#1890ff" }} />
          </Tooltip>
        )}
      </span>
    ),
    []
  );

  // Handle field value changes
  const handleFieldValueChange = useCallback(
    (fieldName: string, value: any) => {
      // Convert dayjs to string for dates
      if (dayjs.isDayjs(value)) {
        handleFieldChange(fieldName, value.format("YYYY-MM-DD"));
      } else {
        handleFieldChange(fieldName, value);
      }
    },
    [handleFieldChange]
  );

  // Render individual form field
  const renderField = useCallback(
    (field: EmissionDataField) => {
      if (!field.name) return null;

      const fieldType = getFieldType(field);
      const isRequired = field.s_r !== false;
      const currentValue = getFieldValue(field.name);
      const fieldError = getFieldError(field.name);
      const isTouched = isFieldTouched(field.name);

      return (
        <Form.Item
          key={field.name}
          name={field.name}
          label={renderFieldLabel(field.title, field.desc)}
          rules={[
            {
              required: isRequired,
              message: `Please enter ${field.title}`,
            },
          ]}
          validateStatus={isTouched && fieldError ? "error" : ""}
          help={isTouched && fieldError ? fieldError : ""}
          tooltip={field.desc}
        >
          {fieldType === "date" ? (
            <DatePicker
              style={{ width: "100%" }}
              placeholder={`Select ${field.title}`}
              format="YYYY-MM-DD"
              value={currentValue ? dayjs(currentValue) : undefined}
              onChange={date => handleFieldValueChange(field.name, date)}
            />
          ) : fieldType === "number" ? (
            <Input
              type="number"
              placeholder={`Enter ${field.title}`}
              value={currentValue || ""}
              onChange={e => handleFieldValueChange(field.name, e.target.value)}
            />
          ) : fieldType === "select" ? (
            <Select
              style={{ width: "100%" }}
              placeholder={`Select ${field.title}`}
              value={currentValue}
              onChange={value => handleFieldValueChange(field.name, value)}
              allowClear
            >
              {/* Options would be loaded from formService */}
            </Select>
          ) : (
            <Input
              placeholder={`Enter ${field.title}`}
              value={currentValue || ""}
              onChange={e => handleFieldValueChange(field.name, e.target.value)}
            />
          )}
        </Form.Item>
      );
    },
    [
      getFieldType,
      renderFieldLabel,
      getFieldValue,
      getFieldError,
      isFieldTouched,
      handleFieldValueChange,
    ]
  );

  // Memoize fields to prevent unnecessary re-renders
  const visibleFields = useMemo(() => {
    return fields.filter(field => field.name);
  }, [fields]);

  return (
    <Form layout="vertical" onFinish={handleFormSubmit} disabled={isLoading}>
      {visibleFields.map(renderField)}
    </Form>
  );
};

export default FormRenderer;
