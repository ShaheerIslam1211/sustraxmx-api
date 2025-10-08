// Server-side only service for API routes
// This service should use Firebase Admin SDK for server-side operations

import { EmissionData } from "../../types";

/**
 * Get forms data (server-side only)
 * Note: This service should be updated to use Firebase Admin SDK for production
 */
export async function getDynamicFormsData(): Promise<EmissionData> {
  try {
    // Only attempt on server-side
    if (typeof window !== "undefined") {
      throw new Error(
        "Server-side service called on client-side. Use client-forms-service instead."
      );
    }

    // TODO: Implement Firebase Admin SDK for server-side operations
    // For now, throw an error to indicate this needs proper implementation
    throw new Error(
      "Server-side Firebase Admin SDK not implemented. Please use client-side service or implement Firebase Admin SDK."
    );
  } catch (error) {
    console.error("❌ Error in server forms service:", error);
    throw error;
  }
}

/**
 * Validate form data against category requirements
 */
export function validateFormData(
  category: string,
  data: Record<string, any>,
  emissionData: EmissionData
): {
  isValid: boolean;
  errors: string[];
  requiredFields: string[];
} {
  const errors: string[] = [];
  const categoryData = emissionData[category];

  if (!categoryData) {
    return {
      isValid: false,
      errors: [`Category '${category}' not found`],
      requiredFields: [],
    };
  }

  const requiredFields = categoryData.texts
    .filter(field => field.s_r)
    .map(field => field.name);

  // Check for missing required fields
  const missingFields = requiredFields.filter(
    field =>
      !data.hasOwnProperty(field) ||
      data[field] === null ||
      data[field] === undefined ||
      data[field] === ""
  );

  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(", ")}`);
  }

  // Basic validation for numeric fields (can be enhanced based on field names)
  categoryData.texts.forEach(field => {
    const value = data[field.name];
    if (value !== null && value !== undefined && value !== "") {
      // Check if field name suggests it should be numeric
      if (
        (field.name.includes("amount") ||
          field.name.includes("quantity") ||
          field.name.includes("distance")) &&
        isNaN(Number(value))
      ) {
        errors.push(`Field '${field.name}' must be a number`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    requiredFields,
  };
}

/**
 * Map backend response to form data structure
 */
export function mapBackendResponseToFormData(
  backendResponse: any,
  category: string
): any {
  // If the backend response is already in the correct format, return as-is
  if (backendResponse && typeof backendResponse === "object") {
    return {
      category,
      result: backendResponse,
      timestamp: new Date().toISOString(),
    };
  }

  // Otherwise, wrap the response
  return {
    category,
    result: { data: backendResponse },
    timestamp: new Date().toISOString(),
  };
}
