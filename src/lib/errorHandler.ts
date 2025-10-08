/**
 * @fileoverview Centralized error handling and logging utility for the application
 *
 * This module provides a comprehensive error handling system including:
 * - Error type classification
 * - Structured logging with different levels
 * - Safe execution wrappers
 * - Input validation utilities
 *
 * @author SustraxMX Development Team
 * @version 1.0.0
 */

/**
 * Enumeration of error types for categorization
 *
 * @enum {string}
 * @readonly
 */

export enum ErrorType {
  /** Validation errors for user input */
  _VALIDATION = "VALIDATION",
  /** API and network-related errors */
  _API = "API",
  /** Authentication and authorization errors */
  _AUTH = "AUTH",
  /** Database operation errors */
  _DATABASE = "DATABASE",
  /** General application errors */
  GENERAL = "GENERAL",
}

/**
 * Interface for structured application errors
 *
 * @interface AppError
 */
export interface AppError {
  /** The type/category of the error */
  type: ErrorType;
  /** Human-readable error message */
  message: string;
  /** Original error object if available */
  originalError?: Error;
  /** Additional context data for debugging */
  context?: Record<string, any>;
  /** Timestamp when the error occurred */
  timestamp: Date;
}

/**
 * Centralized logging utility with different severity levels
 *
 * @class Logger
 * @example
 * ```tsx
 * Logger.info('User logged in', { userId: '123' });
 * Logger.error('API call failed', error, { endpoint: '/api/users' });
 * ```
 */
