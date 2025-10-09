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

          <div style={{ marginTop: "20px" }}>
            <p
              style={{
                fontSize: styles.fontSize.smallFont,
                color: "var(--text-secondary)",
              }}
            >
              {texts.AuthorizationBlock.urlText}
            </p>
            <CustomInput readOnly={true} value={displayUrl} />
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
