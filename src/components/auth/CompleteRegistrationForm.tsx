"use client";

import React, { useState } from "react";
import { Button, Form, Input, Select, Typography, message } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { getCountries } from "../../lib/countries";
import { signInNewUser } from "../../lib/firebase/auth.register.enhanced";

const { Title, Text } = Typography;

interface CompleteRegistrationFormProps {
  onModeChange: (
    mode: "login" | "signup" | "complete-registration" | "auth-code"
  ) => void;
}

interface CompleteRegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName: string;
  country: string;
}

const CompleteRegistrationForm: React.FC<CompleteRegistrationFormProps> = ({
  onModeChange,
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (values: CompleteRegistrationFormData) => {
    try {
      setLoading(true);

      if (!user?.email) {
        message.error("No user email found. Please try logging in again.");
        return;
      }

      // Complete the registration
      await signInNewUser(
        {
          firstName: values.firstName,
          lastName: values.lastName,
          email: user.email,
          password: "NO_ACTUAL_NEED_123", // For SSO users
          phone: values.phone,
        },
        values.companyName,
        values.country,
        undefined, // affiliateId
        true // isSSORegistration
      );

      message.success("Registration completed successfully!");
      router.push("/");
    } catch (error: any) {
      message.error("Error completing registration. Please try again.");
      console.error("Complete registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    firstName: user?.displayName?.split(" ")[0] || "",
    lastName: user?.displayName?.split(" ")[1] || "",
    email: user?.email || "",
  };

  return (
    <div className="auth-form-wrapper">
      <Title level={2} className="auth-title">
        One last step!
      </Title>

      <Text className="auth-subtitle">
        Tell us about your company to personalize your experience
      </Text>

      <Form
        name="registration-form"
        initialValues={initialValues}
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
        className="auth-form"
      >
        <Title level={4} style={{ marginBottom: "20px" }}>
          Personal Information
        </Title>

        <div className="name-fields">
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please input your First Name!" },
            ]}
          >
            <Input disabled className="auth-input" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: "Please input your Last Name!" },
            ]}
          >
            <Input disabled className="auth-input" />
          </Form.Item>
        </div>

        <Form.Item label="Email" name="email">
          <Input disabled className="auth-input" />
        </Form.Item>

        <div className="auth-divider" style={{ margin: "32px 0 24px" }}>
          <span>Company Details</span>
        </div>

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

        <Form.Item label="Phone Number" name="phone">
          <Input placeholder="Enter phone number" className="auth-input" />
        </Form.Item>

        <Form.Item style={{ marginTop: "24px" }}>
          <Button
            type="primary"
            htmlType="submit"
            className="auth-button rectangular"
            loading={loading}
          >
            Complete Registration
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CompleteRegistrationForm;
