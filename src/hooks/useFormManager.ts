import { useEffect, useCallback, useRef } from "react";
import { useFormStore, formSelectors } from "../stores/FormStore";
import { formService } from "../services/FormService";
import { EmissionDataField } from "../types";

interface UseFormManagerOptions {
  category?: string;
  onFieldChange?: (fieldName: string, value: any) => void;
  onFormSubmit?: (values: Record<string, any>) => void;
  onCategoryChange?: (category: string) => void;
}

export const useFormManager = (options: UseFormManagerOptions = {}) => {
  const { category, onFieldChange, onFormSubmit, onCategoryChange } = options;

  const store = useFormStore();
  const prevCategoryRef = useRef<string>("");
  const isInitializedRef = useRef(false);

  // Initialize form service
  useEffect(() => {
    if (!isInitializedRef.current) {
      formService.loadEmissionData().catch(console.error);
      isInitializedRef.current = true;
    }
  }, []);

  // Handle category changes
  useEffect(() => {
    if (category && category !== prevCategoryRef.current) {
      prevCategoryRef.current = category;
      formService.switchCategory(category);
      onCategoryChange?.(category);
    }
  }, [category, onCategoryChange]);

  // Field change handler with enhanced validation
  const handleFieldChange = useCallback(
    (fieldName: string, value: any, error?: string) => {
      // Update the field value
      formService.updateField(fieldName, value);

      // Set error if provided
      if (error) {
        // You might want to add error handling to the store
        console.warn(`Field ${fieldName} validation error:`, error);
      }

      onFieldChange?.(fieldName, value);
    },
    [onFieldChange]
  );

  // Form submission handler
  const handleFormSubmit = useCallback(
    async (values: Record<string, any>) => {
      try {
        await formService.submitForm(async formData => {
          onFormSubmit?.(formData);
        });
      } catch (error) {
        console.error("Form submission failed:", error);
      }
    },
    [onFormSubmit]
  );

  // Clear form
  const clearForm = useCallback(() => {
    formService.clearForm();
  }, []);

  // Clear form only (keep category)
  const clearFormOnly = useCallback(() => {
    formService.clearFormOnly();
  }, []);

  // Clear form and reset category
  const clearFormAndResetCategory = useCallback(() => {
    formService.clearFormAndResetCategory();
  }, []);

  // Clear specific field
  const clearField = useCallback((fieldName: string) => {
    formService.clearField(fieldName);
  }, []);

  // Get field value
  const getFieldValue = useCallback(
    (fieldName: string) => {
      return store.getFieldValue(fieldName);
    },
    [store]
  );

  // Get field error
  const getFieldError = useCallback(
    (fieldName: string) => {
      return store.getFieldError(fieldName);
    },
    [store]
  );

  // Check if field is touched
  const isFieldTouched = useCallback(
    (fieldName: string) => {
      return store.isFieldTouched(fieldName);
    },
    [store]
  );

  // Get form data
  const getFormData = useCallback(() => {
    return store.getFormData();
  }, [store]);

  // Check if form is valid
  const isFormValid = useCallback(() => {
    return store.isFormValid();
  }, [store]);

  // Get current category fields
  const getCurrentFields = useCallback((): EmissionDataField[] => {
    const { emissionData, currentCategory } = store;
    if (!emissionData || !currentCategory || !emissionData[currentCategory]) {
      return [];
    }
    return emissionData[currentCategory].texts || [];
  }, [store]);

  // Get available categories
  const getAvailableCategories = useCallback(() => {
    const { emissionData } = store;
    if (!emissionData) return [];
    return Object.keys(emissionData);
  }, [store]);

  return {
    // State
    currentCategory: store.currentCategory,
    formValues: store.formValues,
    isLoading: store.isLoading,
    isSubmitting: store.isSubmitting,
    error: store.error,
    emissionData: store.emissionData,
    emissionFactors: store.emissionFactors,

    // Actions
    handleFieldChange,
    handleFormSubmit,
    clearForm,
    clearFormOnly,
    clearFormAndResetCategory,
    clearField,

    // Getters
    getFieldValue,
    getFieldError,
    isFieldTouched,
    getFormData,
    isFormValid,
    getCurrentFields,
    getAvailableCategories,
  };
};
