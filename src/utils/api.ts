/**
 * API Utilities
 *
 * This file contains all API-related utility functions and configurations.
 * It provides a centralized way to handle API calls, error handling, and response processing.
 */

import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import { API_CONFIG, HTTP_STATUS } from "./constants";

// Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface RequestConfig extends AxiosRequestConfig {
  retries?: number;
}

// Extend the axios config type to include our custom properties
declare module "axios" {
  // eslint-disable-next-line no-unused-vars
  interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

// Create axios instance with default configuration
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor for auth token
  instance.interceptors.request.use(
    config => {
      const token = localStorage.getItem("auth_token");
      if (token && !config.skipAuth) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    error => {
      const apiError: ApiError = {
        message:
          error.response?.data?.message || error.message || "An error occurred",
        status: error.response?.status || 500,
        code: error.response?.data?.code,
      };
      return Promise.reject(apiError);
    }
  );

  return instance;
};

// API instance
export const apiClient = createApiInstance();

// Generic API methods
export const api = {
  /**
   * GET request
   */
  get: async <T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await apiClient.get(url, config);
    return {
      data: response.data,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
    };
  },

  /**
   * POST request
   */
  post: async <T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await apiClient.post(url, data, config);
    return {
      data: response.data,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
    };
  },

  /**
   * PUT request
   */
  put: async <T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await apiClient.put(url, data, config);
    return {
      data: response.data,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
    };
  },

  /**
   * DELETE request
   */
  delete: async <T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await apiClient.delete(url, config);
    return {
      data: response.data,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
    };
  },

  /**
   * PATCH request
   */
  patch: async <T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await apiClient.patch(url, data, config);
    return {
      data: response.data,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
    };
  },
};

// Utility functions
export const apiUtils = {
  /**
   * Check if error is a network error
   */
  isNetworkError: (error: ApiError): boolean => {
    return !error.status || error.status === 0;
  },

  /**
   * Check if error is a client error (4xx)
   */
  isClientError: (error: ApiError): boolean => {
    return error.status >= 400 && error.status < 500;
  },

  /**
   * Check if error is a server error (5xx)
   */
  isServerError: (error: ApiError): boolean => {
    return error.status >= 500;
  },

  /**
   * Check if user is unauthorized
   */
  isUnauthorized: (error: ApiError): boolean => {
    return error.status === HTTP_STATUS.UNAUTHORIZED;
  },

  /**
   * Format error message for display
   */
  formatErrorMessage: (error: ApiError): string => {
    if (apiUtils.isNetworkError(error)) {
      return "Network error. Please check your connection.";
    }
    if (apiUtils.isServerError(error)) {
      return "Server error. Please try again later.";
    }
    return error.message;
  },
};
