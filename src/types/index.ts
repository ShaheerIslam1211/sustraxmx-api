// Global type definitions for the application

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export interface EmissionDataField {
  title: string;
  name: string;
  desc?: string;
  s_r?: boolean;
  s_t?: boolean;
  s?: boolean;
  s_e?: boolean;
}

export interface EmissionDataCategory {
  title: string;
  texts: EmissionDataField[];
  ins: string;
}

export interface EmissionData {
  [key: string]: EmissionDataCategory;
}

export interface ApiData {
  title: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  description: string;
  baseUrl: string;
  callRate: string;
  fields: FormField[];
}

export interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  text: string;
  link?: string;
  onClick?: () => void;
}

export interface ResponsiveBreakpoints {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  xxl: boolean;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Navigation types
export interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

// Component props types
export interface PageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface LayoutProps {
  children: React.ReactNode;
}

// Error types
export interface AppError {
  message: string;
  code?: string;
  details?: any;
}