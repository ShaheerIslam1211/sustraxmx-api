import { EmissionDataField } from "../types";
import {
  EmissionFactor,
  shouldFieldBeVisible,
  getFieldOptions,
} from "../lib/firebase/emission-factors-service";
import { formStore } from "../stores/FormStore";
import { getFieldTypeConfig, validateFieldValue } from "../lib/fieldTypes";

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

  // Enhanced form clearing methods
  clearFormOnly(): void {
    this.store.getState().clearFormOnly();
  }

  clearFormAndResetCategory(): void {
    this.store.getState().clearFormAndResetCategory();
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

  // Enhanced validation using the new field type system
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

    // Skip validation for empty optional fields
    if (!value && field.s_r === false) {
      return { isValid: true };
    }

    // Get field type configuration
    const fieldConfig = getFieldTypeConfig(field.name, field.title);

    // Use the new validation system
    const validation = validateFieldValue(value, fieldConfig, field.name);

    return validation;
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
