"use client";

import React, { useCallback } from "react";
import { Card, Button, message } from "antd";
import { PlayCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { EmissionDataField } from "../../types";
import { useFormManager } from "../../hooks/useFormManager";
import FormRenderer from "./FormRenderer";

interface UnifiedFormHandlerV2Props {
  fields: EmissionDataField[];
  onExecute: (values: Record<string, string>) => void;
  onFieldChange?: (
    fieldName: string,
    value: any,
    allValues: Record<string, any>
  ) => void;
  isLoading: boolean;
  category: string;
  initialValues?: Record<string, any>;
}

const UnifiedFormHandlerV2: React.FC<UnifiedFormHandlerV2Props> = ({
  fields,
  onExecute,
  onFieldChange,
  isLoading,
  category,
  initialValues = {},
}) => {
  const {
    handleFormSubmit,
    clearForm,
    getFormData,
    isFormValid,
    isSubmitting,
    error,
  } = useFormManager({
    category,
    onFormSubmit: onExecute,
    onFieldChange: (fieldName, value) => {
      if (onFieldChange) {
        const allValues = getFormData();
        onFieldChange(fieldName, value, allValues);
      }
    },
  });

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!isFormValid()) {
      message.error("Please fix all validation errors before submitting");
      return;
    }

    try {
      const formData = getFormData();
      await handleFormSubmit(formData);
    } catch (error) {
      console.error("Form submission failed:", error);
      message.error("Failed to submit form");
    }
  }, [handleFormSubmit, isFormValid, getFormData]);

  // Handle form clearing
  const handleClear = useCallback(() => {
    clearForm();
    message.info("Form cleared");
  }, [clearForm]);

  return (
    <Card
      className="categoryFormWrapper"
      style={{ overflowY: "auto", height: "80vh" }}
    >
      {error && <div style={{ marginBottom: 16, color: "red" }}>{error}</div>}

      <FormRenderer
        fields={fields}
        onExecute={onExecute}
        isLoading={isLoading || isSubmitting}
        category={category}
      />

      <div className="execute-button-container" style={{ marginTop: 24 }}>
        <Button
          type="primary"
          size="large"
          icon={
            isLoading || isSubmitting ? (
              <LoadingOutlined />
            ) : (
              <PlayCircleOutlined />
            )
          }
          onClick={handleSubmit}
          loading={isLoading || isSubmitting}
          className="execute-query-button"
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? "Executing..." : "Execute Query"}
        </Button>

        <Button
          style={{ marginLeft: 8 }}
          onClick={handleClear}
          disabled={isLoading || isSubmitting}
        >
          Clear Form
        </Button>
      </div>
    </Card>
  );
};

export default UnifiedFormHandlerV2;
