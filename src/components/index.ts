/**
 * Components Barrel Export
 *
 * This file provides a centralized export point for all components,
 * implementing modern folder structure patterns and making imports cleaner.
 */

// Layout Components
export { Sidebar } from "./layout/Sidebar/index";
export { Header } from "./layout/Header/index";
export { default as CommonLayout } from "./commonLayout/CommonLayout";

// Auth Components
export { default as LoginForm } from "./auth/LoginForm";
export { default as SignUpForm } from "./auth/SignupForm";
export { SSO } from "./auth/SSO";

// Common Components
export { UserAuthInputs, CustomInput, SingleInput } from "./common/formInputs";
export { Logo } from "./common/Logo/logo";
export { default as ThemeToggle } from "./common/ThemeToggle/ThemeToggle";
export { default as AntdSpin } from "./common/AntdSpin/AntdSpin";
export { default as CustomAntdDropdown } from "./common/CustomAntdDropdown/customAntdDropdown";
export { default as CustomInputs } from "./common/customInputs/customInputs";
export { default as CustomTab } from "./common/CustomTabs/CustomTab";
export { default as ErrorBoundary } from "./common/ErrorBoundary";

// Feature Components
export { default as ApiDetails } from "./apiDetails/apiDetails";
export { default as AuthorizationBlock } from "./authorizationBlock/authorizationBlock";
export { default as ContactUs } from "./contactUs/contactUs";
export { LanguageSelector } from "./languageSelector";
export { default as UserProfile } from "./userProfile/userProfile";

// Dynamic Form Components (Removed - replaced by new forms architecture)

// Other Components
export { TickButton } from "./ui";

// Debug Components (moved to lib/debug)

// Modern UI Components
export * from "./ui";

// Modern Layout Components
export * from "./layout/AppLayout/index";

// Re-export types
export type { SidebarProps } from "./layout/Sidebar/index";
