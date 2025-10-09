/**
 * Lib Barrel Export
 *
 * This file centralizes all library exports for easier importing.
 * Import lib utilities like: import { API_CONFIG, getCountries, ErrorHandler } from '@/lib'
 */

// Configuration utilities
export {
  API_CONFIG,
  API_ENDPOINTS,
  getDisplayUrl,
  getCalculationUrl,
} from "./constants";
export { apiConfig, API_ENDPOINTS as API_ENDPOINTS_NEW } from "./config";

// Country utilities
export { getCountries } from "./countries";

// Error handling utilities
export { ErrorType, Logger, ErrorHandler, Validator } from "./errorHandler";
export type { AppError } from "./errorHandler";

// Firebase services (re-export from firebase barrel)
export * from "./firebase";

// New architecture modules
export * from "./constants";
export * from "./errors";
export * from "./validation";
export * from "./api";
export * from "./logger";
export * from "./debug";

// Re-export types if any are defined in the future
export type * from "./config";
export type * from "./countries";
export type * from "./errorHandler";
export type * from "./constants";
export type * from "./errors";
export type * from "./validation";
export type * from "./api";
export type * from "./logger";
