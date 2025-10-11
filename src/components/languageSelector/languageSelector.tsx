import React, { useState } from "react";
import {
  CopyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CodeOutlined,
  DownOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  Card,
  Alert,
  Space,
  Typography,
  Badge,
  Collapse,
  Select,
  Button,
} from "antd";
import "./languageSelector.css";
import { copyToClipboard, CodeSnippets } from "../../code_helper/code_helpers";
import {
  parseBackendError,
  formatErrorForDisplay,
} from "../../utils/errorParsing";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneLight as lightStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

const { Text } = Typography;
const { Option } = Select;

// Function to format values based on programming language
const formatValueForLanguage = (value: string, language: string): string => {
  if (!value) return '""';

  // For string values, add appropriate quotes based on language
  switch (language) {
    case "javascript":
    case "nodejs":
      return `"${value}"`;
    case "python":
      return `"${value}"`;
    case "php":
      return `"${value}"`;
    case "ruby":
      return `"${value}"`;
    case "go":
      return `"${value}"`;
    case "java":
      return `"${value}"`;
    case "csharp":
      return `"${value}"`;
    case "curl":
      return value; // cURL doesn't need quotes for most parameters
    default:
      return `"${value}"`;
  }
};

// Language mapping for syntax highlighter
const languageMap: Record<string, string> = {
  javascript: "javascript",
  nodejs: "javascript",
  python: "python",
  php: "php",
  ruby: "ruby",
  go: "go",
  java: "java",
  csharp: "csharp",
  curl: "bash",
};

// Language display names
const languageNames: Record<string, string> = {
  javascript: "JavaScript",
  nodejs: "Node.js",
  python: "Python",
  php: "PHP",
  ruby: "Ruby",
  go: "Go",
  java: "Java",
  csharp: "C#",
  curl: "cURL",
};

// Simplified theme configuration - only auto theme based on system preference

interface InputValues {
  params: Record<string, string>;
}

interface ValidationError {
  field: string;
  message: string;
}

interface ApiResponseData {
  error?: string;
  result?: unknown;
  success?: boolean;
  message?: string;
  validationErrors?: ValidationError[];
  status?: number;
  type?: string;
  rawResponse?: unknown;
  timestamp?: string | number;
  statusText?: string;
  endpoint?: string;
  parsedError?: {
    primaryMessage: string;
    specificError?: string;
    errorType?: string;
    suggestions?: string[];
  };
  formattedError?: {
    title: string;
    description: string;
    suggestions?: string[];
  };
  [key: string]: unknown;
}

interface LanguageSelectorProps {
  snippets: CodeSnippets;
  inputValues: InputValues;
  apiResponse?: ApiResponseData;
  isLoading?: boolean;
}

