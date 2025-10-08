"use client";

import React, { useState, useEffect } from "react";
import { Row, Col, Button, Input } from "antd";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/antdSpin";
import { useResponsive } from "../../customHooks/responsive";
import "./index.css";
import { Helmet } from "react-helmet";
import texts from "../../mockData/texts";
import { CustomInput } from "../common/formInputs";
import CustomTabs from "../common/customTabs/CustomTab";

interface TabData {
  key: string;
  label: string;
  content: React.ReactNode;
}

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("user");
  const [firstName, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isFormEdited, setIsFormEdited] = useState<boolean>(false);
  const { isMobile: _isMobile } = useResponsive();

  useEffect(() => {
    if (user) {
      setFirstName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === "firstName") {
      setFirstName(value);
    } else if (name === "email") {
      setEmail(value);
    }
    setIsFormEdited(true);
  };

  if (!user) {
    return <Loader />;
  }

  const tabsData: TabData[] = [
    {
      key: "user",
      label: "User",
      content: (
        <section>
          <div className="profile-input">
            <div style={{ paddingBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h4 id="responsive">{texts.profile.userName.nameTitle}</h4>
                <CustomInput
                  value={firstName}
                  onChange={onInputChange}
                  placeholder="First Name"
                  addonBefore=""
                />
              </div>
              <p>{texts.profile.userName.exampleName}</p>
            </div>
            <div>
              <div
                className="email"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h4 id="responsive">{texts.profile.userEmail.emailTitle}</h4>
                <CustomInput
                  value={email}
                  onChange={onInputChange}
                  placeholder="Email"
                  addonBefore=""
                />
              </div>
              <p>{texts.profile.userEmail.exampleEmail}</p>
            </div>
          </div>
          <footer>
            <Button
              style={{ marginTop: "20px" }}
              type="primary"
              disabled={!isFormEdited}
            >
              {texts.profile.updateBtnTxt}
            </Button>
          </footer>
        </section>
      ),
    },
    {
      key: "password",
      label: "Password",
      content: (
        <section>
          <div className="password-input">
            <div style={{ paddingBottom: "20px" }}>
              <h4 id="responsive">{texts.profile.newPassword}</h4>
              <Input.Password style={{ width: "400px" }} />
            </div>
            <div>
              <h4 id="responsive">{texts.profile.confirmNewPassword}</h4>
              <Input.Password style={{ width: "400px" }} />
            </div>
          </div>
          <footer>
            <Button style={{ marginTop: "20px" }} type="primary">
              {texts.profile.updateBtnTxt}
            </Button>
          </footer>
        </section>
      ),
    },
  ];

  return (
    <article className="profileMainContainer">
      <Helmet>
        <title>Profile - {firstName || "User"}</title>
        <meta
          name="description"
          content={`View and edit profile for ${
            firstName || "user"
          }. Update your details like name, email, and password.`}
        />
      </Helmet>
      <Row>
        <Col xs={24} md={18}>
          <header>
            <h1 className="profile-title">{texts.profile.profileTitle}</h1>
          </header>
          <CustomTabs
            activeKey={activeTab}
            onChange={setActiveTab}
            tabsData={tabsData}
          />
        </Col>
      </Row>
    </article>
  );
};

export default UserProfile;
