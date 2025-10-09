/**
 * Environment configuration with validation
 * Centralized environment variable management
 */

// Environment validation
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
] as const;

const optionalEnvVars = [
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_API_TIMEOUT",
  "NEXT_PUBLIC_API_RETRY_ATTEMPTS",
  "NEXT_PUBLIC_APP_NAME",
  "NEXT_PUBLIC_APP_VERSION",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_ENABLE_DEBUG",
  "NEXT_PUBLIC_ENABLE_ANALYTICS",
  "NEXT_PUBLIC_ENABLE_PWA",
  "NEXT_PUBLIC_ENABLE_DARK_MODE",
  "NEXT_PUBLIC_DEV_MODE",
  "NEXT_PUBLIC_SHOW_DEBUG_TOOLS",
] as const;

// Validate required environment variables
export const validateEnv = (): void => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

// Environment configuration with defaults
export const env = {
  // App configuration
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Sustraxmx API",
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "2.0.0",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // API configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5173",
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000", 10),
  API_RETRY_ATTEMPTS: parseInt(
    process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || "3",
    10
  ),

  // Firebase configuration
  FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,

  // Feature flags
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

  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;

// Validate environment on import
if (typeof window === "undefined") {
  validateEnv();
}
