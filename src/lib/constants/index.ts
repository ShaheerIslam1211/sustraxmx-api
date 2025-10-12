/**
 * Application Constants
 * Centralized configuration and constants for the application
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5173",
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000", 10),
  RETRY_ATTEMPTS: parseInt(
    process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || "3",
    10
  ),
  ENDPOINTS: {
    CALCULATE: "/api/calculate",
    FORMS: "/api/forms",
    FUEL: "/api/fuel/calculate",
    DEBUG: "/api/debug/firebase",
    // Category-specific endpoints
    home_workers: "/api/homeworkers/calculate",
    hotel: "/api/hotel/calculate",
    refrigerator: "/api/refrigerator/calculate",
    water: "/api/water/calculate",
    ingredients: "/api/ingredients/calculate",
    paper: "/api/paper/calculate",
    spendings: "/api/spendings/calculate",
    product: "/api/product/calculate",
    bulk_material: "/api/bulkMaterial/calculate",
    commuting: "/api/commuting/calculate",
    other_travels: "/api/othertravels/calculate",
    natural_gas: "/api/naturalgas/calculate",
    heat_and_steam: "/api/heatandsteam/calculate",
    cars: "/api/cars/calculate",
    freighting: "/api/freighting/calculate",
    waste: "/api/waste/calculate",
    flight: "/api/flight/calculate",
    electricity: "/api/electricity/calculate",
  },
  // Helper methods
  getCalculationUrl: (category: string): string => {
    const endpoint =
      API_CONFIG.ENDPOINTS[category as keyof typeof API_CONFIG.ENDPOINTS] ||
      `/api/${category}/calculate`;
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  },
  getDisplayUrl: (category: string): string => {
    const endpoint =
      API_CONFIG.ENDPOINTS[category as keyof typeof API_CONFIG.ENDPOINTS] ||
      `/api/${category}/calculate`;
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  },
} as const;

// Export endpoints separately for convenience
export const API_ENDPOINTS = API_CONFIG.ENDPOINTS;

// Export helper methods separately for convenience
export const getCalculationUrl = API_CONFIG.getCalculationUrl;
export const getDisplayUrl = API_CONFIG.getDisplayUrl;

// Firebase Configuration
export const FIREBASE_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} as const;

// Application Constants
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || "Sustraxmx API",
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "2.0.0",
  DESCRIPTION: "Interactive API for testing Sustraxmx endpoints",
  AUTHOR: "Sustraxmx Team",
  SUPPORT_EMAIL: "support@sustraxmx.com",
  URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

// UI Constants
export const UI_CONFIG = {
  THEME: {
    PRIMARY_COLOR: "#52c41a",
    SECONDARY_COLOR: "#1890ff",
    SUCCESS_COLOR: "#52c41a",
    WARNING_COLOR: "#faad14",
    ERROR_COLOR: "#ff4d4f",
  },
  BREAKPOINTS: {
    XS: 480,
    SM: 576,
    MD: 768,
    LG: 992,
    XL: 1200,
    XXL: 1600,
  },
  ANIMATION: {
    DURATION: 300,
    EASING: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

// Form Constants
export const FORM_CONFIG = {
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MIN_LENGTH: 3,
  },
  FIELD_TYPES: {
    TEXT: "text",
    EMAIL: "email",
    PASSWORD: "password",
    NUMBER: "number",
    DATE: "date",
    SELECT: "select",
    TEXTAREA: "textarea",
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Internal server error. Please try again later.",
  VALIDATION: "Please check your input and try again.",
  TIMEOUT: "Request timeout. Please try again.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: "Successfully logged in!",
  LOGOUT: "Successfully logged out!",
  REGISTER: "Account created successfully!",
  UPDATE: "Updated successfully!",
  DELETE: "Deleted successfully!",
  SAVE: "Saved successfully!",
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_PREFERENCES: "user_preferences",
  THEME: "theme",
  LANGUAGE: "language",
} as const;

// Route Paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  CONTACT: "/contactus",
  FORM: "/form",
  API_TEST: "/api-test",
  FORM_CATEGORY: (category: string) => `/form/${category}`,
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_DEBUG:
    process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true" ||
    process.env.NODE_ENV === "development",
  ENABLE_ANALYTICS:
    process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true" ||
    process.env.NODE_ENV === "production",
  ENABLE_PWA: process.env.NEXT_PUBLIC_ENABLE_PWA === "true",
  ENABLE_DARK_MODE: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === "true",
  DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE === "true",
  SHOW_DEBUG_TOOLS: process.env.NEXT_PUBLIC_SHOW_DEBUG_TOOLS === "true",
} as const;

// Re-export emission categories
export * from "./emission-categories";
