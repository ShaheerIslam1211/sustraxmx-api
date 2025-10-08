/**
 * API Module
 * Centralized API client and services
 */

export * from "./ApiClient";
export * from "./services";

// Re-export commonly used types
export type { ApiRequestConfig, ApiResponse, ApiError } from "./ApiClient";
export type {
  CalculationRequest,
  CalculationResponse,
  FormDataResponse,
  FuelCalculationRequest,
  FuelCalculationResponse,
} from "./services";
