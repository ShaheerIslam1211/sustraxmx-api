/**
 * Application Configuration
 * Centralized app settings and configuration
 */

import { env } from "../env";

export const appConfig = {
  // Basic app information
  name: env.APP_NAME,
  version: env.APP_VERSION,
  description: "Interactive API playground for testing SustraxMX endpoints",
  author: "SustraxMX Team",
  supportEmail: "support@sustraxmx.com",
  url: env.APP_URL,

  // Environment
  isDevelopment: env.IS_DEVELOPMENT,
  isProduction: env.IS_PRODUCTION,
  nodeEnv: env.NODE_ENV,

  // Feature flags
  features: {
    debug: env.ENABLE_DEBUG,
    analytics: env.ENABLE_ANALYTICS,
    pwa: env.ENABLE_PWA,
    darkMode: env.ENABLE_DARK_MODE,
    devMode: env.DEV_MODE,
    showDebugTools: env.SHOW_DEBUG_TOOLS,
  },

  // API configuration
  api: {
    baseUrl: env.API_BASE_URL,
    timeout: env.API_TIMEOUT,
    retryAttempts: env.API_RETRY_ATTEMPTS,
  },

  // Firebase configuration
  firebase: {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
  },
} as const;

export type AppConfig = typeof appConfig;
