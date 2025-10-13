import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Typography, Card, Space, Tag } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { LanguageSelector as LanguageCodeBlock } from "../languageSelector";
// import { useApiData } from "../../context/ApiDataContext";
import {
  UserAuthInputs,
  SingleInput,
  CustomInput,
} from "../common/formInputs/formInput";
import "./authorizationBlock.css";
import { useAuth } from "../../context/AuthContext";
import texts from "../../mockData/texts";
import { API_CONFIG, getDisplayUrl } from "../../lib/constants";
import { useEmissionData } from "../../context/EmissionDataContext";
import styles from "../../styles/contants.json";
import { CodeSnippets } from "../../code_helper/code_helpers";

const { Text, Title } = Typography;

interface Credentials {
  username: string;
  password: string;
}

interface AuthorizationBlockProps {
  snippets: CodeSnippets;
  inputValues: Record<string, any>;
  updateCredentials: (credentials: Credentials) => void;
  apiResponse?: any;
  isLoading?: boolean;
}

const AuthorizationBlock: React.FC<AuthorizationBlockProps> = ({
  snippets,
  inputValues,
  updateCredentials,
  apiResponse,
  isLoading,
}) => {
  const { emissionData } = useEmissionData();
  const { user, userDoc } = useAuth();

  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  // Get the display URL for the current category
  const displayUrl = name ? API_CONFIG.getDisplayUrl(name) : "";

  // Render user information section
  const renderUserInfo = () => {
    console.log("Auth Debug - user:", user);
    console.log("Auth Debug - userDoc:", userDoc);

    if (user) {
      return (
        <Card
          size="small"
          style={{
            marginBottom: "16px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <UserOutlined style={{ color: "var(--text-primary)" }} />
              <Text strong style={{ color: "var(--text-primary)" }}>
                Authenticated User
              </Text>
            </div>
            <div style={{ paddingLeft: "24px" }}>
              <Text
                style={{ fontSize: "12px", color: "var(--text-secondary)" }}
              >
                <strong>UID:</strong> {user.uid}
              </Text>
              <br />
              {/* <Text
                style={{ fontSize: "12px", color: "var(--text-secondary)" }}
              >
                <strong>Name:</strong>{" "}
                {user ? `${user.displayName}` : "Username not found"}
              </Text>
              <br /> */}
              <Text
                style={{ fontSize: "12px", color: "var(--text-secondary)" }}
              >
                <strong>Email:</strong> {user.email}
              </Text>
              {!user && !userDoc && (
                <>
                  <br />
                  <Text
                    style={{ fontSize: "11px", color: "var(--text-warning)" }}
                  >
                    Note: User profile not found in database
                  </Text>
                </>
              )}
            </div>
          </Space>
        </Card>
      );
    } else {
      return (
        <Card
          size="small"
          style={{
            marginBottom: "16px",
            background: "var(--bg-warning)",
            border: "1px solid var(--border-warning)",
          }}
        >
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <KeyOutlined style={{ color: "var(--text-warning)" }} />
              <Text strong style={{ color: "var(--text-warning)" }}>
                Authentication Required
              </Text>
            </div>
            <Text style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Please log in to access the API with your credentials. You can
              test the API endpoints, but for production use, authentication is
              recommended for better security and rate limiting.
            </Text>
            <Tag color="orange" style={{ fontSize: "11px" }}>
              Demo Mode - Limited Access
            </Tag>
          </Space>
        </Card>
      );
    }
  };

  return (
    console.log(emissionData.title),
    (
      <section className="authorization-container">
        <header className="authorization-header">
          <p
            style={{
              fontSize: styles.fontSize.smallFont,
              color: "var(--text-secondary)",
            }}
          >
            {texts.AuthorizationBlock.AuthorizationText}
          </p>

          {/* User Information Section */}
          {renderUserInfo()}

          <UserAuthInputs updateCredentials={updateCredentials} />

          <div
            className="base-url-block"
            style={{
              marginTop: "24px",
              padding: "20px",
              background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--primary-color)",
                  boxShadow: "0 0 8px rgba(52, 211, 153, 0.5)",
                }}
              />
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {texts.AuthorizationBlock.urlText}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary-color), #10b981)",
                  color: "white",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  minWidth: "60px",
                  textAlign: "center",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "44px",
                  boxShadow: "0 2px 4px rgba(52, 211, 153, 0.3)",
                  border: "2px solid transparent",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.3)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(52, 211, 153, 0.4)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(52, 211, 153, 0.3)";
                }}
              >
                POST
              </span>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <CustomInput readOnly={true} value={displayUrl} />
              </div>
            </div>
          </div>
        </header>

        <LanguageCodeBlock
          inputValues={{ params: inputValues }}
          snippets={snippets}
          apiResponse={apiResponse}
          isLoading={isLoading}
        />
      </section>
    )
  );
};

export default AuthorizationBlock;
