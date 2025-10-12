/**
 * Field Type Detection and Configuration
 * Systematic approach to determine field types based on field names and properties
 */

export type FieldInputType =
  | "text"
  | "number"
  | "date"
  | "email"
  | "tel"
  | "url";

export interface FieldTypeConfig {
  inputType: FieldInputType;
  isInteger: boolean;
  allowDecimals: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  errorMessage?: string;
}

/**
 * Integer field names that should only accept whole numbers
 */
const INTEGER_FIELD_PATTERNS = [
  // Distance and measurements
  /distance.*km/i,
  /distance/i,
  /weight/i,
  /amount.*kg/i,

  // Counts and quantities
  /number.*passengers/i,
  /passengers/i,
  /number.*workers/i,
  /number.*guest.*nights/i,
  /number.*days.*commuting/i,
  /number.*days/i,
  /number.*weeks/i,
  /number.*hours/i,
  /number.*guests/i,

  // Time-based fields
  /hours.*per.*day/i,
  /days.*per.*week/i,
  /weeks.*per.*year/i,
  /hours.*worked/i,
  /days.*worked/i,
  /weeks.*worked/i,

  // Usage and amounts
  /usage.*kwh/i,
  /waste.*%/i,
  /amount$/i,
  /count/i,
  /quantity/i,
  /total/i,
  /sum/i,

  // Specific field names
  /^distance$/i,
  /^weight$/i,
  /^amount$/i,
  /^passengers$/i,
  /^workers$/i,
  /^guests$/i,
  /^nights$/i,
  /^days$/i,
  /^weeks$/i,
  /^hours$/i,
  /^count$/i,
  /^quantity$/i,
  /^total$/i,
  /^sum$/i,
];

/**
 * Decimal field names that can accept decimal values
 */
const DECIMAL_FIELD_PATTERNS = [
  /amount.*\$/i,
  /price/i,
  /cost/i,
  /rate/i,
  /percentage/i,
  /efficiency/i,
  /consumption/i,
  /emission.*factor/i,
  /factor/i,
];

/**
 * Date field patterns
 */
const DATE_FIELD_PATTERNS = [
  /date/i,
  /time/i,
  /created/i,
  /updated/i,
  /start.*date/i,
  /end.*date/i,
  /from.*date/i,
  /to.*date/i,
  /departure.*date/i,
  /arrival/i,
  /check.*in/i,
  /check.*out/i,
];

/**
 * Email field patterns
 */
const EMAIL_FIELD_PATTERNS = [/email/i, /e-mail/i, /mail/i];

/**
 * Phone field patterns
 */
const PHONE_FIELD_PATTERNS = [
  /phone/i,
  /mobile/i,
  /telephone/i,
  /contact.*number/i,
];

/**
 * URL field patterns
 */
const URL_FIELD_PATTERNS = [/url/i, /website/i, /link/i, /uri/i];

/**
 * Distance unit field names that should accept string input
 */
const DISTANCE_UNIT_FIELD_PATTERNS = [
  /distance.*unit/i,
  /distance.*uom/i,
  /unit.*distance/i,
  /uom.*distance/i,
  /distance.*measure/i,
  /measure.*distance/i,
];

/**
 * Determines the field type configuration based on field name and properties
 */
export function getFieldTypeConfig(
  fieldName: string,
  fieldTitle?: string
): FieldTypeConfig {
  const name = fieldName.toLowerCase();
  const title = fieldTitle?.toLowerCase() || "";
  const combined = `${name} ${title}`;

  // Check for date fields
  if (DATE_FIELD_PATTERNS.some(pattern => pattern.test(combined))) {
    return {
      inputType: "date",
      isInteger: false,
      allowDecimals: false,
      errorMessage: "Please enter a valid date",
    };
  }

  // Check for email fields
  if (EMAIL_FIELD_PATTERNS.some(pattern => pattern.test(combined))) {
    return {
      inputType: "email",
      isInteger: false,
      allowDecimals: false,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMessage: "Please enter a valid email address",
    };
  }

  // Check for phone fields
  if (PHONE_FIELD_PATTERNS.some(pattern => pattern.test(combined))) {
    return {
      inputType: "tel",
      isInteger: false,
      allowDecimals: false,
      pattern: /^[\+]?[1-9][\d]{0,15}$/,
      errorMessage: "Please enter a valid phone number",
    };
  }

  // Check for URL fields
  if (URL_FIELD_PATTERNS.some(pattern => pattern.test(combined))) {
    return {
      inputType: "url",
      isInteger: false,
      allowDecimals: false,
      pattern: /^https?:\/\/.+/,
      errorMessage: "Please enter a valid URL",
    };
  }

  // Check for distance unit fields - treat as simple text
  if (DISTANCE_UNIT_FIELD_PATTERNS.some(pattern => pattern.test(combined))) {
    return {
      inputType: "text",
      isInteger: false,
      allowDecimals: false,
      errorMessage: "Please enter a valid value",
    };
  }

  // Special handling for q1 and q2 fields - treat as text
  if (fieldName === "q1" || fieldName === "q2") {
    console.log(`🔍 Field ${fieldName} detected as TEXT field`);
    return {
      inputType: "text",
      isInteger: false,
      allowDecimals: false,
      errorMessage: "Please enter a valid value",
    };
  }

  // Check for integer fields (strict whole numbers)
  if (INTEGER_FIELD_PATTERNS.some(pattern => pattern.test(combined))) {
    return {
      inputType: "number",
      isInteger: true,
      allowDecimals: false,
      min: 0,
      errorMessage: "Please enter a valid whole number (no decimals allowed)",
    };
  }

  // Check for decimal fields (allow decimals)
  if (DECIMAL_FIELD_PATTERNS.some(pattern => pattern.test(combined))) {
    return {
      inputType: "number",
      isInteger: false,
      allowDecimals: true,
      min: 0,
      errorMessage: "Please enter a valid number",
    };
  }

  // Default to text for all other fields
  return {
    inputType: "text",
    isInteger: false,
    allowDecimals: false,
    errorMessage: "Please enter a valid value",
  };
}

