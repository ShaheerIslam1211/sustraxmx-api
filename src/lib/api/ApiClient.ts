/**
 * API Client
 * Centralized HTTP client with error handling, retries, and interceptors
 */

import { API_CONFIG } from "../constants";
import { ErrorHandler, AppError, ErrorCode } from "../errors";

export interface ApiRequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
  code: string;
  data?: any;
}

export class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
    this.defaultTimeout = API_CONFIG.TIMEOUT;
    this.defaultRetries = API_CONFIG.RETRY_ATTEMPTS;
  }

  /**
   * Make HTTP request with error handling and retries
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit & ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      headers = {},
      skipAuth = false,
      ...fetchOptions
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders = await this.buildHeaders(headers, skipAuth);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      const data = await this.parseResponse<T>(response);

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: this.parseHeaders(response.headers),
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof AppError) {
        throw error;
      }

      // Handle network errors and retries
      if (this.shouldRetry(error as Error, retries)) {
        return this.request<T>(endpoint, {
          ...options,
          retries: retries - 1,
        });
      }

      throw ErrorHandler.handle(error as Error, {
        url,
        method: options.method || "GET",
      });
    }
  }

  /**
   * Build request headers
   */
  private async buildHeaders(
    customHeaders: Record<string, string>,
    skipAuth: boolean
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    if (!skipAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Get authentication token
   */
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }

  /**
   * Parse response based on content type
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return response.json();
    }

    if (contentType?.includes("text/")) {
      return response.text() as T;
    }

    return response.blob() as T;
  }

  /**
   * Parse response headers
   */
  private parseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Handle error response
   */
  private async handleErrorResponse(response: Response): Promise<AppError> {
    let errorData: any;
    const contentType = response.headers.get("content-type");

    try {
      if (contentType?.includes("application/json")) {
        errorData = await response.json();
      } else {
        errorData = await response.text();
      }
    } catch {
      errorData = { message: "Unknown error" };
    }

    const errorCode = this.getErrorCode(response.status);
    const message = errorData.message || errorData.error || response.statusText;

    return new AppError(message, errorCode, {
      status: response.status,
      statusText: response.statusText,
      data: errorData,
    });
  }

  /**
   * Map HTTP status to error code
   */
  private getErrorCode(status: number): ErrorCode {
    switch (status) {
      case 400:
        return ErrorCode.API_BAD_REQUEST;
      case 401:
        return ErrorCode.AUTH_REQUIRED;
      case 403:
        return ErrorCode.AUTH_PERMISSION_DENIED;
      case 404:
        return ErrorCode.API_NOT_FOUND;
      case 408:
        return ErrorCode.API_TIMEOUT;
      case 500:
      case 502:
      case 503:
      case 504:
        return ErrorCode.API_SERVER_ERROR;
      default:
        return ErrorCode.API_SERVER_ERROR;
    }
  }

  /**
   * Check if request should be retried
   */
  private shouldRetry(error: Error, retries: number): boolean {
    if (retries <= 0) return false;

    const retryableErrors = ["AbortError", "TypeError", "NetworkError"];

    return retryableErrors.some(
      type => error.name === type || error.message.includes(type)
    );
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
