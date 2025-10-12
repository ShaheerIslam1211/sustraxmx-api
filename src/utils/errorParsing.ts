/**
 * Utility functions for parsing and extracting meaningful error messages from backend responses
 */

export interface ParsedError {
  primaryMessage: string;
  specificError?: string;
  errorType?: string;
  suggestions?: string[];
}

/**
 * Parse backend error response to extract specific error messages
 */
export function parseBackendError(errorData: any): ParsedError {
  const result: ParsedError = {
    primaryMessage: "An error occurred",
  };

  // Extract the main error message
  if (typeof errorData === "string") {
    result.primaryMessage = errorData;
  } else if (errorData?.message) {
    result.primaryMessage = errorData.message;
  } else if (errorData?.error) {
    result.primaryMessage =
      typeof errorData.error === "string" ? errorData.error : "API Error";
  }

  // Analyze the error dynamically
  const analysis = analyzeErrorDynamically(result.primaryMessage);

  // Apply the analysis results
  result.specificError = analysis.specificError;
  result.errorType = analysis.errorType;
  result.suggestions = analysis.suggestions;

  return result;
}

/**
 * Dynamically analyze error messages to extract meaningful information
 */
function analyzeErrorDynamically(errorMessage: string): {
  specificError?: string;
  errorType?: string;
  suggestions: string[];
} {
  const errorText = errorMessage.toLowerCase();
  const suggestions: string[] = [];
  let specificError: string | undefined;
  let errorType: string | undefined;

  // Extract key error indicators
  const errorIndicators = extractErrorIndicators(errorText);

  // Determine error type based on indicators
  if (errorIndicators.hasValidation) {
    errorType = "Validation Error";
    suggestions.push("Check that all required fields are filled correctly");
    suggestions.push("Verify that input values are in the correct format");
  }

  if (errorIndicators.hasData) {
    errorType = errorType || "Data Error";
    suggestions.push(
      "Check if the input values are valid for the selected category"
    );
    suggestions.push("Verify that the parameter combination is supported");
  }

  if (errorIndicators.hasNetwork) {
    errorType = "Network Error";
    suggestions.push("Check your internet connection");
    suggestions.push("Try again in a few moments");
  }

  if (errorIndicators.hasAuth) {
    errorType = "Authentication Error";
    suggestions.push("Check your API credentials");
    suggestions.push("Ensure you have permission to access this resource");
  }

  if (errorIndicators.hasDatabase) {
    errorType = "Database Error";
    suggestions.push(
      "The calculation could not be completed due to a database issue"
    );
    suggestions.push("Try refreshing the page and submitting again");
  }

  // Extract specific error details
  if (errorIndicators.specificDetails.length > 0) {
    specificError = errorIndicators.specificDetails.join(" - ");
  }

  // Add generic suggestions if no specific ones were found
  if (suggestions.length === 0) {
    suggestions.push("Review your input values and try again");
    suggestions.push("Check if all required information is provided");
    suggestions.push("Contact support if the issue persists");
  }

  // Add context-specific suggestions based on error content
  if (errorIndicators.hasNumeric) {
    suggestions.push("Verify that numeric values are valid numbers");
  }

  if (errorIndicators.hasText) {
    suggestions.push("Check that text fields contain valid text");
  }

  if (errorIndicators.hasDate) {
    suggestions.push("Verify that date values are in the correct format");
  }

  return {
    specificError,
    errorType: errorType || "Error",
    suggestions: Array.from(new Set(suggestions)), // Remove duplicates
  };
}

/**
 * Extract error indicators from error message
 */
function extractErrorIndicators(errorText: string): {
  hasValidation: boolean;
  hasData: boolean;
  hasNetwork: boolean;
  hasAuth: boolean;
  hasDatabase: boolean;
  hasNumeric: boolean;
  hasText: boolean;
  hasDate: boolean;
  specificDetails: string[];
} {
  const indicators = {
    hasValidation: false,
    hasData: false,
    hasNetwork: false,
    hasAuth: false,
    hasDatabase: false,
    hasNumeric: false,
    hasText: false,
    hasDate: false,
    specificDetails: [] as string[],
  };

  // Validation indicators
  const validationKeywords = [
    "validation",
    "invalid",
    "required",
    "missing",
    "format",
    "type",
  ];
  indicators.hasValidation = validationKeywords.some(keyword =>
    errorText.includes(keyword)
  );

  // Data indicators
  const dataKeywords = [
    "factor",
    "emission",
    "parameter",
    "value",
    "data",
    "found",
    "available",
  ];
  indicators.hasData = dataKeywords.some(keyword =>
    errorText.includes(keyword)
  );

  // Network indicators
  const networkKeywords = ["network", "connection", "timeout", "unreachable"];
  indicators.hasNetwork = networkKeywords.some(keyword =>
    errorText.includes(keyword)
  );

  // Auth indicators
  const authKeywords = [
    "unauthorized",
    "authentication",
    "permission",
    "access",
    "credential",
  ];
  indicators.hasAuth = authKeywords.some(keyword =>
    errorText.includes(keyword)
  );

  // Database indicators
  const databaseKeywords = [
    "database",
    "operation",
    "query",
    "sql",
    "connection",
  ];
  indicators.hasDatabase = databaseKeywords.some(keyword =>
    errorText.includes(keyword)
  );

  // Content type indicators
  indicators.hasNumeric =
    /\d+/.test(errorText) ||
    errorText.includes("number") ||
    errorText.includes("amount");
  indicators.hasText =
    errorText.includes("text") ||
    errorText.includes("string") ||
    errorText.includes("name");
  indicators.hasDate =
    errorText.includes("date") ||
    errorText.includes("time") ||
    /\d{4}/.test(errorText);

  // Extract specific error details using regex patterns
  const specificPatterns = [
    /invalid\s+([^:]+)/i,
    /missing\s+([^:]+)/i,
    /no\s+([^:]+)\s+found/i,
    /([^:]+):\s*undefined/i,
    /([^:]+):\s*null/i,
    /conversion\s+factor[:\s]*([^,]+)/i,
    /emission\s+factor[:\s]*([^,]+)/i,
  ];

  specificPatterns.forEach(pattern => {
    const match = errorText.match(pattern);
    if (match && match[1]) {
      const detail = match[1].trim();
      if (detail && detail !== "undefined" && detail !== "null") {
        indicators.specificDetails.push(detail);
      }
    }
  });

  return indicators;
}

/**
 * Extract error details from various error response formats
 */
export function extractErrorDetails(response: any): {
  message: string;
  details?: any;
  stackTrace?: string;
} {
  if (typeof response === "string") {
    return { message: response };
  }

  if (response?.error) {
    if (typeof response.error === "string") {
      return { message: response.error, details: response };
    }
    if (response.error.message) {
      return {
        message: response.error.message,
        details: response.error,
        stackTrace: response.error.stack,
      };
    }
    // Handle error objects without message property
    if (typeof response.error === "object") {
      return {
        message: JSON.stringify(response.error),
        details: response.error,
      };
    }
  }

  if (response?.message) {
    return {
      message: response.message,
      details: response,
    };
  }

  return {
    message: "Unknown error occurred",
    details: response,
  };
}

/**
 * Format error message for display in UI components
 */
export function formatErrorForDisplay(parsedError: ParsedError): {
  title: string;
  description: string;
  suggestions?: string[];
} {
  const title = parsedError.specificError || parsedError.errorType || "Error";
  const description = parsedError.primaryMessage;

  return {
    title,
    description,
    suggestions: parsedError.suggestions,
  };
}
