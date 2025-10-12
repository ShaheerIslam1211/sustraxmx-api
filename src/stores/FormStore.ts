import React from "react";
import { EmissionDataField, EmissionData } from "../types";
import { EmissionFactor } from "../lib/firebase/emission-factors-service";

interface FormFieldValue {
  value: any;
  isValid: boolean;
  error?: string;
  touched: boolean;
  isDirty: boolean;
}

interface FormState {
  // Core state
  currentCategory: string;
  formValues: Record<string, FormFieldValue>;
  emissionData: EmissionData | null;
  emissionFactors: EmissionFactor[];

  // UI state
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Actions
  setCurrentCategory: (category: string) => void;
  setFormValue: (fieldName: string, value: any) => void;
  setFormValues: (values: Record<string, any>) => void;
  setFieldError: (fieldName: string, error: string | undefined) => void;
  setFieldTouched: (fieldName: string, touched: boolean) => void;
  clearForm: () => void;
  clearFormOnly: () => void;
  clearFormAndResetCategory: () => void;
  clearField: (fieldName: string) => void;

  // Data actions
  setEmissionData: (data: EmissionData | null) => void;
  setEmissionFactors: (factors: EmissionFactor[]) => void;
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;

  // Computed getters
  getFieldValue: (fieldName: string) => any;
  getFieldError: (fieldName: string) => string | undefined;
  isFieldTouched: (fieldName: string) => boolean;
  isFormValid: () => boolean;
  getFormData: () => Record<string, any>;
}

// Simple state management without external dependencies
class FormStore {
  private state: FormState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = {
      currentCategory: "",
      formValues: {},
      emissionData: null,
      emissionFactors: [],
      isLoading: false,
      isSubmitting: false,
      error: null,
      setCurrentCategory: this.setCurrentCategory.bind(this),
      setFormValue: this.setFormValue.bind(this),
      setFormValues: this.setFormValues.bind(this),
      setFieldError: this.setFieldError.bind(this),
      setFieldTouched: this.setFieldTouched.bind(this),
      clearForm: this.clearForm.bind(this),
      clearFormOnly: this.clearFormOnly.bind(this),
      clearFormAndResetCategory: this.clearFormAndResetCategory.bind(this),
      clearField: this.clearField.bind(this),
      setEmissionData: this.setEmissionData.bind(this),
      setEmissionFactors: this.setEmissionFactors.bind(this),
      setLoading: this.setLoading.bind(this),
      setSubmitting: this.setSubmitting.bind(this),
      setError: this.setError.bind(this),
      getFieldValue: this.getFieldValue.bind(this),
      getFieldError: this.getFieldError.bind(this),
      isFieldTouched: this.isFieldTouched.bind(this),
      isFormValid: this.isFormValid.bind(this),
      getFormData: this.getFormData.bind(this),
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  private setState(updater: (state: FormState) => Partial<FormState>) {
    this.state = { ...this.state, ...updater(this.state) };
    this.notifyListeners();
  }

  // Category management
  setCurrentCategory(category: string) {
    this.setState(state => {
      // Clear form when category changes
      if (state.currentCategory !== category) {
        return {
          currentCategory: category,
          formValues: {},
          error: null,
        };
      }
      return { currentCategory: category };
    });
  }

  // Enhanced form clearing with category reset
  clearFormAndResetCategory() {
    this.setState(() => ({
      currentCategory: "",
      formValues: {},
      error: null,
    }));
  }

  // Clear form but keep current category
  clearFormOnly() {
    this.setState(state => ({
      formValues: {},
      error: null,
    }));
  }

  // Form value management
  setFormValue(fieldName: string, value: any) {
    this.setState(state => {
      const currentField = state.formValues[fieldName];
      return {
        formValues: {
          ...state.formValues,
          [fieldName]: {
            value,
            isValid: true, // Will be validated elsewhere
            touched: true,
            isDirty: currentField ? currentField.value !== value : true,
            error: undefined, // Clear error when value changes
          },
        },
      };
    });
  }

  // Set field error
  setFieldError(fieldName: string, error: string | undefined) {
    this.setState(state => {
      const currentField = state.formValues[fieldName];
      if (!currentField) return state;

      return {
        formValues: {
          ...state.formValues,
          [fieldName]: {
            ...currentField,
            error,
            isValid: !error,
          },
        },
      };
    });
  }

  // Set field touched state
  setFieldTouched(fieldName: string, touched: boolean) {
    this.setState(state => {
      const currentField = state.formValues[fieldName];
      if (!currentField) return state;

      return {
        formValues: {
          ...state.formValues,
          [fieldName]: {
            ...currentField,
            touched,
          },
        },
      };
    });
  }

  setFormValues(values: Record<string, any>) {
    this.setState(state => {
      const newFormValues: Record<string, FormFieldValue> = {};
      Object.entries(values).forEach(([key, value]) => {
        const currentField = state.formValues[key];
        newFormValues[key] = {
          value,
          isValid: true,
          touched: true,
          isDirty: currentField ? currentField.value !== value : true,
          error: undefined,
        };
      });
      return { formValues: newFormValues };
    });
  }

  clearForm() {
    this.setState(() => ({ formValues: {}, error: null }));
  }

  clearField(fieldName: string) {
    this.setState(state => {
      const newFormValues = { ...state.formValues };
      delete newFormValues[fieldName];
      return { formValues: newFormValues };
    });
  }

  // Data management
  setEmissionData(data: EmissionData | null) {
    this.setState(() => ({ emissionData: data }));
  }

  setEmissionFactors(factors: EmissionFactor[]) {
    this.setState(() => ({ emissionFactors: factors }));
  }

  setLoading(loading: boolean) {
    this.setState(() => ({ isLoading: loading }));
  }

  setSubmitting(submitting: boolean) {
    this.setState(() => ({ isSubmitting: submitting }));
  }

  setError(error: string | null) {
    this.setState(() => ({ error }));
  }

  // Computed getters
  getFieldValue(fieldName: string) {
    return this.state.formValues[fieldName]?.value;
  }

  getFieldError(fieldName: string) {
    return this.state.formValues[fieldName]?.error;
  }

  isFieldTouched(fieldName: string) {
    return this.state.formValues[fieldName]?.touched || false;
  }

  isFormValid() {
    return Object.values(this.state.formValues).every(field => field.isValid);
  }

  getFormData() {
    const formData: Record<string, any> = {};
    Object.entries(this.state.formValues).forEach(([key, field]) => {
      formData[key] = field.value;
    });
    return formData;
  }

  // React integration
  getState() {
    return this.state;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

// Create singleton instance
const formStore = new FormStore();

// React hook for using the store
export const useFormStore = () => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => {
    const unsubscribe = formStore.subscribe(forceUpdate);
    return () => {
      unsubscribe();
    };
  }, []);

  return formStore.getState();
};

// Export the store instance
export { formStore };

// Selectors for performance optimization
export const formSelectors = {
  currentCategory: (state: FormState) => state.currentCategory,
  formValues: (state: FormState) => state.formValues,
  isLoading: (state: FormState) => state.isLoading,
  isSubmitting: (state: FormState) => state.isSubmitting,
  error: (state: FormState) => state.error,
  emissionData: (state: FormState) => state.emissionData,
  emissionFactors: (state: FormState) => state.emissionFactors,
};
