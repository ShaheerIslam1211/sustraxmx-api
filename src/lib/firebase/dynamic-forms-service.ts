import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import {
  EmissionData,
  EmissionDataCategory,
  EmissionDataField,
} from "../../types";

/**
 * Interface for Firebase form structure based on jsonformatter.txt
 */
interface FirebaseFormField {
  title: string;
  name: string;
  desc: string;
  s_r?: boolean;
  s_t?: boolean;
  s_e?: boolean;
  s?: boolean;
  ai?: string;
}

interface FirebaseFormCategory {
  title: string;
  texts: FirebaseFormField[];
  ins?: string;
  ai?: string;
}

interface FirebaseFormsData {
  [key: string]: FirebaseFormCategory;
}

// Field type definitions for validation
export interface FieldTypeDefinition {
  type: "string" | "integer" | "datetime" | "boolean" | "select";
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    options?: string[];
  };
}

// Field type mappings based on field names
export const FIELD_TYPE_MAPPINGS: Record<string, FieldTypeDefinition> = {
  type: { type: "string", required: false },
  amount: { type: "integer", required: true, validation: { min: 0 } },
  date: { type: "datetime", required: true },
  category: { type: "string", required: false },
  uom: { type: "string", required: false },
  distance: { type: "integer", required: false, validation: { min: 0 } },
  passengers: { type: "integer", required: false, validation: { min: 1 } },
  units: { type: "integer", required: false, validation: { min: 0 } },
  q1: { type: "select", required: false },
  q2: { type: "select", required: false },
  columntext: { type: "string", required: false },
  level1: { type: "string", required: false },
  level2: { type: "string", required: false },
  level3: { type: "string", required: false },
  level4: { type: "string", required: false },
};

// Firebase collection names
const FIRESTORE_COLLECTIONS = {
  config: "appconfig",
};

// Cache for forms data
let formsCache: FirebaseFormsData | null = null;
let formsCacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Real-time listeners
const formsListeners: Set<(_data: EmissionData) => void> = new Set();

/**
 * Client-side function to get forms config from Firebase with caching
 */
