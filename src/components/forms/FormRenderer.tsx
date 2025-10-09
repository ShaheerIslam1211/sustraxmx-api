"use client";

import React, { useCallback, useMemo } from "react";
import { Form, Input, DatePicker, Select, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { EmissionDataField } from "../../types";
import { useFormManager } from "../../hooks/useFormManager";
import {
  getFieldTypeConfig,
  validateFieldValue,
  getInputProps,
} from "../../lib/fieldTypes";

interface FormRendererProps {
  fields: EmissionDataField[];
  onExecute: (values: Record<string, string>) => void;
  onFieldChange?: (
    fieldName: string,
    value: any,
    allValues: Record<string, any>
  ) => void;
  isLoading?: boolean;
  category: string;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  fields,
  onExecute,
  onFieldChange,
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
    getFormData,
    clearForm,
  } = useFormManager({
    category,
    onFormSubmit: onExecute,
    onFieldChange: (fieldName, value) => {
      console.log("FormRenderer onFieldChange called:", { fieldName, value });
      if (onFieldChange) {
        const allValues = getFormData();
        console.log("FormRenderer calling parent onFieldChange with:", {
          fieldName,
          value,
          allValues,
        });
        onFieldChange(fieldName, value, allValues);
      }
    },
  });

  // Clear form when category changes
  React.useEffect(() => {
    clearForm();
  }, [category, clearForm]);

  // Get field type configuration using the new system
  const getFieldConfig = useCallback((field: EmissionDataField) => {
    return getFieldTypeConfig(field.name || "", field.title);
  }, []);

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

  // Handle field value changes with validation
  const handleFieldValueChange = useCallback(
    (fieldName: string, value: any, fieldConfig?: any) => {
      // Convert dayjs to string for dates
      if (dayjs.isDayjs(value)) {
        handleFieldChange(fieldName, value.format("YYYY-MM-DD"));
        return;
      }

      // Validate the value if field config is provided
      if (fieldConfig) {
        const validation = validateFieldValue(value, fieldConfig, fieldName);
        if (!validation.isValid) {
          // Set error in form state
          handleFieldChange(fieldName, value, validation.error);
          return;
        }
      }

      handleFieldChange(fieldName, value);
    },
    [handleFieldChange]
  );

  // Render individual form field
  const renderField = useCallback(
    (field: EmissionDataField) => {
      if (!field.name) return null;

      const fieldConfig = getFieldConfig(field);
      const isRequired = field.s_r !== false;
      const currentValue = getFieldValue(field.name);
      const fieldError = getFieldError(field.name);
      const isTouched = isFieldTouched(field.name);
      const inputProps = getInputProps(fieldConfig);

      // Custom validation rule for the field
      const customValidator = (_: any, value: any) => {
        if (!value && !isRequired) return Promise.resolve();

        const validation = validateFieldValue(value, fieldConfig, field.name);
        if (!validation.isValid) {
          return Promise.reject(new Error(validation.error));
        }
        return Promise.resolve();
      };

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
            {
              validator: customValidator,
            },
          ]}
          validateStatus={isTouched && fieldError ? "error" : ""}
          help={isTouched && fieldError ? fieldError : ""}
          tooltip={field.desc}
        >
          {fieldConfig.inputType === "date" ? (
            <DatePicker
              style={{ width: "100%" }}
              placeholder={`Select ${field.title}`}
              format="YYYY-MM-DD"
              value={currentValue ? dayjs(currentValue) : undefined}
              onChange={date =>
                handleFieldValueChange(field.name, date, fieldConfig)
              }
            />
          ) : fieldConfig.inputType === "number" ? (
            <Input
              {...inputProps}
              placeholder={`Enter ${field.title}`}
              value={currentValue || ""}
              onChange={e =>
                handleFieldValueChange(field.name, e.target.value, fieldConfig)
              }
              onBlur={e => {
                // Additional validation on blur for better UX
                const validation = validateFieldValue(
                  e.target.value,
                  fieldConfig,
                  field.name
                );
                if (!validation.isValid) {
                  handleFieldValueChange(
                    field.name,
                    e.target.value,
                    fieldConfig
                  );
                }
              }}
            />
          ) : (
            <Input
              {...inputProps}
              placeholder={`Enter ${field.title}`}
              value={currentValue || ""}
              onChange={e =>
                handleFieldValueChange(field.name, e.target.value, fieldConfig)
              }
            />
          )}
        </Form.Item>
      );
    },
    [
      getFieldConfig,
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
    <Form
      layout="vertical"
      onFinish={handleFormSubmit}
      disabled={isLoading}
      key={category} // Force form re-render when category changes
    >
      {visibleFields.map(renderField)}
    </Form>
  );
};

export default FormRenderer;
