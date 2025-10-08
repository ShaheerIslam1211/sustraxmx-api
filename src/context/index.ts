/**
 * Context Barrel Export
 * 
 * This file centralizes all context exports for easier importing.
 * Import contexts like: import { AuthProvider, useAuth } from '@/context'
 */

// Auth Context
export { AuthContext, AuthProvider, useAuth } from './AuthContext';

// API Data Context
export { ApiDataProvider, useApiData } from './ApiDataContext';
export { default as ApiDataContext } from './ApiDataContext';

// Dynamic Form Context
export { DynamicFormProvider, useDynamicForm } from './DynamicFormContext';
export { default as DynamicFormContext } from './DynamicFormContext';

// Emission Data Context
export { EmissionDataProvider, useEmissionData } from './EmissionDataContext';
export { default as EmissionDataContext } from './EmissionDataContext';

// Re-export types if any are defined in the future
export type * from './AuthContext';
export type * from './ApiDataContext';
export type * from './DynamicFormContext';
export type * from './EmissionDataContext';