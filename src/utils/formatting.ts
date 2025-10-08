/**
 * Formatting Utilities
 *
 * This file contains all formatting functions used throughout the application.
 * Centralizing formatting logic ensures consistency and reusability.
 */

// Date formatting
export const formatDate = (
  date: Date | string,
  format: "short" | "long" | "iso" = "short"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  switch (format) {
    case "short":
      return dateObj.toLocaleDateString();
    case "long":
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "iso":
      return dateObj.toISOString().split("T")[0];
    default:
      return dateObj.toLocaleDateString();
  }
};

// Time formatting
export const formatTime = (
  date: Date | string,
  includeSeconds: boolean = false
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid Time";
  }

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    ...(includeSeconds && { second: "2-digit" }),
  };

  return dateObj.toLocaleTimeString("en-US", options);
};

// DateTime formatting
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid DateTime";
  }

  return `${formatDate(dateObj, "short")} ${formatTime(dateObj)}`;
};

// Number formatting
export const formatNumber = (
  number: number,
  options: {
    decimals?: number;
    thousandsSeparator?: boolean;
    prefix?: string;
    suffix?: string;
  } = {}
): string => {
  const {
    decimals = 2,
    thousandsSeparator = true,
    prefix = "",
    suffix = "",
  } = options;

  if (isNaN(number)) {
    return "Invalid Number";
  }

  let formatted = number.toFixed(decimals);

  if (thousandsSeparator) {
    const parts = formatted.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    formatted = parts.join(".");
  }

  return `${prefix}${formatted}${suffix}`;
};

// Currency formatting
export const formatCurrency = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  if (isNaN(amount)) {
    return "Invalid Amount";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Percentage formatting
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  if (isNaN(value)) {
    return "Invalid Percentage";
  }

  return `${(value * 100).toFixed(decimals)}%`;
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (isNaN(bytes) || bytes < 0) {
    return "Invalid Size";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

// Text formatting
export const formatText = {
  /**
   * Capitalize first letter of each word
   */
  titleCase: (text: string): string => {
    return text.replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  /**
   * Capitalize first letter only
   */
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  /**
   * Convert to camelCase
   */
  camelCase: (text: string): string => {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, "");
  },

  /**
   * Convert to kebab-case
   */
  kebabCase: (text: string): string => {
    return text
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/\s+/g, "-")
      .toLowerCase();
  },

  /**
   * Convert to snake_case
   */
  snakeCase: (text: string): string => {
    return text
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .replace(/\s+/g, "_")
      .toLowerCase();
  },

  /**
   * Truncate text with ellipsis
   */
  truncate: (
    text: string,
    maxLength: number,
    suffix: string = "..."
  ): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - suffix.length) + suffix;
  },

  /**
   * Remove extra whitespace
   */
  cleanWhitespace: (text: string): string => {
    return text.replace(/\s+/g, " ").trim();
  },
};

// Phone number formatting
export const formatPhoneNumber = (
  phoneNumber: string,
  format: "us" | "international" = "us"
): string => {
  const cleaned = phoneNumber.replace(/\D/g, "");

  if (format === "us" && cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  if (format === "international" && cleaned.length >= 10) {
    const countryCode = cleaned.slice(0, -10);
    const areaCode = cleaned.slice(-10, -7);
    const firstPart = cleaned.slice(-7, -4);
    const secondPart = cleaned.slice(-4);

    return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
  }

  return phoneNumber; // Return original if can't format
};

// URL formatting
export const formatUrl = (url: string): string => {
  if (!url) return "";

  // Add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }

  return url;
};

// JSON formatting for display
export const formatJson = (obj: any, indent: number = 2): string => {
  try {
    return JSON.stringify(obj, null, indent);
  } catch {
    return "Invalid JSON";
  }
};
