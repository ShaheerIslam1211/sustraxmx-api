import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Typography } from "antd";
import LanguageCodeBlock from "../langugaeSelector";
// import { useApiData } from "../../context/ApiDataContext";
import {
  UserAuthInputs,
  SingleInput,
  CustomInput,
} from "../common/formInputs/formInput";
import "./index.css";
import { useAuth } from "../../context/AuthContext";
import texts from "../../mockData/texts";
import { DummyUrl } from "../../mockData/mockData";
import { useEmissionData } from "../../context/EmissionDataContext";
import styles from "../../styles/styles.contants.json";
import { CodeSnippets } from "../../js-helper/helpers";

const { Text } = Typography;

interface Credentials {
  username: string;
  password: string;
}

interface AuthorizationBlockProps {
  snippets: CodeSnippets;
  inputValues: Record<string, any>;
  updateCredentials: (credentials: Credentials) => void;
}

const AuthorizationBlock: React.FC<AuthorizationBlockProps> = ({
  snippets,
  inputValues,
  updateCredentials,
}) => {
  const { emissionData } = useEmissionData();
  const { user } = useAuth();

  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  return (
    console.log(emissionData.title),
    (
      <section className="authorization-container">
        <header className="authorization-header">
          <p
            style={{
              fontSize: styles.fontSize.smallFont,
              color: styles.colors.lightGray,
            }}
          >
            {texts.AuthorizationBlock.AuthorizationText}
          </p>
          <UserAuthInputs updateCredentials={updateCredentials} />

          {!user && (
            <Typography>
              <Text style={{ fontSize: "13px" }}>
                {texts.AuthorizationBlock.loginPrompt}
              </Text>
            </Typography>
          )}
          <div style={{ marginTop: "20px" }}>
            <p
              style={{
                fontSize: styles.fontSize.smallFont,
                color: styles.colors.lightGray,
              }}
            >
              {texts.AuthorizationBlock.urlText}
            </p>
            <CustomInput readOnly={true} value={`${DummyUrl}${name}`} />
          </div>
        </header>

        <LanguageCodeBlock
          inputValues={{ params: inputValues }}
          snippets={snippets}
        />
      </section>
    )
  );
};

export default AuthorizationBlock;
