/**
 * Firebase Services Barrel Export
 * 
 * This file centralizes all Firebase-related exports for easier importing.
 * Import Firebase services like: import { auth, db, loginUser } from '@/lib/firebase'
 */

// Core Firebase configuration and instances
export { app, db, storage, auth, database } from './firebase';

// Authentication services
export { default as loginUser } from './auth.login';
export { default as registerUser } from './auth.register';
export { registerUser as registerUserEnhanced, signInNewUser, sendPasswordResetEmail } from './auth.register.enhanced';
export { signInWithGoogle, handleSignInWithCustomToken } from './auth.google';

// Firebase services
// firebase-service contains server-side code - import directly in API routes
export * from './emission-factors-service';
export * from './contactMessage.firebase';

// Client forms service exports
export { 
  getDynamicFormsData as getClientDynamicFormsData,
  mapBackendResponseToFormData as mapClientBackendResponseToFormData,
  validateFormData as validateClientFormData
} from './client-forms-service';

// Dynamic forms service exports (default exports)
export { 
  getDynamicFormsData,
  mapBackendResponseToFormData,
  validateFormData
} from './dynamic-forms-service';

// Firebase Admin (server-side only) - Import directly from './firebase-admin' in API routes

// Re-export types if any are defined in the future
// firebase-service types - import directly in API routes if needed
export type * from './client-forms-service';
export type * from './dynamic-forms-service';
export type * from './emission-factors-service';