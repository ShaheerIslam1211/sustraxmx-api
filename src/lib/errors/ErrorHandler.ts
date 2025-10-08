/**
 * Centralized Error Handler
 * Handles all application errors with proper logging and user feedback
 */

import { AppError, ErrorCode, ErrorContext } from "./AppError";
import { ERROR_MESSAGES } from "../constants";

export interface ErrorHandlerConfig {
  enableLogging: boolean;
  enableReporting: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
}

export class ErrorHandler {
  private static config: ErrorHandlerConfig = {
    enableLogging: true,
    enableReporting: process.env.NODE_ENV === "production",
    logLevel: process.env.NODE_ENV === "development" ? "debug" : "error",
  };

  /**
   * Configure error handler
   */
  static configure(config: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Handle and log errors
   */
  static handle(
    error: Error | AppError,
    context?: Partial<ErrorContext>
  ): AppError {
    const appError = this.normalizeError(error, context);

    if (this.config.enableLogging) {
      this.logError(appError);
    }

    if (this.config.enableReporting) {
      this.reportError(appError);
    }

    return appError;
  }

  /**
   * Normalize any error to AppError
   */
  private static normalizeError(
    error: Error | AppError,
    context?: Partial<ErrorContext>
  ): AppError {
    if (error instanceof AppError) {
      return error;
    }

    // Determine error code based on error type
    let code: ErrorCode = ErrorCode.UNKNOWN_ERROR;

    if (error.name === "TypeError") {
      code = ErrorCode.API_NETWORK_ERROR;
    } else if (error.name === "ValidationError") {
      code = ErrorCode.VALIDATION_REQUIRED;
    } else if (error.message.includes("timeout")) {
      code = ErrorCode.API_TIMEOUT;
    } else if (error.message.includes("network")) {
      code = ErrorCode.API_NETWORK_ERROR;
    }

    return new AppError(error.message, code, context, true, error);
  }

  /**
   * Log error to console
   */
  private static logError(error: AppError): void {
    const logData = {
      error: error.toJSON(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    };

    switch (this.config.logLevel) {
      case "debug":
        console.debug("🔍 Error Debug:", logData);
        break;
      case "info":
        console.info("ℹ️ Error Info:", logData);
        break;
      case "warn":
        console.warn("⚠️ Error Warning:", logData);
        break;
      case "error":
        console.error("❌ Error:", logData);
        break;
    }
  }

  /**
   * Report error to external service
   */
  private static reportError(error: AppError): void {
    // In a real application, you would send this to an error reporting service
    // like Sentry, LogRocket, or Bugsnag
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error);
      console.log("📊 Error reported to monitoring service:", error.toJSON());
    }
  }

  /**
   * Create validation error
   */
  static createValidationError(
    message: string,
    field?: string,
    context?: Partial<ErrorContext>
  ): AppError {
    return new AppError(
      message,
      ErrorCode.VALIDATION_REQUIRED,
      { field, ...context },
      true
    );
  }

  /**
   * Create API error
   */
  static createAPIError(
    message: string,
    code: ErrorCode = ErrorCode.API_SERVER_ERROR,
    context?: Partial<ErrorContext>
  ): AppError {
    return new AppError(message, code, context, true);
  }

  /**
   * Create authentication error
   */
  static createAuthError(
    message: string,
    context?: Partial<ErrorContext>
  ): AppError {
    return new AppError(message, ErrorCode.AUTH_REQUIRED, context, true);
  }

  /**
   * Create calculation error
   */
  static createCalculationError(
    message: string,
    context?: Partial<ErrorContext>
  ): AppError {
    return new AppError(message, ErrorCode.CALCULATION_ERROR, context, true);
  }

  /**
   * Safe execution wrapper
   */
  static async safeExecute<T>(
    operation: () => Promise<T>,
    context?: Partial<ErrorContext>
  ): Promise<{ data?: T; error?: AppError }> {
    try {
      const data = await operation();
      return { data };
    } catch (error) {
      const appError = this.handle(error as Error, context);
      return { error: appError };
    }
  }

  /**
   * Safe execution wrapper for sync operations
   */
  static safeExecuteSync<T>(
    operation: () => T,
    context?: Partial<ErrorContext>
  ): { data?: T; error?: AppError } {
    try {
      const data = operation();
      return { data };
    } catch (error) {
      const appError = this.handle(error as Error, context);
      return { error: appError };
    }
  }

  /**
   * Get user-friendly error message
   */
  static getUserMessage(error: Error | AppError): string {
    if (error instanceof AppError) {
      return error.getUserMessage();
    }

    // Fallback for non-AppError instances
    if (error.message.includes("network")) {
      return ERROR_MESSAGES.NETWORK;
    }
    if (error.message.includes("timeout")) {
      return ERROR_MESSAGES.TIMEOUT;
    }

    return ERROR_MESSAGES.SERVER_ERROR;
  }

  /**
   * Check if error is retryable
   */
  static isRetryable(error: Error | AppError): boolean {
    if (error instanceof AppError) {
      return error.isRetryable();
    }

    // Check for common retryable error patterns
    const retryablePatterns = ["network", "timeout", "ECONNRESET", "ENOTFOUND"];

    return retryablePatterns.some(pattern =>
      error.message.toLowerCase().includes(pattern)
    );
  }
}
