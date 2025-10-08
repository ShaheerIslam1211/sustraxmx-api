"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ConfigProvider, theme } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useIsIframed } from "../../hooks/useIsIframed";
import { useIsMobile } from "../../hooks/useIsMobile";
import {
  LoginForm,
  SignupForm,
  CompleteRegistrationForm,
  AuthCodeForm,
} from "../../components/auth";
import "./auth.css";
import { Logo } from "@/components/common/Logo/logo";

type AuthMode = "login" | "signup" | "complete-registration" | "auth-code";

const AuthPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userDoc } = useAuth();
  const isIframed = useIsIframed();
  const _isMobile = useIsMobile();

  const [mode, setMode] = useState<AuthMode>("login");
  const [_loading, _setLoading] = useState(false);

  useEffect(() => {
    const type = searchParams.get("type");
    const notFullyRegistered =
      searchParams.get("not-fully-registered") === "true";

    if (notFullyRegistered && user) {
      setMode("complete-registration");
    } else if (type === "register") {
      setMode("signup");
    } else if (type === "auth-code") {
      setMode("auth-code");
    } else {
      setMode("login");
    }

    // Redirect if user is already logged in and not in complete registration
    if (userDoc && mode === "login") {
      router.push("/");
    }
  }, [searchParams, user, userDoc, mode, router]);

  const renderAuthForm = () => {
    switch (mode) {
      case "login":
        return <LoginForm onModeChange={setMode} />;
      case "signup":
        return <SignupForm onModeChange={setMode} />;
      case "complete-registration":
        return <CompleteRegistrationForm onModeChange={setMode} />;
      case "auth-code":
        return <AuthCodeForm onModeChange={setMode} />;
      default:
        return <LoginForm onModeChange={setMode} />;
    }
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <div className={`auth-container ${isIframed ? "compact-mode" : ""}`}>
        <div className="auth-form">
          <div className="auth-form-inner">{renderAuthForm()}</div>
        </div>

        {!isIframed && (
          <div className="auth-content">
            <div className="auth-content-bg">
              <img
                src="https://demo.tailadmin.com/src/images/shape/grid-01.svg"
                className="bg-shape bg-shape-top"
                alt="Background decoration"
              />
              <img
                src="https://demo.tailadmin.com/src/images/shape/grid-01.svg"
                className="bg-shape bg-shape-bottom"
                alt="Background decoration"
              />
            </div>
            <div className="auth-content-inner">
              <div className="logo-container">
                <Logo className="auth-logo" />
                <span className="logo-text">Sustraxmx-Api</span>
              </div>
              <p className="auth-description">
                Integrate effortlessly with the Sustraxmx-Api to measure, manage
                and report your organisations environmental data and carbon
                emissions powered by a single, developer-friendly REST API.
              </p>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default AuthPage;
