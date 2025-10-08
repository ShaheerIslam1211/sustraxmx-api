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

  // Look for specific error patterns in the message or error details
  const errorText = result.primaryMessage.toLowerCase();

  // Check for specific error types and provide helpful suggestions
  if (errorText.includes("invalid conversion factor")) {
    result.specificError = "Invalid conversion factor";
    result.errorType = "Data Validation Error";
    result.suggestions = [
      "Check if the fuel type/category combination is valid",
      "Verify that the selected fuel category has emission factors available",
      "Try a different fuel category or type",
    ];
  } else if (errorText.includes("no valid emission factor found")) {
    result.specificError = "No valid emission factor found";
    result.errorType = "Data Not Found";
    result.suggestions = [
      "The selected fuel type may not have emission factors available",
      "Try selecting a different fuel category",
      "Check if the fuel type name is spelled correctly",
    ];
  } else if (errorText.includes("validation")) {
    result.errorType = "Validation Error";
    result.suggestions = [
      "Check that all required fields are filled correctly",
      "Verify that numeric values are in the correct format",
    ];
  } else if (
    errorText.includes("network") ||
    errorText.includes("connection")
  ) {
    result.errorType = "Network Error";
    result.suggestions = [
      "Check your internet connection",
      "Try again in a few moments",
      "Contact support if the issue persists",
    ];
  } else if (
    errorText.includes("unauthorized") ||
    errorText.includes("authentication")
  ) {
    result.errorType = "Authentication Error";
    result.suggestions = [
      "Check your API credentials",
      "Ensure you have permission to access this resource",
    ];
  }

  return result;
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
