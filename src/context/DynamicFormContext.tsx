"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { EmissionData, EmissionDataField } from "../types";
import { getDynamicFormsData } from "../lib/firebase/client-forms-service";
import {
  subscribeToFormsUpdates,
  validateFieldValue,
  FieldTypeDefinition as _FieldTypeDefinition,
} from "../lib/firebase/dynamic-forms-service";
import {
  getAllEmissionFactors,
  EmissionFactor,
  getFieldOptions,
  shouldFieldBeVisible,
} from "../lib/firebase/emission-factors-service";

interface FormValidationError {
  field: string;
  message: string;
}

interface DynamicFormContextType {
  emissionData: EmissionData | null;
  emissionFactors: EmissionFactor[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  getCategoryFields: (category: string) => EmissionDataField[];
  getFieldOptions: (
    fieldName: string,
    currentValues: Record<string, any>
  ) => Promise<string[]>;
  shouldFieldBeVisible: (
    fieldName: string,
    currentValues: Record<string, any>
  ) => Promise<boolean>;
  refreshData: () => Promise<void>;
  formValues: Record<string, any>;
  validationErrors: FormValidationError[];
  updateFormValue: (_fieldName: string, _value: any) => void;
  validateField: (
    _fieldName: string,
    _value: any
  ) => { isValid: boolean; error?: string };
  validateForm: () => boolean;
  clearFormValues: () => void;
}

const DynamicFormContext = createContext<DynamicFormContextType | undefined>(
  undefined
);

interface DynamicFormProviderProps {
  children: React.ReactNode;
  initialCategory?: string;
}

export const DynamicFormProvider: React.FC<DynamicFormProviderProps> = ({
  children,
  initialCategory = "",
}) => {
  const [emissionData, setEmissionData] = useState<EmissionData | null>(null);
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<
    FormValidationError[]
  >([]);

  // Use ref to track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const loadData = useCallback(async () => {
    try {
      if (!isMountedRef.current) return;

      setIsLoading(true);
      setError(null);

      // Load both form data and emission factors
      const [data, factors] = await Promise.all([
        getDynamicFormsData(),
        getAllEmissionFactors(),
      ]);

      if (isMountedRef.current) {
        setEmissionData(data);
        setEmissionFactors(factors);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(
          err instanceof Error ? err.message : "Failed to load form data"
        );
        console.error("Error loading dynamic form data:", err);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // Initial data fetch
    loadData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToFormsUpdates(updatedData => {
      if (isMountedRef.current) {
        setEmissionData(updatedData);
        console.log("Forms data updated from Firebase:", updatedData);
      }
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [loadData]);

  const updateFormValue = useCallback((fieldName: string, value: any) => {
    setFormValues(prev => {
      const newValues = { ...prev, [fieldName]: value };

      // Clear validation errors for this field when value changes
      setValidationErrors(prevErrors =>
        prevErrors.filter(error => error.field !== fieldName)
      );

      return newValues;
    });
  }, []);

  const validateField = useCallback(
    (fieldName: string, value: any): { isValid: boolean; error?: string } => {
      return validateFieldValue(fieldName, value);
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    if (!emissionData) return false;

    const errors: FormValidationError[] = [];

    // Validate all form categories
    Object.entries(emissionData).forEach(([_categoryKey, category]) => {
      const fields = category.texts || [];
      fields.forEach((field: EmissionDataField) => {
        const value = formValues[field.name];
        const validation = validateField(field.name, value);

        if (!validation.isValid && validation.error) {
          errors.push({
            field: field.name,
            message: validation.error,
          });
        }
      });
    });

    setValidationErrors(errors);
    return errors.length === 0;
  }, [emissionData, formValues, validateField]);

  const clearFormValues = useCallback(() => {
    setFormValues({});
    setValidationErrors([]);
  }, []);

  const getCategoryFields = (category: string): EmissionDataField[] => {
    if (!emissionData || !emissionData[category]) {
      return [];
    }
    return emissionData[category].texts || [];
  };

  const refreshData = async () => {
    await loadData();
  };

  const getFieldOptionsWrapper = async (
    fieldName: string,
    currentValues: Record<string, any>
  ) => {
    return await getFieldOptions(fieldName, currentValues, emissionFactors);
  };

  const shouldFieldBeVisibleWrapper = async (
    fieldName: string,
    currentValues: Record<string, any>
  ) => {
    return await shouldFieldBeVisible(
      fieldName,
      currentValues,
      emissionFactors
    );
  };

  const value: DynamicFormContextType = {
    emissionData,
    emissionFactors,
    isLoading,
    error,
    selectedCategory,
    setSelectedCategory,
    getCategoryFields,
    getFieldOptions: getFieldOptionsWrapper,
    shouldFieldBeVisible: shouldFieldBeVisibleWrapper,
    refreshData,
    formValues,
    validationErrors,
    updateFormValue,
    validateField,
    validateForm,
    clearFormValues,
  };

  return (
    <DynamicFormContext.Provider value={value}>
      {children}
    </DynamicFormContext.Provider>
  );
};

export const useDynamicForm = (): DynamicFormContextType => {
  const context = useContext(DynamicFormContext);
  if (context === undefined) {
    throw new Error("useDynamicForm must be used within a DynamicFormProvider");
  }
  return context;
};

export default DynamicFormContext;
