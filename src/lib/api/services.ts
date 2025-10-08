/**
 * API Services
 * Service layer for API endpoints with proper typing and error handling
 */

import { apiClient, ApiResponse } from "./ApiClient";
import { API_CONFIG } from "../constants";
import { ErrorHandler } from "../errors";

// Types for API responses
export interface CalculationRequest {
  category: string;
  data: Record<string, any>;
}

export interface CalculationResponse {
  success: boolean;
  data: {
    emissions: number;
    unit: string;
    category: string;
    factors: Record<string, any>;
  };
  message?: string;
}

export interface FormDataResponse {
  success: boolean;
  data: Record<string, any>;
  message?: string;
}

export interface FuelCalculationRequest {
  type: string;
  amount: number;
  date: string;
  category?: string;
  uom?: string;
  [key: string]: any;
}

export interface FuelCalculationResponse {
  success: boolean;
  data: {
    emissions: number;
    unit: string;
    fuelType: string;
    amount: number;
  };
  message?: string;
}

/**
 * Emission Calculation Service
 */
export class EmissionCalculationService {
  /**
   * Calculate emissions for a category
   */
  static async calculateEmissions(
    request: CalculationRequest
  ): Promise<CalculationResponse> {
    const { data, error } = await ErrorHandler.safeExecute(() =>
      apiClient.post<CalculationResponse>(
        API_CONFIG.ENDPOINTS.CALCULATE,
        request
      )
    );

    if (error) {
      throw error;
    }

    return data!.data;
  }

  /**
   * Calculate fuel emissions
   */
  static async calculateFuelEmissions(
    request: FuelCalculationRequest
  ): Promise<FuelCalculationResponse> {
    const { data, error } = await ErrorHandler.safeExecute(() =>
      apiClient.post<FuelCalculationResponse>(
        API_CONFIG.ENDPOINTS.FUEL,
        request
      )
    );

    if (error) {
      throw error;
    }

    return data!.data;
  }
}

/**
 * Forms Service
 */
export class FormsService {
  /**
   * Get form configuration
   */
  static async getFormConfig(): Promise<FormDataResponse> {
    const { data, error } = await ErrorHandler.safeExecute(() =>
      apiClient.get<FormDataResponse>(API_CONFIG.ENDPOINTS.FORMS)
    );

    if (error) {
      throw error;
    }

    return data!.data;
  }

  /**
   * Submit form data
   */
  static async submitFormData(
    formData: Record<string, any>
  ): Promise<FormDataResponse> {
    const { data, error } = await ErrorHandler.safeExecute(() =>
      apiClient.post<FormDataResponse>(API_CONFIG.ENDPOINTS.FORMS, formData)
    );

    if (error) {
      throw error;
    }

    return data!.data;
  }
}

/**
 * Debug Service
 */
export class DebugService {
  /**
   * Get Firebase debug information
   */
  static async getFirebaseDebug(): Promise<any> {
    const { data, error } = await ErrorHandler.safeExecute(() =>
      apiClient.get(API_CONFIG.ENDPOINTS.DEBUG)
    );

    if (error) {
      throw error;
    }

    return data!.data;
  }
}

/**
 * Health Check Service
 */
export class HealthCheckService {
  /**
   * Check API health
   */
  static async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const { data, error } = await ErrorHandler.safeExecute(() =>
      apiClient.get<{ status: string; timestamp: string }>("/health")
    );

    if (error) {
      throw error;
    }

    return data!.data;
  }
}
