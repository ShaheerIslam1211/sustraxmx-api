/**
 * Error Handling Module
 * Centralized error handling for the application
 */

export * from "./AppError";
export * from "./ErrorHandler";

// Re-export commonly used types
export type { ErrorContext } from "./AppError";
export type { ErrorHandlerConfig } from "./ErrorHandler";
