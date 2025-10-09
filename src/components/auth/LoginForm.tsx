"use client";

import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Typography,
  message,
  Modal,
} from "antd";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useIsMobile } from "../../hooks/useIsMobile";
import { SSO } from "./SSO/sso";
import { sendPasswordResetEmail } from "../../lib/firebase/auth.register.enhanced";
import { redirect } from "next/navigation";

const { Title, Text, Link } = Typography;

interface LoginFormProps {
  onModeChange: (
    mode: "login" | "signup" | "complete-registration" | "auth-code"
  ) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onModeChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, userDoc } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await login(email.toLowerCase(), password);
      router.push("/");
    } catch (error: any) {
      message.error("Error logging in. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Modal.confirm({
      title: "Reset Password",
      content: (
        <div>
          <p>Please enter your email.</p>
          <Input id="password-reset" placeholder="someone@example.com" />
        </div>
      ),
      onOk: async () => {
        try {
          const email = (
            document.getElementById("password-reset") as HTMLInputElement
          )?.value;
          if (!email) {
            message.error("Please enter an email address");
            return;
          }
          await sendPasswordResetEmail(email);
          message.success(`A password reset email has been sent to ${email}`);
        } catch (err: any) {
          message.error(
            "Unable to send password reset email. Please try again."
          );
          console.error("Password reset error:", err);
        }
      },
      okText: "Send Reset Link",
    });
  };

  return (
    <div className="auth-form-wrapper">
      {isMobile && (
        <div className="login-logo">
          <img
            src="/images/loading.gif"
            alt="Sustrax-Api Logo"
            width="55"
            height="auto"
          />
        </div>
      )}

      <Title level={2} className="auth-title">
        Welcome back!
      </Title>

      <Text className="auth-subtitle">
        Enter your credentials to access your account
      </Text>

      <Form
        name="login-form"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
        // className="auth-form"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="auth-input rectangular"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="auth-input rectangular"
          />
        </Form.Item>

        <div className="auth-form-footer">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Link onClick={handleForgotPassword}>Forgot Password?</Link>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="auth-button rectangular"
            loading={loading}
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      <SSO />

      <Text className="signup-link">
        Don't have an account?{" "}
        <Link underline strong onClick={() => redirect("/auth?type=register")}>
          Sign up now
        </Link>
      </Text>
    </div>
  );
};

export default LoginForm;
