"use client";

import React, { useState } from "react";
import { Button, Form, Input, Typography, message, Modal } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

const { Text } = Typography;

interface AuthCodeFormProps {
  onModeChange: (
    mode: "login" | "signup" | "complete-registration" | "auth-code"
  ) => void;
}

const AuthCodeForm: React.FC<AuthCodeFormProps> = ({ onModeChange }) => {
  const [authCode, setAuthCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { userDoc } = useAuth();
  const router = useRouter();

  const handleSubmit = async (values: { authCode: string }) => {
    try {
      setLoading(true);

      // Here you would typically make an API call to verify the auth code
      // For now, we'll simulate the process
      console.log("Verifying auth code:", values.authCode);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success("Authentication code verified successfully!");
      router.push("/");
    } catch (error: any) {
      message.error("Invalid authentication code. Please try again.");
      console.error("Auth code verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    onModeChange("login");
  };

  const handleDidntGetEmail = () => {
    Modal.info({
      title: "Cannot Login?",
      content: (
        <>
          Please click the back button and relogin. A code will be sent to you
          again. If you still cannot access it please mail to{" "}
          <a href="mailto:sustrax@carbonfootprint.com?subject=&body=">
            <b>sustrax@carbonfootprint.com</b>
          </a>
        </>
      ),
    });
  };

  return (
    <Form
      name="auth-code-form"
      style={{ padding: "20px" }}
      onFinish={handleSubmit}
      layout="vertical"
      size="large"
    >
      <Button
        className="small-back-link"
        style={{ marginBottom: 20 }}
        type="text"
        size="small"
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        loading={loading}
      >
        Back
      </Button>

      <Form.Item
        name="authCode"
        rules={[
          { required: true, message: "Please input your Authentication Code!" },
        ]}
      >
        <Input
          value={authCode}
          onChange={e => setAuthCode(e.target.value)}
          type="number"
          placeholder="Authentication Code"
          className="auth-input"
        />
      </Form.Item>

      <Form.Item style={{ display: "flex", justifyContent: "right" }}>
        <div
          style={{
            color: "#0A8FDC",
            cursor: "pointer",
            width: "fit-content",
          }}
          onClick={handleDidntGetEmail}
        >
          Didn't get an email?
        </div>
      </Form.Item>

      <Form.Item>
        <Button
          loading={loading}
          type="primary"
          htmlType="submit"
          className="auth-button"
        >
          CONFIRM
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AuthCodeForm;
