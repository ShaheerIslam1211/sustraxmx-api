import { EmissionDataField } from "../types";
import {
  EmissionFactor,
  shouldFieldBeVisible,
  getFieldOptions,
} from "../lib/firebase/emission-factors-service";
import { formStore } from "../stores/FormStore";

export class FormService {
  private static instance: FormService;
  private store = formStore;

  static getInstance(): FormService {
    if (!FormService.instance) {
      FormService.instance = new FormService();
    }
    return FormService.instance;
  }

  // Category management
  switchCategory(category: string): void {
    this.store.getState().setCurrentCategory(category);
  }

  // Field management
  updateField(fieldName: string, value: any): void {
    this.store.getState().setFormValue(fieldName, value);
  }

  clearField(fieldName: string): void {
    this.store.getState().clearField(fieldName);
  }

  clearForm(): void {
    this.store.getState().clearForm();
  }

  // Validation
  validateField(
    field: EmissionDataField,
    value: any
  ): { isValid: boolean; error?: string } {
    if (!field.name) {
      return { isValid: false, error: "Field name is required" };
    }

    // Required field validation
    if (field.s_r !== false && (!value || value === "")) {
      return { isValid: false, error: `${field.title} is required` };
    }

    // Type-specific validation
    if (value && field.name.toLowerCase().includes("date")) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return { isValid: false, error: "Please enter a valid date" };
      }
    }

    if (value && field.name.toLowerCase().includes("amount")) {
      const num = Number(value);
      if (isNaN(num) || num < 0) {
        return {
          isValid: false,
          error: "Please enter a valid positive number",
        };
      }
    }

    return { isValid: true };
  }

  // Field visibility
  async isFieldVisible(
    fieldName: string,
    currentValues: Record<string, any>
  ): Promise<boolean> {
    const { emissionFactors } = this.store.getState();
    return shouldFieldBeVisible(fieldName, currentValues, emissionFactors);
  }

  // Field options
  async getFieldOptions(
    fieldName: string,
    currentValues: Record<string, any>
  ): Promise<string[]> {
    const { emissionFactors } = this.store.getState();
    return getFieldOptions(fieldName, currentValues, emissionFactors);
  }

  // Form submission
  async submitForm(
    onSubmit: (values: Record<string, any>) => Promise<void>
  ): Promise<void> {
    const { setSubmitting, setError, getFormData, isFormValid } =
      this.store.getState();

    if (!isFormValid()) {
      setError("Please fix all validation errors before submitting");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formData = getFormData();
      await onSubmit(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Submission failed");
      throw error;
    } finally {
      setSubmitting(false);
    }
  }

  // Data loading
  async loadEmissionData(): Promise<void> {
    const { setLoading, setError, setEmissionData, setEmissionFactors } =
      this.store.getState();

    try {
      setLoading(true);
      setError(null);

      // Import dynamically to avoid circular dependencies
      const { getDynamicFormsData } = await import(
        "../lib/firebase/client-forms-service"
      );
      const { getAllEmissionFactors } = await import(
        "../lib/firebase/emission-factors-service"
      );

      const [data, factors] = await Promise.all([
        getDynamicFormsData(),
        getAllEmissionFactors(),
      ]);

      setEmissionData(data);
      setEmissionFactors(factors);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load form data"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Get current form state
  getCurrentState() {
    return this.store.getState();
  }

  // Subscribe to store changes
  subscribe(listener: () => void) {
    return this.store.subscribe(listener);
  }
}

// Export singleton instance
export const formService = FormService.getInstance();
