"use client";

import React, { useCallback, useEffect } from "react";
import { Card, Select, Spin, Alert, Typography, Button, message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useFormManager } from "../../hooks/useFormManager";
import UnifiedFormHandlerV2 from "./UnifiedFormHandlerV2";

const { Title } = Typography;
const { Option } = Select;

interface DynamicFormV2Props {
  categoryKey?: string;
  showCategorySelector?: boolean;
}

const DynamicFormV2: React.FC<DynamicFormV2Props> = ({
  categoryKey,
  showCategorySelector = true,
}) => {
  const {
    currentCategory,
    isLoading,
    error,
    emissionData,
    getCurrentFields,
    getAvailableCategories,
    handleFieldChange,
    clearForm,
  } = useFormManager({
    category: categoryKey,
    onFieldChange: (fieldName, value) => {
      console.log(`Field ${fieldName} changed to:`, value);
    },
  });

  // Set initial category if provided
  useEffect(() => {
    if (categoryKey && categoryKey !== currentCategory) {
      // Category will be set automatically by useFormManager
    }
  }, [categoryKey, currentCategory]);

  const handleCategoryChange = useCallback(
    (category: string) => {
      // Category change is handled by useFormManager
      clearForm();
    },
    [clearForm]
  );

  const handleExecute = useCallback((values: Record<string, string>) => {
    console.log("Form submitted with values:", values);
    message.success("Form submitted successfully!");
    // This would typically call an API or perform some action
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      // Refresh logic would be handled by the form service
      message.success("Form configuration refreshed successfully");
    } catch (err) {
      message.error("Failed to refresh form configuration");
    }
  }, []);

  const handleClearForm = useCallback(() => {
    clearForm();
    message.info("Form cleared");
  }, [clearForm]);

  if (isLoading) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>Loading form data...</div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Alert
          message="Error Loading Form"
          description={error}
          type="error"
          showIcon
          action={
            <Button
              size="small"
              onClick={handleRefresh}
              icon={<ReloadOutlined />}
            >
              Retry
            </Button>
          }
        />
      </Card>
    );
  }

  if (!emissionData) {
    return (
      <Card>
        <Alert
          message="No Data Available"
          description="No form data is available at this time."
          type="warning"
          showIcon
          action={
            <Button
              size="small"
              onClick={handleRefresh}
              icon={<ReloadOutlined />}
            >
              Refresh
            </Button>
          }
        />
      </Card>
    );
  }

  const categories = getAvailableCategories();
  const selectedCategory = categoryKey || currentCategory;
  const fields = getCurrentFields();

  return (
    <div>
      {showCategorySelector && (
        <Card
          style={{ marginBottom: "16px" }}
          extra={
            <div style={{ display: "flex", gap: "8px" }}>
              <Button size="small" onClick={handleClearForm}>
                Clear
              </Button>
              <Button
                size="small"
                onClick={handleRefresh}
                icon={<ReloadOutlined />}
              >
                Refresh
              </Button>
            </div>
          }
        >
          <Title level={4}>Select Category</Title>
          <Select
            style={{ width: "100%" }}
            placeholder="Select a category"
            value={currentCategory}
            onChange={handleCategoryChange}
          >
            {categories.map(category => (
              <Option key={category} value={category}>
                {emissionData[category]?.title || category}
              </Option>
            ))}
          </Select>
        </Card>
      )}

      {currentCategory && fields.length > 0 && (
        <UnifiedFormHandlerV2
          fields={fields}
          onExecute={handleExecute}
          onFieldChange={handleFieldChange}
          isLoading={false}
          category={currentCategory}
        />
      )}

      {currentCategory && fields.length === 0 && (
        <Card>
          <Alert
            message="No Fields Available"
            description={`No form fields are available for the ${currentCategory} category.`}
            type="info"
            showIcon
          />
        </Card>
      )}
    </div>
  );
};

export default DynamicFormV2;
