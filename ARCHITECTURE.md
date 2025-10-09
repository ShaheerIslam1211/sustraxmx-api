# 🏗️ SustraxMX API Playground - Architecture Documentation

## 📋 Overview

This document outlines the comprehensive architectural refactoring of the SustraxMX API Playground, a Next.js application built with modern React patterns, TypeScript, and advanced development practices.

## 🎯 Architectural Goals

- **Maintainability**: Clean, organized code structure
- **Scalability**: Architecture that supports future growth
- **Performance**: Optimized for speed and efficiency
- **Developer Experience**: Intuitive development workflow
- **Type Safety**: Full TypeScript implementation
- **Modern Standards**: Latest Next.js and React best practices

## 🏛️ Architecture Overview

### Core Principles

1. **Separation of Concerns**: Clear boundaries between layers
2. **Single Responsibility**: Each module has one clear purpose
3. **Dependency Inversion**: High-level modules don't depend on low-level modules
4. **Open/Closed Principle**: Open for extension, closed for modification
5. **DRY (Don't Repeat Yourself)**: Eliminate code duplication

### Technology Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS + Custom CSS Variables
- **UI Components**: Ant Design + Custom Components
- **State Management**: React Context + Custom Hooks
- **Authentication**: Firebase Auth
- **Package Manager**: pnpm
- **Linting**: ESLint + Prettier

## 📁 Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   ├── auth/                     # Authentication pages
│   ├── form/                     # Form pages
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── providers.tsx                # Context providers
├── components/                   # React Components
│   ├── ui/                       # Reusable UI components
│   │   ├── Button/              # Button component
│   │   ├── Input/               # Input component
│   │   └── index.ts             # Barrel exports
│   ├── forms/                   # Form components
│   │   ├── FormField/           # Form field component
│   │   ├── FormRenderer/        # Form renderer
│   │   └── index.ts             # Barrel exports
│   ├── layout/                  # Layout components
│   │   ├── AppLayout/           # Main app layout
│   │   ├── Header/              # Header component
│   │   ├── Sidebar/             # Sidebar component
│   │   └── Content/             # Content wrapper
│   └── index.ts                 # Main component exports
├── lib/                         # Core utilities and services
│   ├── config/                  # Configuration files
│   │   ├── app.config.ts        # App configuration
│   │   ├── api.config.ts        # API configuration
│   │   ├── ui.config.ts         # UI configuration
│   │   └── index.ts             # Configuration exports
│   ├── errors/                  # Error handling
│   │   ├── AppError.ts          # Custom error classes
│   │   ├── ErrorHandler.ts      # Error handling utilities
│   │   └── index.ts             # Error exports
│   ├── validation/              # Validation utilities
│   │   ├── validators.ts        # Validation functions
│   │   └── index.ts             # Validation exports
│   ├── api/                     # API client and services
│   │   ├── ApiClient.ts         # HTTP client
│   │   ├── services.ts          # API services
│   │   └── index.ts             # API exports
│   ├── logger/                  # Logging system
│   │   ├── Logger.ts            # Logger implementation
│   │   └── index.ts             # Logger exports
│   ├── firebase/                # Firebase services
│   │   ├── auth/                # Authentication services
│   │   ├── forms/               # Form services
│   │   └── index.ts             # Firebase exports
│   ├── env.ts                   # Environment configuration
│   └── index.ts                 # Main library exports
├── hooks/                       # Custom React hooks
│   ├── useAsync.ts              # Async operation hook
│   ├── useDebounce.ts           # Debounced values hook
│   ├── useFormManager.ts        # Form management hook
│   ├── useLocalStorage.ts       # Local storage hook
│   └── index.ts                 # Hook exports
├── context/                     # React Context providers
│   ├── AuthContext.tsx          # Authentication context
│   ├── ApiDataContext.tsx      # API data context
│   ├── EmissionDataContext.tsx  # Emission data context
│   └── index.ts                 # Context exports
├── utils/                       # Utility functions
│   ├── api.ts                   # API utilities
│   ├── clipboard.ts             # Clipboard utilities
│   ├── formatting.ts             # Formatting utilities
│   ├── validation.ts             # Validation utilities
│   ├── cn.ts                    # Class name utility
│   └── index.ts                 # Utility exports
├── types/                       # TypeScript type definitions
│   └── index.ts                 # Type exports
├── styles/                      # Global styles
│   ├── variables.css            # CSS variables
│   ├── design-system.css        # Design system
│   ├── components.css           # Component styles
│   └── globals.css              # Global styles
└── stores/                      # State management
    ├── FormStore.ts             # Form state store
    └── index.ts                 # Store exports
```

## 🔧 Configuration System

### Environment Configuration

The application uses a centralized environment configuration system:

```typescript
// src/lib/env.ts
export const env = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "SustraxMX API Playground",
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5173",
  FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  // ... other environment variables
};
```

### Configuration Files

- **`app.config.ts`**: Application settings and feature flags
- **`api.config.ts`**: API endpoints and configuration
- **`ui.config.ts`**: Design tokens and UI configuration

## 🎨 Design System

### CSS Variables

The application uses a comprehensive CSS variable system:

```css
:root {
  --color-primary-500: #52c41a;
  --color-secondary-500: #1890ff;
  --spacing-4: 1rem;
  --radius-lg: 0.5rem;
  /* ... more variables */
}
```

### Component Architecture

All components follow a consistent structure:

```typescript
// Component structure
export interface ComponentProps {
  // Props definition
}

