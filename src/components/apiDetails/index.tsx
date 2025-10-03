"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useEmissionData } from "../../context/EmissionDataContext";
import { Row, Col, Card } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import AuthorizationBlock from "../../components/authorizationBlock";
import { generateCodeSnippets, CodeSnippets } from "../../js-helper/helpers";
import { CustomInput } from "../common/formInputs/formInput";
import { DummyUrl } from "../../mockData/mockData";
import "./index.css";

interface InputValues {
  params: Record<string, string>;
}

interface Credentials {
  username: string;
  password: string;
}

interface CategoryText {
  name: string;
  title: string;
  desc?: string;
}

interface CategoryData {
  title: string;
  ins: string;
  texts: CategoryText[];
}

const ApiDetails: React.FC = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const { emissionData: emissionsData } = useEmissionData();
  const categoryData: CategoryData | undefined = name
    ? emissionsData[name]
    : undefined;
  const baseUrl = `${DummyUrl}${name}`;

  const [inputValues, setInputValues] = useState<InputValues>({ params: {} });
  const [snippets, setSnippets] = useState<CodeSnippets>({
    python: "",
    javascript: "",
    curl: "",
  });
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });

  const updateCredentials = (credentials: Credentials): void => {
    setCredentials(credentials);
  };

  useEffect(() => {
    const newSnippets = generateCodeSnippets(
      baseUrl,
      inputValues.params,
      credentials
    );
    setSnippets(newSnippets);
  }, [inputValues, credentials, baseUrl]);

  const handleInputChange = (name: string, value: string): void => {
    setInputValues(prevState => {
      let params = { ...prevState.params };
      if (value === "") {
        delete params[name]; // Remove the key if the value is empty
      } else {
        params[name] = value; // Otherwise, update the key with the new value
      }
      return { params };
    });
  };

  if (!categoryData) {
    return <h2>No data available for this category</h2>;
  }

  return (
    <div className="apiDetailsContainer">
      <Row gutter={16}>
        <Col className="categoryDetailsWrapper" xs={24} md={14} xxl={16}>
          <div className="categoryTitleContainer">
            <div className="category-title-icon">
              <EnvironmentOutlined
                style={{ fontSize: "22px", color: "#52c41a" }}
              />
              <h1 className="categoryTitle">{categoryData.title}</h1>
            </div>
            <div className="titleBorder"></div>
          </div>

          <div className="categoryInstructions">
            <h4>Instructions</h4>
            <p className="inputDescription">{categoryData.ins}</p>
          </div>

          <Card
            className="categoryFormWrapper"
            style={{ overflowY: "auto", height: "80vh" }}
          >
            {categoryData.texts.map(text => (
              <div key={text.name} className="formItem">
                <div className="formTextLabel">
                  <label className="categoryInputLabel">{text.title}</label>
                  <CustomInput
                    value={inputValues.params[text.name] || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(text.name, e.target.value)
                    }
                    placeholder={text.title}
                    addonBefore=""
                  />
                </div>
                <div>
                  {text.desc && <p className="inputDescription">{text.desc}</p>}
                </div>
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} md={10} xxl={8}>
          <AuthorizationBlock
            snippets={snippets}
            inputValues={inputValues}
            updateCredentials={updateCredentials}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ApiDetails;
