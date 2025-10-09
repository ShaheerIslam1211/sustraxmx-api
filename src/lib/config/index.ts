/**
 * Configuration Index
 * Centralized configuration exports
 */

export { appConfig } from "./app.config";
export { apiConfig, API_ENDPOINTS } from "./api.config";

// Import for use in helper functions
import { API_ENDPOINTS } from "./api.config";
import { apiConfig } from "./api.config";

// Export helper methods from apiConfig
export const getDisplayUrl = (category: string): string => {
  const endpoint =
    API_ENDPOINTS[category as keyof typeof API_ENDPOINTS] ||
    `/api/${category}/calculate`;
  return apiConfig.getFullUrl(endpoint);
};
export const getCalculationUrl = (category: string): string => {
  const endpoint =
    API_ENDPOINTS[category as keyof typeof API_ENDPOINTS] ||
    `/api/${category}/calculate`;
  return apiConfig.getFullUrl(endpoint);
};
export {
  uiConfig,
  colors,
  typography,
  spacing,
  breakpoints,
  animation,
  shadows,
  borderRadius,
  zIndex,
} from "./ui.config";

// Re-export types
export type { AppConfig } from "./app.config";
export type { ApiConfig } from "./api.config";
export type { UiConfig } from "./ui.config";

// Legacy exports for backward compatibility
export { env } from "../env";
export { API_CONFIG } from "../constants";
export {
  FIREBASE_CONFIG,
  APP_CONFIG,
  UI_CONFIG,
  FORM_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  ROUTES,
  FEATURE_FLAGS,
} from "../constants";