// API Response Display Component - Based on Dynamic API Tester Format
const ApiResponseDisplay: React.FC<{
  data: ApiResponseData;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const syntaxStyle = isDark ? vscDarkPlus : lightStyle;
  if (isLoading) {
    return (
      <Card
        title={
          <Space>
            <CodeOutlined />
            <Text strong>API Response</Text>
            <Badge status="processing" text="Loading..." />
          </Space>
        }
        className="response-card"
      >
        <Text>Calculating emissions...</Text>
      </Card>
    );
  }

  // Only show "No Data" if data is truly null/undefined/empty
  // Don't show "No Data" if there's actual API response data (even if it's an error)
  if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
    return (
      <Card
        title={
          <Space>
            <CodeOutlined />
            <Text strong>API Response</Text>
            <Badge status="default" text="No Data" />
          </Space>
        }
        className="response-card"
      >
        <Text type="secondary">
          Click "Execute Query" to see your emissions calculation results here
        </Text>
      </Card>
    );
  }

  // Determine if this is a success or error response
  const isSuccess =
    data.success === true ||
    (data.success !== false &&
      !data.error &&
      !data.status &&
      (data.data || data.result || data.calculation));

  const hasValidationErrors =
    data.validationErrors && data.validationErrors.length > 0;
  const responseMessage =
    data.message ||
    (isSuccess
      ? "Calculation completed successfully"
      : data.error || "An error occurred");

  // Extract detailed error information
  const isDetailedError =
    data.error && (data.status || data.type || data.rawResponse);
  const errorType = data.type || (data.status ? "API Error" : "Error");
  const statusCode = data.status;
  const timestamp = data.timestamp;

  // Parse error for better display if not already parsed
  const parsedError =
    data.parsedError || parseBackendError(data.message || data.error);
  const formattedError =
    data.formattedError || formatErrorForDisplay(parsedError);

  return (
    <Card
      title={
        <Space>
          <CodeOutlined />
          <Text strong>API Response</Text>
          <Badge
            status={isSuccess ? "success" : "error"}
            text={isSuccess ? "Success" : "Error"}
          />
          {statusCode && (
            <Badge
              status={statusCode >= 400 ? "error" : "default"}
              text={`${statusCode}`}
            />
          )}
          {timestamp && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {new Date(timestamp).toLocaleTimeString()}
            </Text>
          )}
        </Space>
      }
      className="response-card"
    >
      {isSuccess ? (
        <Alert
          message="Calculation Successful"
          description={responseMessage}
          type="success"
          icon={<CheckCircleOutlined />}
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : (
        <>
          <Alert
            message={
              formattedError.title ||
              (isDetailedError ? errorType : "Calculation Failed")
            }
            description={
              <div>
                <div>
                  {formattedError.description || responseMessage || data.error}
                </div>
                {parsedError.specificError && (
                  <div
                    style={{
                      fontSize: "13px",
                      marginTop: "8px",
                      padding: "8px",
                      backgroundColor: "#fff2f0",
                      border: "1px solid #ffccc7",
                      borderRadius: "4px",
                      color: "#cf1322",
                    }}
                  >
                    <strong>Specific Error:</strong> {parsedError.specificError}
                  </div>
                )}
                {statusCode && (
                  <div
                    style={{
                      fontSize: "12px",
                      marginTop: "4px",
                      color: "#666",
                    }}
                  >
                    HTTP Status: {statusCode}{" "}
                    {data.statusText && `(${data.statusText})`}
                  </div>
                )}
                {data.endpoint && (
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Endpoint: {data.endpoint}
                  </div>
                )}
              </div>
            }
            type="error"
            icon={<ExclamationCircleOutlined />}
            showIcon
            style={{ marginBottom: 16 }}
          />

          {/* Show suggestions if available */}
          {formattedError.suggestions &&
            formattedError.suggestions.length > 0 && (
              <Alert
                message="Suggestions to Fix This Error"
                description={
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {formattedError.suggestions.map((suggestion, index) => (
                      <li key={index} style={{ marginBottom: "4px" }}>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                }
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

          {/* Show backend raw response if available */}
          {data.rawResponse && (
            <Alert
              message="Backend Error Details"
              description={
                <div style={{ fontSize: "13px" }}>
                  <div>
                    <strong>Raw Backend Response:</strong>
                  </div>
                  <pre
                    style={{
                      background: "#f5f5f5",
                      padding: "8px",
                      borderRadius: "4px",
                      marginTop: "8px",
                      fontSize: "12px",
                      overflow: "auto",
                      maxHeight: "150px",
                    }}
                  >
                    {JSON.stringify(data.rawResponse, null, 2)}
                  </pre>
                </div>
              }
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
        </>
      )}

      {hasValidationErrors && (
        <Alert
          message="Validation Errors"
          description={
            <ul>
              {data.validationErrors?.map(
                (error: ValidationError, index: number) => (
                  <li key={index}>
                    {error.field}: {error.message}
                  </li>
                )
              )}
            </ul>
          }
          type="warning"
          style={{ marginBottom: 16 }}
        />
      )}

      <Collapse
        items={[
          {
            key: "1",
            label: "Raw Response Data",
            children: (
              <div style={{ position: "relative" }}>
                <SyntaxHighlighter
                  language="json"
                  style={syntaxStyle}
                  customStyle={{
                    margin: 0,
                    borderRadius: "8px",
                    fontSize: "13px",
                    maxHeight: "400px",
                    overflow: "auto",
                  }}
                  showLineNumbers={true}
                  wrapLines={true}
                >
                  {JSON.stringify(data, null, 2)}
                </SyntaxHighlighter>
                <CopyOutlined
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    fontSize: "16px",
                    padding: "4px",
                    backgroundColor: "var(--background-secondary)",
                    borderRadius: "4px",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(data, null, 2),
                      "Response copied to clipboard!"
                    )
                  }
                />
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  snippets,
  inputValues,
  apiResponse,
  isLoading,
}) => {
  const [activeLanguage, setActiveLanguage] = useState("javascript");
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Get the appropriate syntax highlighting style based on system theme
  const getSyntaxStyle = () => {
    return isDark ? vscDarkPlus : lightStyle;
  };

  const handleCopy = () => {
    const codeText =
      snippets[activeLanguage]?.replace(
        /\$\{([^}]+)\}/g,
        (_: string, match: string) => inputValues.params[match] || ""
      ) || "";

    copyToClipboard(codeText, "Code copied to clipboard!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const availableLanguages = Object.keys(snippets);

  return (
    <div className="language-selector-container">
      {/* Code Block with Integrated Header */}
      <div className="code-block-container">
        <div className="code-header">
          <div className="code-header-left">
            <div className="language-dropdown-container">
              <Text
                strong
                style={{
                  marginRight: 8,
                  color: isDark ? "#bfbfbf" : "#595959",
                }}
              >
                Language:
              </Text>
              <Select
                value={activeLanguage}
                onChange={setActiveLanguage}
                style={{ width: 140, marginRight: 16 }}
                suffixIcon={<DownOutlined />}
                size="small"
                className={isDark ? "select-dark" : "select-light"}
              >
                {availableLanguages.map(lang => (
                  <Option key={lang} value={lang}>
                    {languageNames[lang] ||
                      lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="code-header-right">
            {/* <Text strong className="code-language-label">
              {languageNames[activeLanguage] ||
                activeLanguage.charAt(0).toUpperCase() + activeLanguage.slice(1)}
            </Text> */}
            <Button
              type="text"
              icon={copied ? <CheckOutlined /> : <CopyOutlined />}
              onClick={handleCopy}
              className={`copy-button ${isDark ? "copy-button-dark" : "copy-button-light"}`}
              size="small"
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        <SyntaxHighlighter
          language={languageMap[activeLanguage] || activeLanguage}
          style={getSyntaxStyle()}
          className="code-block-content"
          showLineNumbers={true}
          wrapLines={true}
          customStyle={{
            margin: 0,
            borderRadius: "0 0 8px 8px",
            fontSize: "13px",
            lineHeight: "1.4",
            background: isDark ? "#1e1e1e" : "#ffffff",
            color: isDark ? "#d4d4d4" : "#24292e",
            fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
          }}
          codeTagProps={{
            style: {
              fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
              fontSize: "13px",
              lineHeight: "1.4",
            },
          }}
        >
          {snippets[activeLanguage]?.replace(
            /\$\{([^}]+)\}/g,
            (_: string, match: string) => {
              const value = inputValues.params[match] || "";
              // Format the value based on the programming language
              return formatValueForLanguage(value, activeLanguage);
            }
          ) || "// No code available for this language"}
        </SyntaxHighlighter>
      </div>

      {/* API Response Display Below Code */}
      <div className="api-response-section">
        <ApiResponseDisplay
          data={apiResponse || {}}
          isLoading={isLoading || false}
        />
      </div>
    </div>
  );
};

export default LanguageSelector;
