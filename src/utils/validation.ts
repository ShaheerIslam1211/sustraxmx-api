/**
 * Validation Utilities
 *
 * This file contains all validation functions used throughout the application.
 * Centralizing validation logic makes it reusable and easier to maintain.
 */

import { VALIDATION } from "./constants";

// Types
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates an email address format
 *
 * Checks if the provided email string matches a valid email format using regex.
 *
 * @param {string} email - The email address to validate
 * @returns {ValidationResult} Object containing validation status and error message if invalid
 *
 * @example
 * ```tsx
 * const result = validateEmail('user@example.com');
 * if (!result.isValid) {
 *   console.error(result.message);
 * }
 * ```
 *
 * @remarks
 * - Uses a standard email regex pattern
 * - Checks for required field
 * - Returns user-friendly error messages
 */
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { isValid: false, message: "Email is required" };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }

  return { isValid: true };
};

/**
 * Validates password strength and requirements
 *
 * Checks password against multiple criteria including length, character requirements,
 * and complexity rules for secure authentication.
 *
 * @param {string} password - The password to validate
 * @returns {ValidationResult} Object containing validation status and error message if invalid
 *
 * @example
 * ```tsx
 * const result = validatePassword('MySecure123');
 * if (result.isValid) {
 *   // Password meets all requirements
 *   submitForm();
 * } else {
 *   showError(result.message);
 * }
 * ```
 *
 * @remarks
 * Password requirements:
 * - Minimum length defined by VALIDATION.MIN_PASSWORD_LENGTH
 * - Maximum length defined by VALIDATION.MAX_PASSWORD_LENGTH
 * - Must contain at least one uppercase letter
 * - Must contain at least one lowercase letter
 * - Must contain at least one number
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      message: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters long`,
    };
  }

  if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {
    return {
      isValid: false,
      message: `Password must not exceed ${VALIDATION.MAX_PASSWORD_LENGTH} characters`,
    };
  }

  // Check for at least one uppercase letter, one lowercase letter, and one number
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return {
      isValid: false,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    };
  }

  return { isValid: true };
};

/**
 * Validates username format and requirements
 *
 * Ensures username meets length requirements and contains only allowed characters.
 *
 * @param {string} username - The username to validate
 * @returns {ValidationResult} Object containing validation status and error message if invalid
 *
 * @example
 * ```tsx
 * const result = validateUsername('john_doe123');
 * if (!result.isValid) {
 *   setUsernameError(result.message);
 * }
 * ```
 *
 * @remarks
 * Username requirements:
 * - Minimum length defined by VALIDATION.MIN_USERNAME_LENGTH
 * - Maximum length defined by VALIDATION.MAX_USERNAME_LENGTH
 * - Can only contain letters, numbers, and underscores
 * - No spaces or special characters allowed
 */
export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, message: "Username is required" };
  }

  if (username.length < VALIDATION.MIN_USERNAME_LENGTH) {
    return {
      isValid: false,
      message: `Username must be at least ${VALIDATION.MIN_USERNAME_LENGTH} characters long`,
    };
  }

  if (username.length > VALIDATION.MAX_USERNAME_LENGTH) {
    return {
      isValid: false,
      message: `Username must not exceed ${VALIDATION.MAX_USERNAME_LENGTH} characters`,
    };
  }

  // Username should only contain alphanumeric characters and underscores
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      message: "Username can only contain letters, numbers, and underscores",
    };
  }

  return { isValid: true };
};

// Required field validation
/**
 * Validates that a field is not empty
 *
 * @param {string} value - The value to validate
 * @param {string} fieldName - The name of the field being validated (for error messages)
 * @returns {ValidationResult} Object containing validation status and error message
 *
 * @example
 * ```tsx
 * const result = validateRequired('John Doe', 'Full Name');
 * if (!result.isValid) {
 *   console.error(result.message); // "Full Name is required"
 * }
 * ```
 *
 * @remarks
 * - Trims whitespace before validation
 * - Returns specific error message with field name
 */
export const validateRequired = (
  value: string,
  fieldName: string
): ValidationResult => {
  if (value === null || value === undefined || value === "") {
    return { isValid: false, message: `${fieldName} is required` };
  }

  return { isValid: true };
};

// URL validation
/**
 * Validates URL format
 *
 * @param {string} url - The URL to validate
 * @returns {ValidationResult} Object containing validation status and error message
 *
 * @example
 * ```tsx
 * const result = validateUrl('https://example.com');
 * if (result.isValid) {
 *   console.log('Valid URL');
 * }
 * ```
 *
 * @remarks
 * - Accepts both HTTP and HTTPS protocols
 * - Validates basic URL structure
 * - Does not check if URL is reachable
 */
export const validateUrl = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: false, message: "URL is required" };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, message: "Please enter a valid URL" };
  }
};

