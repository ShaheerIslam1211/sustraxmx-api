/**
 * Application Error Classes
 * Centralized error handling with proper typing and context
 */

export enum ErrorCode {
  // Authentication Errors
  AUTH_REQUIRED = "AUTH_REQUIRED",
  AUTH_INVALID_CREDENTIALS = "AUTH_INVALID_CREDENTIALS",
  AUTH_TOKEN_EXPIRED = "AUTH_TOKEN_EXPIRED",
  AUTH_PERMISSION_DENIED = "AUTH_PERMISSION_DENIED",

  // Validation Errors
  VALIDATION_REQUIRED = "VALIDATION_REQUIRED",
  VALIDATION_INVALID_FORMAT = "VALIDATION_INVALID_FORMAT",
  VALIDATION_OUT_OF_RANGE = "VALIDATION_OUT_OF_RANGE",
  VALIDATION_UNIQUE_CONSTRAINT = "VALIDATION_UNIQUE_CONSTRAINT",

  // API Errors
  API_NETWORK_ERROR = "API_NETWORK_ERROR",
  API_TIMEOUT = "API_TIMEOUT",
  API_SERVER_ERROR = "API_SERVER_ERROR",
  API_NOT_FOUND = "API_NOT_FOUND",
  API_BAD_REQUEST = "API_BAD_REQUEST",

  // Business Logic Errors
  CALCULATION_ERROR = "CALCULATION_ERROR",
  FORM_SUBMISSION_ERROR = "FORM_SUBMISSION_ERROR",
  DATA_LOADING_ERROR = "DATA_LOADING_ERROR",

  // System Errors
  SYSTEM_ERROR = "SYSTEM_ERROR",
  CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface ErrorContext {
  userId?: string;
  requestId?: string;
  timestamp: Date;
  userAgent?: string;
  url?: string;
  method?: string;
  [key: string]: any;
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly context: ErrorContext;
  public readonly isOperational: boolean;
  public readonly originalError?: Error;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    context: Partial<ErrorContext> = {},
    isOperational: boolean = true,
    originalError?: Error
  ) {
    super(message);

    this.name = "AppError";
    this.code = code;
    this.context = {
      timestamp: new Date(),
      ...context,
    };
    this.isOperational = isOperational;
    this.originalError = originalError;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * Convert error to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      isOperational: this.isOperational,
      stack: this.stack,
      originalError: this.originalError?.message,
    };
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    const userMessages: Record<ErrorCode, string> = {
      [ErrorCode.AUTH_REQUIRED]: "Please log in to continue",
      [ErrorCode.AUTH_INVALID_CREDENTIALS]: "Invalid email or password",
      [ErrorCode.AUTH_TOKEN_EXPIRED]:
        "Your session has expired. Please log in again",
      [ErrorCode.AUTH_PERMISSION_DENIED]:
        "You do not have permission to perform this action",
      [ErrorCode.VALIDATION_REQUIRED]: "This field is required",
      [ErrorCode.VALIDATION_INVALID_FORMAT]: "Please enter a valid format",
      [ErrorCode.VALIDATION_OUT_OF_RANGE]: "Value is out of acceptable range",
      [ErrorCode.VALIDATION_UNIQUE_CONSTRAINT]: "This value already exists",
      [ErrorCode.API_NETWORK_ERROR]:
        "Network error. Please check your connection",
      [ErrorCode.API_TIMEOUT]: "Request timed out. Please try again",
      [ErrorCode.API_SERVER_ERROR]: "Server error. Please try again later",
      [ErrorCode.API_NOT_FOUND]: "The requested resource was not found",
      [ErrorCode.API_BAD_REQUEST]: "Invalid request. Please check your input",
      [ErrorCode.CALCULATION_ERROR]:
        "Error calculating emissions. Please check your data",
      [ErrorCode.FORM_SUBMISSION_ERROR]:
        "Error submitting form. Please try again",
      [ErrorCode.DATA_LOADING_ERROR]:
        "Error loading data. Please refresh the page",
      [ErrorCode.SYSTEM_ERROR]: "System error. Please contact support",
      [ErrorCode.CONFIGURATION_ERROR]:
        "Configuration error. Please contact support",
      [ErrorCode.UNKNOWN_ERROR]: "An unexpected error occurred",
    };

    return userMessages[this.code] || "An unexpected error occurred";
  }

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    const retryableCodes = [
      ErrorCode.API_NETWORK_ERROR,
      ErrorCode.API_TIMEOUT,
      ErrorCode.API_SERVER_ERROR,
    ];
    return retryableCodes.includes(this.code);
  }
}

/**
 * Create specific error types
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    field?: string,
    context: Partial<ErrorContext> = {}
  ) {
    super(message, ErrorCode.VALIDATION_REQUIRED, { field, ...context }, true);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, context: Partial<ErrorContext> = {}) {
    super(message, ErrorCode.AUTH_REQUIRED, context, true);
    this.name = "AuthenticationError";
  }
}

export class APIError extends AppError {
  constructor(
    message: string,
    code: ErrorCode,
    context: Partial<ErrorContext> = {}
  ) {
    super(message, code, context, true);
    this.name = "APIError";
  }
}

export class CalculationError extends AppError {
  constructor(message: string, context: Partial<ErrorContext> = {}) {
    super(message, ErrorCode.CALCULATION_ERROR, context, true);
    this.name = "CalculationError";
  }
}