export class Logger {
  private static isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Logs informational messages
   *
   * @static
   * @param {string} message - The message to log
   * @param {Record<string, any>} [context] - Additional context data
   *
   * @example
   * ```tsx
   * Logger.info('User action completed', { action: 'profile_update', userId: '123' });
   * ```
   */
  static info(message: string, context?: Record<string, any>): void {
    const logData = {
      level: "INFO",
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    if (this.isDevelopment) {
      console.info("ℹ️ Info:", logData);
    }
  }

  /**
   * Logs warning messages for non-critical issues
   *
   * @static
   * @param {string} message - The warning message to log
   * @param {Record<string, any>} [context] - Additional context data
   *
   * @example
   * ```tsx
   * Logger.warn('API response slow', { responseTime: 5000, endpoint: '/api/data' });
   * ```
   */
  static warn(message: string, context?: Record<string, any>): void {
    const logData = {
      level: "WARN",
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    if (this.isDevelopment) {
      console.warn("⚠️ Warning:", logData);
    }
  }

  /**
   * Logs error messages for critical issues
   *
   * @static
   * @param {string} message - The error message to log
   * @param {Error} [error] - The original error object
   * @param {Record<string, any>} [context] - Additional context data
   *
   * @example
   * ```tsx
   * Logger.error('Database connection failed', dbError, { operation: 'user_fetch' });
   * ```
   */
  static error(
    message: string,
    error?: Error,
    context?: Record<string, any>
  ): void {
    const logData = {
      level: "ERROR",
      message,
      error: error?.message,
      stack: error?.stack,
      context,
      timestamp: new Date().toISOString(),
    };

    if (this.isDevelopment) {
      console.error("🚨 Error:", logData);
    }

    // In production, you would send this to your logging service
    // Example: sendToLoggingService(logData);
  }

  /**
   * Logs debug messages for development purposes
   *
   * @static
   * @param {string} message - The debug message to log
   * @param {Record<string, any>} [context] - Additional context data
   *
   * @example
   * ```tsx
   * Logger.debug('Function called', { functionName: 'validateUser', params: { userId: '123' } });
   * ```
   *
   * @remarks
   * Debug messages are only logged in development environment
   */
  static debug(message: string, context?: Record<string, any>): void {
    if (this.isDevelopment) {
      const logData = {
        level: "DEBUG",
        message,
        context,
        timestamp: new Date().toISOString(),
      };
      console.debug("🐛 Debug:", logData);
    }
  }
}

/**
 * Centralized error handling utility with creation and processing capabilities
 *
 * @class ErrorHandler
 * @example
 * ```tsx
 * const error = ErrorHandler.createError(
 *   ErrorType.API,
 *   'Failed to fetch user data',
 *   originalError,
 *   { userId: '123', endpoint: '/api/users' }
 * );
 *
 * ErrorHandler.handleError(error);
 * ```
 */
export class ErrorHandler {
  /**
   * Creates a structured AppError object
   *
   * @static
   * @param {ErrorType} type - The category of the error
   * @param {string} message - Human-readable error message
   * @param {Error} [originalError] - The original error object if available
   * @param {Record<string, any>} [context] - Additional context for debugging
   * @returns {AppError} Structured error object
   *
   * @example
   * ```tsx
   * const apiError = ErrorHandler.createError(
   *   ErrorType.API,
   *   'Request timeout',
   *   timeoutError,
   *   { url: 'https://api.example.com', timeout: 5000 }
   * );
   * ```
   */
  static createError(
    type: ErrorType,
    message: string,
    originalError?: Error,
    context?: Record<string, any>
  ): AppError {
    const appError: AppError = {
      type,
      message,
      originalError,
      context,
      timestamp: new Date(),
    };

    Logger.error(message, originalError, context);
    return appError;
  }

  /**
   * Handles API errors and converts them to AppError
   */
  static handleApiError(error: any, context?: Record<string, any>): AppError {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      return this.createError(
        ErrorType._API,
        `API Error (${status}): ${message}`,
        error,
        { ...context, status, response: error.response.data }
      );
    } else if (error.request) {
      // Network error
      return this.createError(
        ErrorType._API,
        "Network error: Unable to reach the server",
        error,
        context
      );
    } else {
      // Other error
      return this.createError(
        ErrorType.GENERAL,
        error.message || "An unexpected error occurred",
        error,
        context
      );
    }
  }

  /**
   * Handles validation errors
   */
  static handleValidationError(
    field: string,
    value: any,
    rule: string,
    context?: Record<string, any>
  ): AppError {
    const message = `Validation failed for field '${field}': ${rule}`;
    return this.createError(ErrorType._VALIDATION, message, undefined, {
      ...context,
      field,
      value,
      rule,
    });
  }

  /**
   * Handles calculation errors
   */
  static handleCalculationError(
    operation: string,
    inputs: Record<string, any>,
    originalError?: Error
  ): AppError {
    const message = `Calculation error in ${operation}`;
    return this.createError(ErrorType.GENERAL, message, originalError, {
      operation,
      inputs,
    });
  }

  /**
   * Converts error types to user-friendly messages
   */
  private static getUserFriendlyMessage(
    type: ErrorType,
    _message: string
  ): string {
    switch (type) {
      case ErrorType._VALIDATION:
        return "Please check your input values and try again.";
      case ErrorType._API:
        return "There was a problem with the server. Please try again later.";
      case ErrorType._AUTH:
        return "Authentication required. Please log in and try again.";
      case ErrorType._DATABASE:
        return "There was a problem accessing the database. Please try again later.";
      case ErrorType.GENERAL:
      default:
        return "An unexpected error occurred. Please try again.";
    }
  }

  /**
   * Safely executes an async function with error handling
   */
  static async safeExecute<T>(
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<{ data?: T; error?: AppError }> {
    try {
      const data = await operation();
      return { data };
    } catch (error) {
      const appError = this.handleApiError(error, context);
      return { error: appError };
    }
  }

  /**
   * Safely executes a sync function with error handling
   */
  static safeExecuteSync<T>(
    operation: () => T,
    context?: Record<string, any>
  ): { data?: T; error?: AppError } {
    try {
      const data = operation();
      return { data };
    } catch (error) {
      const appError = this.createError(
        ErrorType.GENERAL,
        error instanceof Error ? error.message : "Unknown error",
        error instanceof Error ? error : undefined,
        context
      );
      return { error: appError };
    }
  }
}

/**
 * Validation utilities
 */
export class Validator {
  static isRequired(value: any, fieldName: string): AppError | null {
    if (value === null || value === undefined || value === "") {
      return ErrorHandler.handleValidationError(
        fieldName,
        value,
        "This field is required"
      );
    }
    return null;
  }

  static isNumber(value: any, fieldName: string): AppError | null {
    if (isNaN(Number(value))) {
      return ErrorHandler.handleValidationError(
        fieldName,
        value,
        "Must be a valid number"
      );
    }
    return null;
  }

  static isPositive(value: number, fieldName: string): AppError | null {
    if (value <= 0) {
      return ErrorHandler.handleValidationError(
        fieldName,
        value,
        "Must be a positive number"
      );
    }
    return null;
  }

  static isInRange(
    value: number,
    min: number,
    max: number,
    fieldName: string
  ): AppError | null {
    if (value < min || value > max) {
      return ErrorHandler.handleValidationError(
        fieldName,
        value,
        `Must be between ${min} and ${max}`
      );
    }
    return null;
  }

  static validateForm(
    values: Record<string, any>,
    rules: Record<string, ((value: any) => AppError | null)[]>
  ): AppError[] {
    const errors: AppError[] = [];

    for (const [field, validators] of Object.entries(rules)) {
      const value = values[field];
      for (const validator of validators) {
        const error = validator(value);
        if (error) {
          errors.push(error);
          break; // Stop at first error for this field
        }
      }
    }

    return errors;
  }
}