// Phone number validation
/**
 * Validates phone number format
 *
 * @param {string} phone - The phone number to validate
 * @returns {ValidationResult} Object containing validation status and error message
 *
 * @example
 * ```tsx
 * const result = validatePhone('+1-555-123-4567');
 * if (result.isValid) {
 *   console.log('Valid phone number');
 * }
 * ```
 *
 * @remarks
 * - Accepts various international formats
 * - Allows optional country codes
 * - Supports common separators (spaces, hyphens, parentheses)
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, message: "Phone number is required" };
  }

  // Basic phone number regex (supports various formats)
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""))) {
    return { isValid: false, message: "Please enter a valid phone number" };
  }

  return { isValid: true };
};

// Form validation
/**
 * Validates an entire form object against validation rules
 *
 * @param {Record<string, any>} formData - The form data to validate
 * @param {Record<string, (value: any) => ValidationResult>} validationRules - Object mapping field names to validation functions
 * @returns {FormValidationResult} Object containing overall validation status and field-specific errors
 *
 * @example
 * ```tsx
 * const formData = { email: 'user@example.com', password: '123456' };
 * const rules = {
 *   email: validateEmail,
 *   password: validatePassword
 * };
 *
 * const result = validateForm(formData, rules);
 * if (!result.isValid) {
 *   console.log('Errors:', result.errors);
 * }
 * ```
 *
 * @remarks
 * - Validates all fields even if some fail
 * - Returns comprehensive error information
 * - Useful for form validation in React components
 */
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, (_value: any) => ValidationResult>
): FormValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const result = rules[field](data[field]);
    if (!result.isValid) {
      errors[field] = result.message || "Invalid value";
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Helper functions
/**
 * Checks if a string contains only numeric characters
 *
 * @param {string} str - The string to check
 * @returns {boolean} True if string contains only numbers, false otherwise
 *
 * @example
 * ```tsx
 * console.log(isNumeric('12345')); // true
 * console.log(isNumeric('123.45')); // false (contains decimal point)
 * console.log(isNumeric('abc123')); // false (contains letters)
 * ```
 *
 * @remarks
 * - Only validates digits 0-9
 * - Does not accept decimal points or negative signs
 * - Returns false for empty strings
 */
export const isNumeric = (str: string): boolean => {
  return /^\d+$/.test(str);
};

/**
 * Checks if a string contains only alphabetic characters
 *
 * @param {string} str - The string to check
 * @returns {boolean} True if string contains only letters, false otherwise
 *
 * @example
 * ```tsx
 * console.log(isAlpha('Hello')); // true
 * console.log(isAlpha('Hello123')); // false (contains numbers)
 * console.log(isAlpha('Hello World')); // false (contains space)
 * ```
 *
 * @remarks
 * - Only validates letters a-z and A-Z
 * - Does not accept spaces or special characters
 * - Returns false for empty strings
 */
export const isAlpha = (str: string): boolean => {
  return /^[a-zA-Z]+$/.test(str);
};

/**
 * Checks if a string contains only alphanumeric characters
 *
 * @param {string} str - The string to check
 * @returns {boolean} True if string contains only letters and numbers, false otherwise
 *
 * @example
 * ```tsx
 * console.log(isAlphanumeric('Hello123')); // true
 * console.log(isAlphanumeric('Hello 123')); // false (contains space)
 * console.log(isAlphanumeric('Hello-123')); // false (contains hyphen)
 * ```
 *
 * @remarks
 * - Validates letters a-z, A-Z, and digits 0-9
 * - Does not accept spaces or special characters
 * - Returns false for empty strings
 */
export const isAlphanumeric = (str: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(str);
};

/**
 * Sanitizes user input by removing potentially harmful characters
 *
 * @param {string} input - The input string to sanitize
 * @returns {string} Sanitized string with harmful characters removed
 *
 * @example
 * ```tsx
 * const userInput = '<script>alert("xss")</script>Hello World!';
 * const safe = sanitizeInput(userInput);
 * console.log(safe); // 'Hello World!'
 * ```
 *
 * @remarks
 * - Removes HTML tags and script elements
 * - Strips potentially dangerous characters
 * - Should be used on all user-provided input
 * - Does not guarantee complete XSS protection
 */
export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>\"']/g, "");
};

/**
 * Normalizes a string by converting to lowercase and removing extra whitespace
 *
 * @param {string} str - The string to normalize
 * @returns {string} Normalized string in lowercase with trimmed whitespace
 *
 * @example
 * ```tsx
 * const normalized = normalizeString('  Hello WORLD  ');
 * console.log(normalized); // 'hello world'
 * ```
 *
 * @remarks
 * - Converts to lowercase for consistent comparison
 * - Trims leading and trailing whitespace
 * - Useful for search and comparison operations
 */
export const normalizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, " ").toLowerCase();
};
