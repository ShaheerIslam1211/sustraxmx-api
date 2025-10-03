import React, { useState } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import CustomTabs from '../common/customTabs/CustomTab';
import './index.css';
import { copyToClipboard, CodeSnippets } from '../../js-helper/helpers';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia as style } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface InputValues {
  params: Record<string, string>;
}

interface LanguageSelectorProps {
  snippets: CodeSnippets;
  inputValues: InputValues;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  snippets,
  inputValues,
}) => {
  const [activeLanguage, setActiveLanguage] = useState("javascript");
  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const tabsData = Object.keys(snippets).map(lang => ({
    key: lang,
    label: capitalizeFirstLetter(lang),
    content: (
      <div className="code-block-container">
        <SyntaxHighlighter
          language={lang}
          style={style}
          className="code-block-content"
        >
          {snippets[lang].replace(
            /\$\{([^}]+)\}/g,
            (_: string, match: string) => inputValues.params[match] || ""
          )}
        </SyntaxHighlighter>
        <CopyOutlined
          className="copy-icon"
          onClick={() =>
            copyToClipboard(
              snippets[activeLanguage] ?? "",
              "Code has been copied!"
            )
          }
        />
      </div>
    ),
  }));

  return (
    <div>
      <CustomTabs
        activeKey="javascript"
        onChange={(key: string) => setActiveLanguage(key.toLowerCase())}
        tabsData={tabsData}
      />
    </div>
  );
};

export default LanguageSelector;