/**
 * Validates a field value based on its type configuration
 */
export function validateFieldValue(
  value: any,
  config: FieldTypeConfig,
  fieldName: string
): { isValid: boolean; error?: string; correctedValue?: string } {
  // Debug logging for q1 field
  if (fieldName === "q1") {
    console.log(`🔍 Validating q1 field:`, { value, config, fieldName });
  }

  // Handle empty values
  if (!value && value !== 0) {
    return { isValid: true, correctedValue: value }; // Let required validation handle empty values
  }

  const stringValue = String(value).trim();

  switch (config.inputType) {
    case "date":
      return validateDateValue(stringValue, fieldName);

    case "email":
      return validateEmailValue(stringValue, config, fieldName);

    case "tel":
      return validatePhoneValue(stringValue, config, fieldName);

    case "url":
      return validateUrlValue(stringValue, config, fieldName);

    case "number":
      return validateNumberValue(stringValue, config, fieldName);

    case "text":
    default:
      return validateTextValue(stringValue, fieldName);
  }
}

/**
 * Validates date values
 */
function validateDateValue(
  value: string,
  fieldName: string
): { isValid: boolean; error?: string; correctedValue?: string } {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: "Please enter a valid date" };
  }
  return { isValid: true, correctedValue: value };
}

/**
 * Validates email values
 */
function validateEmailValue(
  value: string,
  config: FieldTypeConfig,
  fieldName: string
): { isValid: boolean; error?: string; correctedValue?: string } {
  if (config.pattern && !config.pattern.test(value)) {
    return {
      isValid: false,
      error: config.errorMessage || "Please enter a valid email address",
    };
  }
  return { isValid: true, correctedValue: value };
}

/**
 * Validates phone values
 */
function validatePhoneValue(
  value: string,
  config: FieldTypeConfig,
  fieldName: string
): { isValid: boolean; error?: string; correctedValue?: string } {
  if (config.pattern && !config.pattern.test(value)) {
    return {
      isValid: false,
      error: config.errorMessage || "Please enter a valid phone number",
    };
  }
  return { isValid: true, correctedValue: value };
}

/**
 * Validates URL values
 */
function validateUrlValue(
  value: string,
  config: FieldTypeConfig,
  fieldName: string
): { isValid: boolean; error?: string; correctedValue?: string } {
  if (config.pattern && !config.pattern.test(value)) {
    return {
      isValid: false,
      error: config.errorMessage || "Please enter a valid URL",
    };
  }
  return { isValid: true, correctedValue: value };
}

/**
 * Validates number values with integer/decimal restrictions
 * Allows string input but shows appropriate errors for integer fields
 */
function validateNumberValue(
  value: string,
  config: FieldTypeConfig,
  fieldName: string
): { isValid: boolean; error?: string; correctedValue?: string } {
  // Allow empty values
  if (!value || value.trim() === "") {
    return { isValid: true, correctedValue: value };
  }

  // Check if value is a valid number
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return {
      isValid: false,
      error: "Please enter a valid number",
    };
  }

  // For integer fields, check if it's a whole number
  if (config.isInteger && !Number.isInteger(numValue)) {
    return {
      isValid: false,
      error: "Please enter a whole number (no decimals)",
    };
  }

  // Check minimum value
  if (config.min !== undefined && numValue < config.min) {
    return {
      isValid: false,
      error: `Value must be at least ${config.min}`,
    };
  }

  // Check maximum value
  if (config.max !== undefined && numValue > config.max) {
    return {
      isValid: false,
      error: `Value must be no more than ${config.max}`,
    };
  }

  return { isValid: true, correctedValue: numValue.toString() };
}

/**
 * Validates text values
 */
function validateTextValue(
  value: string,
  fieldName: string
): { isValid: boolean; error?: string; correctedValue?: string } {
  // Basic text validation - can be extended as needed
  if (value.length > 1000) {
    return {
      isValid: false,
      error: "Text is too long (maximum 1000 characters)",
      correctedValue: value.substring(0, 1000),
    };
  }
  return { isValid: true, correctedValue: value };
}

/**
 * Gets appropriate placeholder text based on field type configuration
 */
function getPlaceholderText(config: FieldTypeConfig): string {
  switch (config.inputType) {
    case "number":
      if (config.isInteger) {
        return "Enter whole number only";
      }
      return "Enter number (decimals allowed)";

    case "date":
      return "Select date";

    case "email":
      return "Enter email address";

    case "tel":
      return "Enter phone number";

    case "url":
      return "Enter website URL";

    case "text":
    default:
      return "Enter text";
  }
}

/**
 * Gets input props for a field based on its type configuration
 */
export function getInputProps(config: FieldTypeConfig) {
  const baseProps = {
    placeholder: getPlaceholderText(config),
  };

  switch (config.inputType) {
    case "number":
      // Always use text input to allow string input, validation will handle the rest
      return {
        ...baseProps,
        type: "text" as const,
      };

    case "date":
      return {
        ...baseProps,
        type: "date" as const,
      };

    case "email":
      return {
        ...baseProps,
        type: "email" as const,
      };

    case "tel":
      return {
        ...baseProps,
        type: "tel" as const,
      };

    case "url":
      return {
        ...baseProps,
        type: "url" as const,
      };

    case "text":
    default:
      return {
        ...baseProps,
        type: "text" as const,
      };
  }
}