async function getFormsConfig(): Promise<FirebaseFormsData | null> {
  try {
    // Check cache first
    const now = Date.now();
    if (formsCache && now - formsCacheTimestamp < CACHE_DURATION) {
      return formsCache;
    }

    const updateDoc = await getDoc(
      doc(db, FIRESTORE_COLLECTIONS.config, "forms")
    );
    if (updateDoc.exists()) {
      const data = JSON.parse(updateDoc.data().data);
      formsCache = data;
      formsCacheTimestamp = now;
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching forms config:", error);
    throw new Error(
      `Failed to fetch forms configuration: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Subscribe to real-time updates from Firebase
 */
export function subscribeToFormsUpdates(
  callback: (_data: EmissionData) => void
): () => void {
  formsListeners.add(callback);

  const unsubscribe = onSnapshot(
    doc(db, FIRESTORE_COLLECTIONS.config, "forms"),
    doc => {
      if (doc.exists()) {
        try {
          const firebaseData = JSON.parse(doc.data().data);
          formsCache = firebaseData;
          formsCacheTimestamp = Date.now();

          const mappedData = mapFirebaseToEmissionData(firebaseData);

          // Notify all listeners
          formsListeners.forEach(listener => {
            try {
              listener(mappedData);
            } catch (error) {
              console.error("Error in forms update listener:", error);
            }
          });
        } catch (error) {
          console.error("Error parsing forms data:", error);
        }
      }
    },
    error => {
      console.error("Error in forms subscription:", error);
    }
  );

  // Return cleanup function
  return () => {
    formsListeners.delete(callback);
    if (formsListeners.size === 0) {
      unsubscribe();
    }
  };
}

/**
 * Validate field value based on field type definition
 */
export function validateFieldValue(
  fieldName: string,
  value: any,
  customValidation?: FieldTypeDefinition
): { isValid: boolean; error?: string } {
  const fieldType = customValidation || FIELD_TYPE_MAPPINGS[fieldName];

  if (!fieldType) {
    return { isValid: true }; // No validation rules defined
  }

  // Check required fields
  if (
    fieldType.required &&
    (value === undefined || value === null || value === "")
  ) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  // Skip validation for empty optional fields
  if (
    !fieldType.required &&
    (value === undefined || value === null || value === "")
  ) {
    return { isValid: true };
  }

  // Type-specific validation
  switch (fieldType.type) {
    case "integer":
      const numValue = Number(value);
      if (isNaN(numValue) || !Number.isInteger(numValue)) {
        return { isValid: false, error: `${fieldName} must be an integer` };
      }
      if (
        fieldType.validation?.min !== undefined &&
        numValue < fieldType.validation.min
      ) {
        return {
          isValid: false,
          error: `${fieldName} must be at least ${fieldType.validation.min}`,
        };
      }
      if (
        fieldType.validation?.max !== undefined &&
        numValue > fieldType.validation.max
      ) {
        return {
          isValid: false,
          error: `${fieldName} must be at most ${fieldType.validation.max}`,
        };
      }
      break;

    case "datetime":
      const dateValue = new Date(value);
      if (isNaN(dateValue.getTime())) {
        return { isValid: false, error: `${fieldName} must be a valid date` };
      }
      break;

    case "string":
      if (typeof value !== "string") {
        return { isValid: false, error: `${fieldName} must be a string` };
      }
      if (
        fieldType.validation?.pattern &&
        !fieldType.validation.pattern.test(value)
      ) {
        return { isValid: false, error: `${fieldName} format is invalid` };
      }
      break;

    case "select":
      if (
        fieldType.validation?.options &&
        !fieldType.validation.options.includes(value)
      ) {
        return {
          isValid: false,
          error: `${fieldName} must be one of: ${fieldType.validation.options.join(", ")}`,
        };
      }
      break;
  }

  return { isValid: true };
}

/**
 * Maps Firebase form data to the expected EmissionData structure
 * The 'name' field from Firebase is the key and should never change
 * The 'title' field is variable and can be changed
 */
function mapFirebaseToEmissionData(
  firebaseData: FirebaseFormsData
): EmissionData {
  const mappedData: EmissionData = {};

  Object.keys(firebaseData).forEach(categoryKey => {
    const firebaseCategory = firebaseData[categoryKey];

    // Map each field from Firebase structure to EmissionDataField
    const mappedFields: EmissionDataField[] = firebaseCategory.texts.map(
      field => ({
        title: field.title,
        name: field.name, // This is the key that never changes
        desc: field.desc || "",
        s_r: field.s_r || false,
        s_t: field.s_t || false,
        s_e: field.s_e || false,
        s: field.s || false,
      })
    );

    // Create the mapped category
    const mappedCategory: EmissionDataCategory = {
      title: firebaseCategory.title,
      texts: mappedFields,
      ins: firebaseCategory.ins || "",
    };

    mappedData[categoryKey] = mappedCategory;
  });

  return mappedData;
}

/**
 * Handles case sensitivity mapping for backend data
 * Maps uppercase column names to lowercase field names
 */
function mapBackendDataToFormFields(
  backendData: Record<string, any>,
  formFields: EmissionDataField[]
): Record<string, any> {
  const mappedData: Record<string, any> = {};

  formFields.forEach(field => {
    const fieldName = field.name;

    // Try to find the value in backend data with different case variations
    const possibleKeys = [
      fieldName,
      fieldName.toUpperCase(),
      fieldName.toLowerCase(),
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
    ];

    for (const key of possibleKeys) {
      if (backendData[key] !== undefined) {
        mappedData[fieldName] = backendData[key];
        break;
      }
    }

    // Special handling for date fields
    if (fieldName === "date" && !mappedData[fieldName]) {
      // Look for common date field variations
      const dateKeys = ["End date", "END_DATE", "end_date", "Date", "DATE"];
      for (const dateKey of dateKeys) {
        if (backendData[dateKey] !== undefined) {
          mappedData[fieldName] = backendData[dateKey];
          break;
        }
      }
    }
  });

  return mappedData;
}

/**
 * Fetches dynamic forms from Firebase and returns mapped emission data
 */
export async function getDynamicFormsData(): Promise<EmissionData> {
  try {
    const firebaseFormsData = await getFormsConfig();

    if (!firebaseFormsData) {
      throw new Error("No forms data found in Firebase");
    }

    // Map Firebase data to EmissionData structure
    const mappedData = mapFirebaseToEmissionData(firebaseFormsData);

    console.log("Successfully fetched and mapped dynamic forms from Firebase");
    return mappedData;
  } catch (error) {
    console.error("Error fetching dynamic forms:", error);
    throw new Error(
      `Failed to load form configuration from Firebase: ${error instanceof Error ? error.message : "Unknown error"}. Please check your Firebase connection and ensure the forms configuration is properly set up.`
    );
  }
}

/**
 * Maps backend response data to form field structure with case sensitivity handling
 */
export function mapBackendResponseToFormData(
  backendResponse: Record<string, any>,
  categoryKey: string,
  formData: EmissionData
): Record<string, any> {
  if (!formData[categoryKey]) {
    console.warn(`Category ${categoryKey} not found in form data`);
    return backendResponse;
  }

  const formFields = formData[categoryKey].texts;
  return mapBackendDataToFormFields(backendResponse, formFields);
}

/**
 * Validates form data against the dynamic form structure
 */
export function validateFormData(
  formData: Record<string, any>,
  categoryKey: string,
  emissionData: EmissionData
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!emissionData[categoryKey]) {
    errors.push(`Category ${categoryKey} not found`);
    return { isValid: false, errors };
  }

  const requiredFields = emissionData[categoryKey].texts.filter(
    field => field.s_r
  );

  requiredFields.forEach(field => {
    if (!formData[field.name] || formData[field.name] === "") {
      errors.push(`${field.title} is required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

const dynamicFormsService = {
  getDynamicFormsData,
  mapBackendResponseToFormData,
  validateFormData,
};

export default dynamicFormsService;
