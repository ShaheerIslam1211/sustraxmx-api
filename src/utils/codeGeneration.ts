/**
 * Code Generation Utilities
 *
 * This file contains utilities for generating code snippets in various languages.
 * It provides a clean, maintainable way to generate API client code.
 */

// Types
export interface Credentials {
  username: string;
  password: string;
}

export interface CodeSnippets {
  javascript: string;
  nodejs: string;
  python: string;
  curl: string;
  [key: string]: string;
}

export interface CodeGenerationOptions {
  baseUrl: string;
  params: Record<string, any>;
  credentials: Credentials;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
}

/**
 * Generate JavaScript fetch code snippet
 */
const generateJavaScript = (options: CodeGenerationOptions): string => {
  const {
    baseUrl,
    params,
    credentials,
    method = "POST",
    headers = {},
  } = options;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  const headersString = Object.entries(defaultHeaders)
    .map(([key, value]) => `    '${key}': '${value}'`)
    .join(",\n");

  const bodyData = {
    credentials: {
      username: credentials.username,
      password: credentials.password,
    },
    ...params,
  };

  return `fetch('${baseUrl}', {
  method: '${method}',
  headers: {
${headersString}
  },
  body: JSON.stringify(${JSON.stringify(bodyData, null, 4)})
})
.then(response => {
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  return response.json();
})
.then(data => {
  console.log('Success:', data);
})
.catch(error => {
  console.error('Error:', error);
});`;
};

/**
 * Generate Node.js axios code snippet
 */
const generateNodeJS = (options: CodeGenerationOptions): string => {
  const {
    baseUrl,
    params,
    credentials,
    method = "POST",
    headers = {},
  } = options;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  const bodyData = {
    credentials: {
      username: credentials.username,
      password: credentials.password,
    },
    ...params,
  };

  return `const axios = require('axios');

const data = ${JSON.stringify(bodyData, null, 2)};

const config = {
  method: '${method.toLowerCase()}',
  url: '${baseUrl}',
  headers: ${JSON.stringify(defaultHeaders, null, 2)},
  data: data
};

axios(config)
.then(response => {
  console.log('Success:', response.data);
})
.catch(error => {
  console.error('Error:', error.response?.data || error.message);
});`;
};

/**
 * Generate Python requests code snippet
 */
const generatePython = (options: CodeGenerationOptions): string => {
  const {
    baseUrl,
    params,
    credentials,
    method = "POST",
    headers = {},
  } = options;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  const bodyData = {
    credentials: {
      username: credentials.username,
      password: credentials.password,
    },
    ...params,
  };

  return `import requests
import json

url = "${baseUrl}"

headers = ${JSON.stringify(defaultHeaders, null, 2).replace(/"/g, "'")}

data = ${JSON.stringify(bodyData, null, 2).replace(/"/g, "'")}

try:
    response = requests.${method.toLowerCase()}(url, headers=headers, json=data)
    response.raise_for_status()  # Raises an HTTPError for bad responses

    result = response.json()
    print("Success:", result)

except requests.exceptions.RequestException as e:
    print("Error:", e)
except json.JSONDecodeError as e:
    print("JSON Decode Error:", e)`;
};

/**
 * Generate cURL command snippet
 */
const generateCurl = (options: CodeGenerationOptions): string => {
  const {
    baseUrl,
    params,
    credentials,
    method = "POST",
    headers = {},
  } = options;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  const bodyData = {
    credentials: {
      username: credentials.username,
      password: credentials.password,
    },
    ...params,
  };

  const headersString = Object.entries(defaultHeaders)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(" \\\n  ");

  return `curl -X ${method} "${baseUrl}" \\
  ${headersString} \\
  -d '${JSON.stringify(bodyData)}'`;
};

/**
 * Generate code snippets for all supported languages
 */
export const generateCodeSnippets = (
  options: CodeGenerationOptions
): CodeSnippets => {
  return {
    javascript: generateJavaScript(options),
    nodejs: generateNodeJS(options),
    python: generatePython(options),
    curl: generateCurl(options),
  };
};

/**
 * Generate code snippet for a specific language
 */
export const generateCodeSnippet = (
  language: "javascript" | "nodejs" | "python" | "curl",
  _options: CodeGenerationOptions
): string => {
  const generators: Record<
    string,
    (_options: CodeGenerationOptions) => string
  > = {
    javascript: generateJavaScript,
    nodejs: generateNodeJS,
    python: generatePython,
    curl: generateCurl,
  };

  const generator = generators[language];
  if (!generator) {
    throw new Error(`Unsupported language: ${language}`);
  }

  return generator(_options);
};

/**
 * Get list of supported languages
 */
export const getSupportedLanguages = (): string[] => {
  return ["javascript", "nodejs", "python", "curl"];
};

/**
 * Validate code generation options
 */
export const validateCodeGenerationOptions = (
  options: CodeGenerationOptions
): boolean => {
  const { baseUrl, credentials } = options;

  if (!baseUrl || typeof baseUrl !== "string") {
    return false;
  }

  if (!credentials || !credentials.username || !credentials.password) {
    return false;
  }

  return true;
};
