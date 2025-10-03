'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Row, Col, message, Button } from "antd";
import img1 from "../../../assets/undraw_file_sync_ot38.svg";
import loginUser from "../../../firebase/auth.login";
import texts from "../../../mockData/texts";
import "./index.css";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!email || !password) {
      message.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await loginUser(email, password);
      router.push("/");
      message.success("Login is successful");
    } catch (error: any) {
      console.error("Login error:", error);
      message.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-container">
      <Row
        className="loginMainRow"
        align="middle"
        justify="center"
        gutter={[16, 16]}
      >
        <Col xs={24} md={24} xl={12} className="formContainer">
          <section>
            <header className="loginTextContainer">
              <h1 className="loginText">
                LogIn to <span className="loginSustraxApiTxt">SustraxAPI</span>
              </h1>
              <span className="loginDescription">
                {texts.login.loginDescription}
              </span>
            </header>
            <form className="formInputs" onSubmit={handleSubmit}>
              <input
                aria-label="Email"
                placeholder="email..."
                type="email"
                className="formInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                aria-label="Password"
                placeholder="password..."
                type="password"
                className="formInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button 
                className="loginBtn" 
                type="primary" 
                onClick={handleSubmit}
                loading={loading}
              >
                {loading ? "Logging in..." : "LogIn"}
              </Button>
            </form>
            <div className="registerLink">
              <Link className="linkText" href="/register">
                {texts.login.linkTxt}
              </Link>
            </div>
          </section>
        </Col>
        <Col xs={24} md={24} xl={12} className="image-column">
          <figure>
            <img src={img1} alt="Login Visual" className="login-image" />
          </figure>
        </Col>
      </Row>
    </main>
  );
};

export default Login;