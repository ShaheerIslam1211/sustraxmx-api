import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Interface for emission factor data structure
 */
export interface EmissionFactor {
  id: string;
  category?: string;
  type?: string;
  uom?: string;
  unit?: string;
  [key: string]: any;
}

/**
 * Interface for filtering criteria
 */
export interface FilterCriteria {
  [key: string]: string;
}

/**
 * Get all emission factors from Firebase
 */
export async function getAllEmissionFactors(): Promise<EmissionFactor[]> {
  // For development, return mock data directly
  console.log("Returning mock emission factors for development");
  return getMockEmissionFactors();

  // // TODO: Uncomment below when Firebase is properly configured
  // try {
  //   const emissionFactorsRef = collection(db, "emission_factors");
  //   const snapshot = await getDocs(emissionFactorsRef);

  //   const factors: EmissionFactor[] = [];
  //   snapshot.forEach(doc => {
  //     factors.push({
  //       id: doc.id,
  //       ...doc.data(),
  //     } as EmissionFactor);
  //   });

  //   return factors;
  // } catch (error) {
  //   console.error("Error fetching emission factors:", error);
  //   // Return mock data for development
  //   return getMockEmissionFactors();
  // }
}

/**
 * Filter emission factors based on criteria
 */
export function filterFactors(
  factors: EmissionFactor[],
  criteria: FilterCriteria
): EmissionFactor[] {
  return factors.filter(factor => {
    return Object.entries(criteria).every(([key, value]) => {
      if (!value) return true; // Skip empty criteria

      const factorValue = factor[key];
      if (!factorValue) return false;

      return String(factorValue).toLowerCase() === String(value).toLowerCase();
    });
  });
}

/**
 * Get unique values for a specific field from emission factors
 */
export function getUniqueFieldValues(
  factors: EmissionFactor[],
  fieldName: string
): string[] {
  const values = new Set<string>();

  factors.forEach(factor => {
    const value = factor[fieldName];
    if (value && typeof value === "string") {
      values.add(value);
    }
  });

  return Array.from(values).sort();
}

/**
 * Get field options based on current form values
 */
export async function getFieldOptions(
  fieldName: string,
  currentValues: FilterCriteria,
  allFactors?: EmissionFactor[]
): Promise<string[]> {
  try {
    const factors = allFactors || (await getAllEmissionFactors());

    // Create filter criteria excluding the current field
    const filterCriteria = { ...currentValues };
    delete filterCriteria[fieldName];

    // Filter factors based on current selections
    const filteredFactors = filterFactors(factors, filterCriteria);

    // Get unique values for the field
    return getUniqueFieldValues(filteredFactors, fieldName);
  } catch (error) {
    console.error(`Error getting options for field ${fieldName}:`, error);
    return [];
  }
}

/**
 * Check if a field should be visible based on current form values
 */
export async function shouldFieldBeVisible(
  fieldName: string,
  currentValues: FilterCriteria,
  allFactors?: EmissionFactor[]
): Promise<boolean> {
  try {
    const options = await getFieldOptions(fieldName, currentValues, allFactors);
    return options.length > 0;
  } catch (error) {
    console.error(`Error checking visibility for field ${fieldName}:`, error);
    return true; // Default to visible if there's an error
  }
}

/**
 * Mock emission factors for development/testing
 */
function getMockEmissionFactors(): EmissionFactor[] {
  return [
    // {
    //   id: "1",
    //   category: "Natural Gas",
    //   type: "Pipeline Natural Gas",
    //   uom: "cubic meters",
    //   unit: "m³",
    // },
    // {
    //   id: "2",
    //   category: "Diesel",
    //   type: "Automotive Diesel",
    //   uom: "liters",
    //   unit: "L",
    // },
    // {
    //   id: "3",
    //   category: "Gasoline",
    //   type: "Regular Gasoline",
    //   uom: "liters",
    //   unit: "L",
    // },
    // {
    //   id: "4",
    //   category: "Natural Gas",
    //   type: "Compressed Natural Gas",
    //   uom: "therms",
    //   unit: "therms",
    // },
    // {
    //   id: "5",
    //   category: "Diesel",
    //   type: "Marine Diesel",
    //   uom: "gallons",
    //   unit: "gal",
    // },
    // {
    //   id: "6",
    //   category: "Gasoline",
    //   type: "Premium Gasoline",
    //   uom: "liters",
    //   unit: "L",
    // },
    // {
    //   id: "7",
    //   category: "Natural Gas",
    //   type: "Liquefied Natural Gas",
    //   uom: "gallons",
    //   unit: "gal",
    // },
    // {
    //   id: "8",
    //   category: "Diesel",
    //   type: "Biodiesel",
    //   uom: "liters",
    //   unit: "L",
    // },
  ];
}
