/**
 * Example component demonstrating the new field type system
 * Shows how different field types are handled with proper validation
 */

import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Alert,
  Card,
  Typography,
  Space,
} from "antd";
import {
  getFieldTypeConfig,
  validateFieldValue,
  getInputProps,
} from "../../lib/fieldTypes";
import dayjs from "dayjs";
import { parseDDMMYYYY } from "../../utils/formatting";

const { Title, Text } = Typography;

interface ExampleField {
  name: string;
  title: string;
  value: any;
  error?: string;
}

const FieldTypeExample: React.FC = () => {
  const [fields, setFields] = useState<ExampleField[]>([
    { name: "Distance in km", title: "Distance in km", value: "" },
    { name: "Number of Passengers", title: "Number of Passengers", value: "" },
    { name: "Amount in kg", title: "Amount in kg", value: "" },
    { name: "Hours per Day Worked", title: "Hours per Day Worked", value: "" },
    { name: "Amount $", title: "Amount $", value: "" },
    { name: "Company Name", title: "Company Name", value: "" },
    { name: "Email Address", title: "Email Address", value: "" },
    { name: "Phone Number", title: "Phone Number", value: "" },
    { name: "Website URL", title: "Website URL", value: "" },
    { name: "Start Date", title: "Start Date", value: "" },
  ]);

  const [validationResults, setValidationResults] = useState<
    Record<string, string>
  >({});

  const handleFieldChange = (fieldName: string, value: any) => {
    setFields(prev =>
      prev.map(field =>
        field.name === fieldName ? { ...field, value } : field
      )
    );

    // Validate the field
    const field = fields.find(f => f.name === fieldName);
    if (field) {
      const config = getFieldTypeConfig(fieldName, field.title);
      const validation = validateFieldValue(value, config, fieldName);

      setValidationResults(prev => ({
        ...prev,
        [fieldName]: validation.isValid ? "" : validation.error || "",
      }));
    }
  };

  const validateAllFields = () => {
    const results: Record<string, string> = {};

    fields.forEach(field => {
      const config = getFieldTypeConfig(field.name, field.title);
      const validation = validateFieldValue(field.value, config, field.name);

      if (!validation.isValid) {
        results[field.name] = validation.error || "";
      }
    });

    setValidationResults(results);
  };

  const renderField = (field: ExampleField) => {
    const config = getFieldTypeConfig(field.name, field.title);
    const inputProps = getInputProps(config);
    const hasError = validationResults[field.name];

    return (
      <Form.Item
        key={field.name}
        label={field.title}
        validateStatus={hasError ? "error" : ""}
        help={hasError}
        extra={
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Type: {config.inputType} | Integer:{" "}
            {config.isInteger ? "Yes" : "No"} | Decimals:{" "}
            {config.allowDecimals ? "Yes" : "No"}
          </Text>
        }
      >
        {config.inputType === "date" ? (
          <DatePicker
            style={{ width: "100%" }}
            placeholder={`Select ${field.title}`}
            format="DD/MM/YYYY"
            value={
              field.value
                ? typeof field.value === "string"
                  ? dayjs(parseDDMMYYYY(field.value) || field.value)
                  : dayjs(field.value)
                : undefined
            }
            onChange={date =>
              handleFieldChange(field.name, date?.format("DD/MM/YYYY"))
            }
          />
        ) : (
          <Input
            {...inputProps}
            placeholder={`Enter ${field.title}`}
            value={field.value || ""}
            onChange={e => handleFieldChange(field.name, e.target.value)}
          />
        )}
      </Form.Item>
    );
  };

  const getFieldTypeSummary = () => {
    const summary = fields.reduce(
      (acc, field) => {
        const config = getFieldTypeConfig(field.name, field.title);
        const type = config.inputType;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(summary).map(([type, count]) => (
      <Text key={type}>
        <strong>{type}:</strong> {count} field{count !== 1 ? "s" : ""}
      </Text>
    ));
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Title level={2}>Field Type System Demo</Title>

      <Alert
        message="Field Type Detection System"
        description="This demo shows how the system automatically detects field types and applies appropriate validation. Integer fields (like Distance, Passengers) only accept whole numbers, while other fields have their own validation rules."
        type="info"
        showIcon
        style={{ marginBottom: "24px" }}
      />

      <Card title="Field Type Summary" style={{ marginBottom: "24px" }}>
        <Space direction="vertical">{getFieldTypeSummary()}</Space>
      </Card>

      <Card title="Form Fields">
        <Form layout="vertical">
          {fields.map(renderField)}

          <Form.Item>
            <Space>
              <Button type="primary" onClick={validateAllFields}>
                Validate All Fields
              </Button>
              <Button
                onClick={() => {
                  setFields(prev =>
                    prev.map(field => ({ ...field, value: "" }))
                  );
                  setValidationResults({});
                }}
              >
                Clear All
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Test Cases" style={{ marginTop: "24px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>Try these test values:</Text>

          <div>
            <Text strong>Integer Fields (should reject decimals):</Text>
            <ul>
              <li>Distance in km: Try "100.5" (should show error)</li>
              <li>Number of Passengers: Try "25.0" (should show error)</li>
              <li>Amount in kg: Try "fifty" (should show error)</li>
            </ul>
          </div>

          <div>
            <Text strong>Decimal Fields (should accept decimals):</Text>
            <ul>
              <li>Amount $: Try "99.99" (should be valid)</li>
            </ul>
          </div>

          <div>
            <Text strong>Email Field:</Text>
            <ul>
              <li>Email Address: Try "invalid-email" (should show error)</li>
              <li>Email Address: Try "user@example.com" (should be valid)</li>
            </ul>
          </div>

          <div>
            <Text strong>Date Field:</Text>
            <ul>
              <li>Start Date: Select any date (should be valid)</li>
            </ul>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default FieldTypeExample;
