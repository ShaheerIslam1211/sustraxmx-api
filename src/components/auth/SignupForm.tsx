"use client";

import React, { useState } from "react";
import { Button, Form, Input, Select, Typography, message } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useIsMobile } from "../../hooks/useIsMobile";
import { getCountries } from "../../lib/countries";
import { SSO } from "./SSO/sso";
import { signInNewUser } from "../../lib/firebase/auth.register.enhanced";
import { redirect } from "next/navigation";

const { Title, Text, Link } = Typography;

interface SignupFormProps {
  onModeChange: (
    mode: "login" | "signup" | "complete-registration" | "auth-code"
  ) => void;
}

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  companyName: string;
  country: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ onModeChange }) => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleSubmit = async (values: SignupFormData) => {
    try {
      setLoading(true);

      // Register the user
      await signInNewUser(
        {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email.toLowerCase(),
          password: values.password,
          phone: values.phone,
        },
        values.companyName,
        values.country
      );

      // Auto-login after successful registration
      await login(values.email.toLowerCase(), values.password);

      message.success("Account created successfully!");
      router.push("/");
    } catch (error: any) {
      message.error("Error creating account. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-wrapper">
      {isMobile && (
        <div className="login-logo">
          <img
            src="/images/logo.svg"
            alt="Sustrax-Api Logo"
            width="55"
            height="auto"
          />
        </div>
      )}

      <Title level={2} className="auth-title">
        Create your account
      </Title>

      <Text className="auth-subtitle">
        Join Sustraxmx-Api to start managing your organization's environmental
        impact
      </Text>

      <Form
        name="registration-form"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
        // className="auth-form"
      >
        <div className="form-section">
          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[
              { required: true, message: "Please input your Company Name!" },
            ]}
          >
            <Input placeholder="Enter company name" className="auth-input" />
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please select your Country!" }]}
          >
            <Select
              showSearch
              placeholder="Select your country"
              className="auth-input"
            >
              {getCountries().map(country => (
                <Select.Option key={country} value={country}>
                  {country}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="name-fields">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please input your First Name!" },
              ]}
            >
              <Input placeholder="Enter first name" className="auth-input" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: "Please input your Last Name!" },
              ]}
            >
              <Input placeholder="Enter last name" className="auth-input" />
            </Form.Item>
          </div>

          <Form.Item label="Phone Number" name="phone">
            <Input placeholder="Enter phone number" className="auth-input" />
          </Form.Item>

          <Form.Item
            label="Business Email"
            name="email"
            rules={[
              { required: true, message: "Please input your Email!" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter business email" className="auth-input" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 8,
                message: "Password must be at least 8 characters long",
              },
            ]}
          >
            <Input.Password
              placeholder="Create password"
              className="auth-input"
            />
          </Form.Item>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="auth-button rectangular"
            loading={loading}
          >
            Create Account
          </Button>
        </Form.Item>

        <div className="auth-divider">
          <span>or sign up with</span>
        </div>

        <SSO />

        <Text>
          Already have an account?{" "}
          <Link underline strong onClick={() => redirect("/auth?type=login")}>
            Sign in instead
          </Link>
        </Text>
      </Form>
    </div>
  );
};

export default SignupForm;
