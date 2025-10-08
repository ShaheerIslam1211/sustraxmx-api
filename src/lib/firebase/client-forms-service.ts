import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import {
  EmissionData,
  EmissionDataCategory,
  EmissionDataField,
} from "../../types";

// Firebase collection names
const FIRESTORE_COLLECTIONS = {
  config: "appconfig",
};

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
}

interface FirebaseFormCategory {
  title: string;
  texts: FirebaseFormField[];
  ins?: string;
}

interface FirebaseFormsData {
  [key: string]: FirebaseFormCategory;
}

/**
 * Get forms configuration from Firebase (client-side only)
 */
async function getFormsConfig() {
  try {
    const updateDoc = await getDoc(
      doc(db, FIRESTORE_COLLECTIONS.config, "forms")
    );
    if (updateDoc.exists()) {
      return JSON.parse(updateDoc.data().data);
    }
    return null;
  } catch (error) {
    console.error("Error fetching forms config:", error);
    return null;
  }
}

/**
 * Maps Firebase form data to the expected EmissionData structure
 * The 'name' field from Firebase is the key and should never change
 * The 'title' field is variable and can be changed
 */
function mapFirebaseToEmissionData(
  firebaseData: FirebaseFormsData
): EmissionData {
  const emissionData: EmissionData = {};

  Object.entries(firebaseData).forEach(([categoryKey, categoryData]) => {
    const mappedFields: EmissionDataField[] = categoryData.texts.map(field => ({
      title: field.title,
      name: field.name,
      desc: field.desc,
      s_r: field.s_r || false,
      s_t: field.s_t || false,
      s_e: field.s_e || false,
      s: field.s || false,
    }));

    const mappedCategory: EmissionDataCategory = {
      title: categoryData.title,
      texts: mappedFields,
      ins: categoryData.ins || "",
    };

    emissionData[categoryKey] = mappedCategory;
  });

  return emissionData;
}

/**
 * Get dynamic forms data from Firebase only (no fallback to static data)
 */
export async function getDynamicFormsData(): Promise<EmissionData> {
  try {
    console.log("Fetching dynamic forms data from Firebase...");
    const firebaseData = await getFormsConfig();

    if (firebaseData) {
      console.log("Successfully fetched data from Firebase:", firebaseData);
      return mapFirebaseToEmissionData(firebaseData);
    } else {
      throw new Error(
        "No form configuration found in Firebase. Please ensure the 'appconfig/forms' document exists and contains valid form data."
      );
    }
  } catch (error) {
    console.error("Error fetching dynamic forms data:", error);
    throw new Error(
      `Failed to load form configuration from Firebase: ${error instanceof Error ? error.message : "Unknown error"}. Please check your Firebase connection and ensure the forms configuration is properly set up.`
    );
  }
}

/**
 * Maps backend response to form data structure
 */
export function mapBackendResponseToFormData(
  backendResponse: Record<string, any>,
  categoryKey: string,
  formData: EmissionData
): Record<string, any> {
  const categoryData = formData[categoryKey];
  if (!categoryData) {
    return backendResponse;
  }

  // Map backend data to form fields structure
  const mappedData: Record<string, any> = {};

  categoryData.texts.forEach(field => {
    if (backendResponse[field.name] !== undefined) {
      mappedData[field.name] = backendResponse[field.name];
    }
  });

  return mappedData;
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
  const categoryData = emissionData[categoryKey];

  if (!categoryData) {
    errors.push(`Category '${categoryKey}' not found`);
    return { isValid: false, errors };
  }

  // Validate required fields
  categoryData.texts.forEach(field => {
    if (field.s_r && (!formData[field.name] || formData[field.name] === "")) {
      errors.push(`${field.title} is required`);
    }
  });

  return { isValid: errors.length === 0, errors };
}

const clientFormsService = {
  getDynamicFormsData,
  mapBackendResponseToFormData,
  validateFormData,
};

export default clientFormsService;
