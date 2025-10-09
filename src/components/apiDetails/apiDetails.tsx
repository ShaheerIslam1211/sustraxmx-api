"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useEmissionData } from "../../context/EmissionDataContext";
import { Row, Col, Card, Button, message } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import AuthorizationBlock from "../authorizationBlock/authorizationBlock";
import { generateCodeSnippets, CodeSnippets } from "../../js-helper/helpers";
import { API_CONFIG, getDisplayUrl } from "../../lib/constants";
import UnifiedFormHandlerV2 from "../forms/UnifiedFormHandlerV2";
import {
  parseBackendError,
  extractErrorDetails,
  formatErrorForDisplay,
} from "../../utils/errorParsing";
import "./apiDetails.css";

interface InputValues {
  params: Record<string, string>;
}

interface Credentials {
  username: string;
  password: string;
}

interface CategoryText {
  name: string;
  title: string;
  desc?: string;
  s_r?: boolean;
}

interface CategoryData {
  title: string;
  ins: string;
  texts: CategoryText[];
}

const ApiDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const { emissionData: emissionsData } = useEmissionData();
  const categoryData: CategoryData | undefined = name
    ? emissionsData[name]
    : undefined;
  const baseUrl = API_CONFIG.getDisplayUrl(name || "");

  const [inputValues, setInputValues] = useState<InputValues>({ params: {} });
  const [snippets, setSnippets] = useState<CodeSnippets>({
    python: "",
    javascript: "",
    curl: "",
  });
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Clear state when category changes (navigation refresh fix)
  useEffect(() => {
    setInputValues({ params: {} });
    setApiResponse(null);
    setIsLoading(false);
  }, [name]);

  const updateCredentials = (credentials: Credentials): void => {
    setCredentials(credentials);
    const newSnippets = generateCodeSnippets(
      baseUrl,
      inputValues.params,
      credentials
    );
    setSnippets(newSnippets);
  };

  const executeQuery = async (
    formData?: Record<string, string>
  ): Promise<void> => {
    if (!name) {
      message.error("No category selected");
      return;
    }

    // Use formData if provided (from DynamicFuelForm), otherwise use inputValues.params
    const dataToSend = formData || inputValues.params;

    // Check if required fields are filled
    const requiredFields =
      categoryData?.texts.filter(text => text.name && text.s_r !== false) || [];
    const missingFields = requiredFields.filter(
      field => !dataToSend[field.name]
    );

    if (missingFields.length > 0) {
      message.error(
        `Please fill in all required fields: ${missingFields.map(f => f.title).join(", ")}`
      );
      return;
    }

    setIsLoading(true);
    setApiResponse(null);

    try {
      // Show loading toast
      message.loading("Executing query...", 0);

      const response = await fetch(API_CONFIG.getCalculationUrl(name), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      // Destroy loading message
      message.destroy();

      if (response.ok) {
        setApiResponse(data);
        message.success("Query executed successfully!");
      } else {
        // Parse the backend error to extract specific error details
        const errorDetails = extractErrorDetails(data);
        const parsedError = parseBackendError(errorDetails.message);
        const formattedError = formatErrorForDisplay(parsedError);

        // Create detailed error response with parsed error information
        const detailedError = {
          error: true,
          status: response.status,
          statusText: response.statusText,
          message: errorDetails.message,
          parsedError,
          formattedError,
          rawResponse: data,
          timestamp: new Date().toISOString(),
          endpoint: API_CONFIG.getCalculationUrl(name),
          requestData: dataToSend,
        };

        setApiResponse(detailedError);

        // Show detailed error in toast with specific error information
        message.error({
          content: (
            <div>
              <div style={{ fontWeight: "bold" }}>{formattedError.title}</div>
              <div style={{ marginTop: "4px" }}>
                {formattedError.description}
              </div>
              {parsedError.specificError && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#ff4d4f",
                    marginTop: "4px",
                    fontWeight: "bold",
                  }}
                >
                  Specific Error: {parsedError.specificError}
                </div>
              )}
              <div
                style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}
              >
                Check API response details below for more information and
                suggestions
              </div>
            </div>
          ),
          duration: 8,
        });
      }
    } catch (error) {
      // Destroy loading message
      message.destroy();

      const errorMessage =
        error instanceof Error ? error.message : "Network error occurred";

      // Create detailed error response for network/parsing errors
      const detailedError = {
        error: true,
        type: "NetworkError",
        message: errorMessage,
        originalError:
          error instanceof Error ? error.toString() : String(error),
        timestamp: new Date().toISOString(),
        endpoint: API_CONFIG.getCalculationUrl(name),
        requestData: dataToSend,
      };

      setApiResponse(detailedError);

      // Show detailed network error in toast
      message.error({
        content: (
          <div>
            <div style={{ fontWeight: "bold" }}>Network Error</div>
            <div>{errorMessage}</div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
              Check API response details below for more information
            </div>
          </div>
        ),
        duration: 6,
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const newSnippets = generateCodeSnippets(
      baseUrl,
      inputValues.params,
      credentials
    );
    setSnippets(newSnippets);
  }, [inputValues, credentials, baseUrl]);

  const handleInputChange = (name: string, value: string): void => {
    setInputValues(prevState => {
      const params = { ...prevState.params };
      if (value === "") {
        delete params[name]; // Remove the key if the value is empty
      } else {
        params[name] = value; // Otherwise, update the key with the new value
      }
      return { params };
    });
  };

  // Handle field changes from unified form handler
  const handleFieldChange = (
    fieldName: string,
    value: any,
    allValues: Record<string, any>
  ): void => {
    console.log("handleFieldChange called:", { fieldName, value, allValues });

    // Handle clear all signal from form when category changes
    if (fieldName === "__clear_all__") {
      setInputValues({ params: {} });
      return;
    }

    // Update inputValues with the current form data
    // Convert all values to strings for the code snippets
    const stringValues: Record<string, string> = {};
    Object.entries(allValues).forEach(([key, val]) => {
      if (val !== null && val !== undefined && val !== "") {
        stringValues[key] = String(val);
      }
    });

    console.log("Setting inputValues.params to:", stringValues);
    setInputValues({ params: stringValues });
  };

  if (!categoryData) {
    return <h2>No data available for this category</h2>;
  }

  return (
    <div className="apiDetailsContainer">
      <Row gutter={16}>
        <Col className="categoryDetailsWrapper" xs={24} md={14} xxl={16}>
          <div className="categoryTitleContainer">
            <div className="category-title-icon">
              <EnvironmentOutlined
                style={{ fontSize: "22px", color: "var(--primary-color)" }}
              />
              <h1 className="categoryTitle">{categoryData.title}</h1>
            </div>
            <div className="titleBorder"></div>
          </div>

          <div className="categoryInstructions">
            <h4>Instructions</h4>
            <p className="inputDescription">{categoryData.ins}</p>
          </div>

          {/* Use unified form handler for all forms */}
          <UnifiedFormHandlerV2
            fields={categoryData.texts}
            onExecute={executeQuery}
            onFieldChange={handleFieldChange}
            isLoading={isLoading}
            category={name || ""}
            initialValues={inputValues.params}
          />
        </Col>
        <Col xs={24} md={10} xxl={8}>
          <AuthorizationBlock
            snippets={snippets}
            inputValues={inputValues}
            updateCredentials={updateCredentials}
            apiResponse={apiResponse}
            isLoading={isLoading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ApiDetails;
