/**
 * API Configuration
 * Centralized API settings and endpoints
 */

import { appConfig } from "./app.config";

// API Endpoints mapping
export const API_ENDPOINTS = {
  // Core endpoints
  CALCULATE: "/api/calculate",
  FORMS: "/api/forms",
  DEBUG: "/api/debug/firebase",

  // Category-specific endpoints
  FUEL: "/api/fuel/calculate",
  NATURAL_GAS: "/api/naturalgas/calculate",
  ELECTRICITY: "/api/electricity/calculate",
  CARS: "/api/cars/calculate",
  FLIGHT: "/api/flight/calculate",
  FREIGHTING: "/api/freighting/calculate",
  WASTE: "/api/waste/calculate",
  HEAT_AND_STEAM: "/api/heatandsteam/calculate",
  COMMUTING: "/api/commuting/calculate",
  OTHER_TRAVELS: "/api/othertravels/calculate",
  BULK_MATERIAL: "/api/bulk-material/calculate",
  HOTEL: "/api/hotel/calculate",
  REFRIGERATOR: "/api/refrigerator/calculate",
  WATER: "/api/water/calculate",
  INGREDIENTS: "/api/ingredients/calculate",
  PAPER: "/api/paper/calculate",
  HOMEWORKERS: "/api/homeworkers/calculate",
  SPENDINGS: "/api/spendings/calculate",
  PRODUCT: "/api/product/calculate",
} as const;

// API Configuration
export const apiConfig = {
  // Base configuration
  baseUrl: appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
  retryAttempts: appConfig.api.retryAttempts,

  // Headers
  defaultHeaders: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // Endpoints
  endpoints: API_ENDPOINTS,

  // Helper methods
  getFullUrl: (endpoint: string): string => {
    const baseUrl = apiConfig.baseUrl;
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  },

  getApiUrl: (endpoint: string): string => {
    const cleanEndpoint = endpoint.startsWith("/api/")
      ? endpoint
      : `/api/${endpoint}`;
    return apiConfig.getFullUrl(cleanEndpoint);
  },

  getCalculationUrl: (category: string): string => {
    const endpoint =
      API_ENDPOINTS[category as keyof typeof API_ENDPOINTS] ||
      `/api/${category}/calculate`;
    return apiConfig.getFullUrl(endpoint);
  },

  // Display URL for UI (what users see)
  getDisplayUrl: (category: string): string => {
    const endpoint =
      API_ENDPOINTS[category as keyof typeof API_ENDPOINTS] ||
      `/api/${category}/calculate`;
    return apiConfig.getFullUrl(endpoint);
  },
} as const;

export type ApiConfig = typeof apiConfig;
