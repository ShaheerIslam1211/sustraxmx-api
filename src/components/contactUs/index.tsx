"use client";

import React, { useState } from "react";
import { Row, Col, message, Input, Button } from "antd";
import { Helmet } from "react-helmet";
import texts from "../../mockData/texts";
import "./index.css";
import { useResponsive } from "../../customHooks/responsive";
import { addContactMessage } from "../../lib/firebase/contactMessage.firebase";
import { CustomInput } from "../common/formInputs";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface ContactInput {
  label: string;
  placeholder: string;
  name: keyof FormData;
}

const ContactUs: React.FC = () => {
  const { isMobile } = useResponsive();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      message.error("Please fill all fields");
      return;
    }

    try {
      const result = await addContactMessage(
        formData.name,
        formData.email,
        formData.message
      );
      if (result) {
        message.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        message.error("Failed to send message");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      message.error(
        error.message || "Failed to send message. Please try again."
      );
    }
  };

  const contactInputs: ContactInput[] = [
    {
      label: "Username",
      placeholder: "username...",
      name: "name",
    },
    {
      label: "Email",
      placeholder: "email...",
      name: "email",
    },
  ];

  const { TextArea } = Input;

  return (
    <main style={{ padding: isMobile ? "0px" : "50px", width: "100%" }}>
      <Helmet>
        <title>Contact Us - SustraxAPI</title>
        <meta
          name="description"
          content="Contact SustraxAPI with any inquiries, feedback, or support requests you have. Our team is ready to assist you."
        />
      </Helmet>
      <Row justify="start" align="top" gutter={[50, 50]}>
        <Col xs={24} sm={24} md={14} lg={14} xl={14}>
          <section className="contactMainContainer">
            <header className="contactFormTitle">
              {texts.contactUs.contactForm.title}
            </header>
            <p className="contactFormDescription">
              {texts.contactUs.contactForm.description}
            </p>

            <form className="contactFormContainer" onSubmit={handleSubmit}>
              <div className="inputWrapper">
                {contactInputs.map((inpt, index) => (
                  <div key={index}>
                    <label className="inputLabels">{inpt.label}</label>
                    <input
                      className="input"
                      name={inpt.name}
                      value={formData[inpt.name]}
                      onChange={handleChange}
                      placeholder={inpt.placeholder}
                      style={{
                        width: "100%",
                        maxWidth: "600px",
                        margin: "10px 0px",
                        height: "30px",
                        padding: "0 15px",
                        border: "1px solid var(--border-color)",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        outline: "none",
                        fontSize: "16px",
                        color: "var(--text-color)",
                        backgroundColor: "var(--card-background)",
                        transition: "all 0.3s ease-in-out",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="messageWrapper">
                <div>
                  <label className="inputLabels">Message</label>
                  <TextArea
                    className="contactFormTextArea"
                    rows={10}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                  />
                </div>
              </div>
              <Button className="sendBtn" type="primary" htmlType="submit">
                {texts.contactUs.contactForm.btn}
              </Button>
            </form>
          </section>
        </Col>

        <Col xs={24} sm={24} md={10} lg={10} xl={10}>
          <section>
            <header>
              <h2>{texts.contactUs.AddressBox.title}</h2>
            </header>
            <div className="addressBoxLists">
              {texts.contactUs.AddressBox.listItems.map(
                (listItm: string, index: number) => (
                  <ul key={index} className="addressLists">
                    <li className="addressList">{listItm}</li>
                  </ul>
                )
              )}
            </div>
          </section>
        </Col>
      </Row>
    </main>
  );
};

export default ContactUs;