export const Component: React.FC<ComponentProps> = ({
  // Destructured props
}) => {
  // Component logic
  return (
    // JSX
  );
};

export default Component;
```

## 🔄 State Management

### Context Pattern

Global state is managed using React Context:

```typescript
// Context definition
interface ContextType {
  // State
  // Actions
}

const Context = createContext<ContextType | undefined>(undefined);

export const Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Context implementation
};

export const useContext = (): ContextType => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useContext must be used within Provider");
  }
  return context;
};
```

### Custom Hooks

Reusable stateful logic is encapsulated in custom hooks:

```typescript
export const useCustomHook = (options: HookOptions = {}) => {
  // Hook implementation
  return {
    // Return values
  };
};
```

## 🚀 Performance Optimizations

### Code Splitting

- Dynamic imports for large components
- Route-based code splitting with Next.js App Router
- Lazy loading of non-critical components

### Bundle Optimization

- Tree shaking for unused code
- Optimized imports and exports
- Minimal dependencies

### Caching Strategy

- Static generation where possible
- Client-side caching for API responses
- Optimized re-rendering with React.memo

## 🔒 Security Considerations

### Input Validation

All user inputs are validated using centralized validation utilities:

```typescript
export const validateInput = (
  value: any,
  rules: ValidationRules
): ValidationResult => {
  // Validation logic
};
```

### Error Handling

Comprehensive error handling with custom error classes:

```typescript
export class AppError extends Error {
  constructor(message: string, code: ErrorCode, context: ErrorContext = {}) {
    super(message);
    this.code = code;
    this.context = context;
  }
}
```

## 📱 Responsive Design

### Breakpoint System

```typescript
export const breakpoints = {
  xs: "480px",
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  xxl: "1600px",
} as const;
```

### Mobile-First Approach

All components are designed mobile-first with progressive enhancement.

## 🧪 Testing Strategy

### Component Testing

- Unit tests for utility functions
- Integration tests for API services
- Component testing with React Testing Library

### E2E Testing

- End-to-end testing for critical user flows
- API integration testing
- Cross-browser compatibility testing

## 🚀 Deployment

### Build Process

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start

# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format
```

### Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5173
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other variables
```

## 🔄 Migration Guide

### From Legacy Architecture

1. **Update Imports**: Use new barrel exports
2. **Environment Variables**: Replace hardcoded URLs
3. **Component Usage**: Use new component APIs
4. **Styling**: Use new CSS variables

### Breaking Changes

- Component prop interfaces have been updated
- Some utility functions have been moved
- CSS class names have been standardized

## 📈 Future Improvements

### Planned Enhancements

1. **Testing**: Comprehensive test suite
2. **Documentation**: Interactive component documentation
3. **Performance**: Advanced optimization techniques
4. **Accessibility**: Enhanced a11y support

### Scalability Considerations

- Micro-frontend architecture for large teams
- Server-side rendering optimizations
- Advanced caching strategies
- Database integration patterns

## 🤝 Contributing

### Development Workflow

1. Create feature branch
2. Implement changes following architecture patterns
3. Add tests for new functionality
4. Update documentation
5. Submit pull request

### Code Standards

- Follow TypeScript best practices
- Use consistent naming conventions
- Add JSDoc comments for complex functions
- Maintain test coverage above 80%

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Ant Design Components](https://ant.design/components/overview/)

---

This architecture provides a solid foundation for building scalable, maintainable React applications with Next.js. The modular design allows for easy extension and modification while maintaining code quality and performance.
