/**
 * Validation Utilities
 * Comprehensive validation functions for form inputs and data
 */

import { FORM_CONFIG } from "../constants";
import { ValidationError } from "../errors";

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  field?: string;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => ValidationResult;
}

export class Validators {
  /**
   * Validate email format
   */
  static email(value: string): ValidationResult {
    if (!value) {
      return { isValid: false, message: "Email is required" };
    }

    if (!FORM_CONFIG.VALIDATION.EMAIL_REGEX.test(value)) {
      return { isValid: false, message: "Please enter a valid email address" };
    }

    return { isValid: true };
  }

  /**
   * Validate password strength
   */
  static password(value: string): ValidationResult {
    if (!value) {
      return { isValid: false, message: "Password is required" };
    }

    if (value.length < FORM_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH) {
      return {
        isValid: false,
        message: `Password must be at least ${FORM_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH} characters long`,
      };
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      return {
        isValid: false,
        message: "Password must contain at least one uppercase letter",
      };
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(value)) {
      return {
        isValid: false,
        message: "Password must contain at least one lowercase letter",
      };
    }

    // Check for at least one number
    if (!/\d/.test(value)) {
      return {
        isValid: false,
        message: "Password must contain at least one number",
      };
    }

    return { isValid: true };
  }

  /**
   * Validate username
   */
  static username(value: string): ValidationResult {
    if (!value) {
      return { isValid: false, message: "Username is required" };
    }

    if (value.length < FORM_CONFIG.VALIDATION.USERNAME_MIN_LENGTH) {
      return {
        isValid: false,
        message: `Username must be at least ${FORM_CONFIG.VALIDATION.USERNAME_MIN_LENGTH} characters long`,
      };
    }

    // Check for valid characters (alphanumeric and underscore only)
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return {
        isValid: false,
        message: "Username can only contain letters, numbers, and underscores",
      };
    }

    return { isValid: true };
  }

  /**
   * Validate phone number
   */
  static phone(value: string): ValidationResult {
    if (!value) {
      return { isValid: false, message: "Phone number is required" };
    }

    if (!FORM_CONFIG.VALIDATION.PHONE_REGEX.test(value)) {
      return { isValid: false, message: "Please enter a valid phone number" };
    }

    return { isValid: true };
  }

  /**
   * Validate required field
   */
  static required(value: any, fieldName: string = "Field"): ValidationResult {
    if (value === null || value === undefined || value === "") {
      return { isValid: false, message: `${fieldName} is required` };
    }

    return { isValid: true };
  }

  /**
   * Validate string length
   */
  static validateLength(
    value: string,
    min: number,
    max: number,
    fieldName: string = "Field"
  ): ValidationResult {
    if (!value) {
      return { isValid: false, message: `${fieldName} is required` };
    }

    if (value.length < min) {
      return {
        isValid: false,
        message: `${fieldName} must be at least ${min} characters long`,
      };
    }

    if (value.length > max) {
      return {
        isValid: false,
        message: `${fieldName} must be no more than ${max} characters long`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validate number range
   */
  static range(
    value: number,
    min: number,
    max: number,
    fieldName: string = "Field"
  ): ValidationResult {
    if (value === null || value === undefined) {
      return { isValid: false, message: `${fieldName} is required` };
    }

    if (value < min) {
      return {
        isValid: false,
        message: `${fieldName} must be at least ${min}`,
      };
    }

    if (value > max) {
      return {
        isValid: false,
        message: `${fieldName} must be no more than ${max}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validate date
   */
  static date(
    value: string | Date,
    fieldName: string = "Date"
  ): ValidationResult {
    if (!value) {
      return { isValid: false, message: `${fieldName} is required` };
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { isValid: false, message: "Please enter a valid date" };
    }

    // Check if date is not in the future (for most use cases)
    if (date > new Date()) {
      return { isValid: false, message: "Date cannot be in the future" };
    }

    return { isValid: true };
  }

  /**
   * Validate URL
   */
  static url(value: string, fieldName: string = "URL"): ValidationResult {
    if (!value) {
      return { isValid: false, message: `${fieldName} is required` };
    }

    try {
      new URL(value);
      return { isValid: true };
    } catch {
      return { isValid: false, message: "Please enter a valid URL" };
    }
  }

  /**
   * Validate emission amount
   */
  static emissionAmount(
    value: number,
    fieldName: string = "Amount"
  ): ValidationResult {
    if (value === null || value === undefined) {
      return { isValid: false, message: `${fieldName} is required` };
    }

    if (isNaN(value)) {
      return { isValid: false, message: `${fieldName} must be a valid number` };
    }

    if (value < 0) {
      return {
        isValid: false,
        message: `${fieldName} must be a positive number`,
      };
    }

    if (value > 1000000) {
      return {
        isValid: false,
        message: `${fieldName} seems too large. Please verify the value`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validate form data against rules
   */
  static validateForm(
    data: Record<string, any>,
    rules: Record<string, ValidationRule>
  ): ValidationResult[] {
    const errors: ValidationResult[] = [];

    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field];

      // Check required
      if (rule.required && !value) {
        errors.push({
          isValid: false,
          message: `${field} is required`,
          field,
        });
        continue;
      }

      // Skip validation if value is empty and not required
      if (!value && !rule.required) {
        continue;
      }

      // Check min/max length for strings
      if (typeof value === "string") {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push({
            isValid: false,
            message: `${field} must be at least ${rule.minLength} characters long`,
            field,
          });
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push({
            isValid: false,
            message: `${field} must be no more than ${rule.maxLength} characters long`,
            field,
          });
        }
      }

      // Check min/max for numbers
      if (typeof value === "number") {
        if (rule.min !== undefined && value < rule.min) {
          errors.push({
            isValid: false,
            message: `${field} must be at least ${rule.min}`,
            field,
          });
        }
        if (rule.max !== undefined && value > rule.max) {
          errors.push({
            isValid: false,
            message: `${field} must be no more than ${rule.max}`,
            field,
          });
        }
      }

      // Check pattern
      if (
        rule.pattern &&
        typeof value === "string" &&
        !rule.pattern.test(value)
      ) {
        errors.push({
          isValid: false,
          message: `${field} format is invalid`,
          field,
        });
      }

      // Check custom validation
      if (rule.custom) {
        const customResult = rule.custom(value);
        if (!customResult.isValid) {
          errors.push({
            isValid: false,
            message: customResult.message || `${field} is invalid`,
            field,
          });
        }
      }
    }

    return errors;
  }
}
