/**
 * Components Barrel Export
 *
 * This file provides a centralized export point for all components,
 * implementing modern folder structure patterns and making imports cleaner.
 */

// Layout Components
export { Sidebar } from "./layout/Sidebar";
export { Header } from "./layout/Header";
export { default as CommonLayout } from "./commonLayout";

// Auth Components
export { default as LoginForm } from "./auth/LoginForm";
export { default as SignUpForm } from "./auth/SignupForm";
export { SSO } from "./auth/SSO";

// Common Components
export { UserAuthInputs, CustomInput, SingleInput } from "./common/formInputs";
export { Logo } from "./common/Logo/logo";
export { default as ThemeToggle } from "./common/ThemeToggle";
export { default as AntdSpin } from "./common/antdSpin";
export { default as CustomAntdDropdown } from "./common/customAntdDropdown";
export { default as CustomInputs } from "./common/customInputs";
export { default as CustomTab } from "./common/customTabs/CustomTab";
export { default as ErrorBoundary } from "./common/ErrorBoundary";

// Feature Components
export { default as ApiDetails } from "./apiDetails";
export { default as AuthorizationBlock } from "./authorizationBlock";
export { default as ContactUs } from "./contactUs";
export { default as LanguageSelector } from "./languageSelector";
export { default as UserProfile } from "./userProfile";

// Dynamic Form Components (Removed - replaced by new forms architecture)

// Other Components
export { default as TickButton } from "./other/TickButton";

// Debug Components
export { default as FirebaseDebugger } from "./debug/FirebaseDebugger";

// Modern UI Components
export * from "./ui";

// Modern Layout Components
export * from "./layout/AppLayout";

// Re-export types
export type { SidebarProps } from "./layout/Sidebar";
