/**
 * Utils Barrel Export
 *
 * This file provides a centralized export point for all utility functions,
 * making imports cleaner and more organized throughout the application.
 */

// API utilities
export * from "./api";

// Validation utilities
export * from "./validation";

// Formatting utilities
export * from "./formatting";

// Code generation utilities
export * from "./codeGeneration";

// Clipboard utilities
export * from "./clipboard";

// Constants
export * from "./constants";

// Re-export commonly used utilities with shorter names
export {
  validateEmail,
  validatePassword,
  validateForm,
  validateRequired,
} from "./validation";

export {
  formatDate,
  formatTime,
  formatCurrency,
  formatFileSize,
  formatText,
} from "./formatting";

export { copyToClipboard, copyCode, copyJson, clipboard } from "./clipboard";

export { generateCodeSnippet } from "./codeGeneration";

export { API_CONFIG, ROUTES, STORAGE_KEYS, UI_CONSTANTS } from "./constants";
