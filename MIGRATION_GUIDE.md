# 🔄 Migration Guide - SustraxMX API Playground

## 📋 Overview

This guide helps you migrate from the legacy architecture to the new, refactored architecture. The migration maintains backward compatibility while providing significant improvements in maintainability, performance, and developer experience.

## 🎯 Migration Benefits

- **Improved Performance**: Optimized bundle size and loading times
- **Better Developer Experience**: Cleaner code structure and better tooling
- **Enhanced Maintainability**: Modular architecture with clear separation of concerns
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Modern Standards**: Latest Next.js and React best practices

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file with the following variables:

```env
# Application Configuration
NEXT_PUBLIC_APP_NAME=SustraxMX API Playground
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5173
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Feature Flags
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_DEV_MODE=true
NEXT_PUBLIC_SHOW_DEBUG_TOOLS=true
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Server

```bash
pnpm dev
```

## 🔧 Configuration Changes

### Environment Variables

**Before:**

```typescript
const API_URL = "http://localhost:5173";
```

**After:**

```typescript
import { env } from "@/lib/env";
const API_URL = env.API_BASE_URL;
```

### API Configuration

**Before:**

```typescript
const config = {
  baseUrl: "http://localhost:5173",
  timeout: 10000,
};
```

**After:**

```typescript
import { apiConfig } from "@/lib/config";
const config = apiConfig;
```

## 🎨 Component Migration

### Button Component

**Before:**

```tsx
import { Button } from "@/components/common/button";

<Button variant="primary" size="large">
  Click me
</Button>;
```

**After:**

```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="large">
  Click me
</Button>;
```

### Input Component

**Before:**

```tsx
import { CustomInput } from "@/components/common/formInputs";

<CustomInput value={value} onChange={onChange} placeholder="Enter text" />;
```

**After:**

```tsx
import { Input } from "@/components/ui";

<Input
  value={value}
  onChange={onChange}
  placeholder="Enter text"
  variant="outlined"
  size="medium"
/>;
```

### Form Components

**Before:**

```tsx
import { DynamicForm } from "@/components/forms";

<DynamicForm category="fuel" />;
```

**After:**

```tsx
import { DynamicFormV2 } from "@/components/forms";

<DynamicFormV2 categoryKey="fuel" showCategorySelector={true} />;
```

## 🎯 Styling Migration

### CSS Variables

**Before:**

```css
.button {
  background-color: #52c41a;
  color: white;
  padding: 8px 16px;
}
```

**After:**

```css
.button {
  background-color: var(--color-primary-500);
  color: var(--color-text-inverse);
  padding: var(--spacing-2) var(--spacing-4);
}
```

### Tailwind Classes

**Before:**

```tsx
<div className="bg-green-500 text-white p-4 rounded-lg">Content</div>
```

**After:**

```tsx
<div className="bg-primary-500 text-white p-4 rounded-lg">Content</div>
```

## 🔄 State Management Migration

### Context Usage

**Before:**

```tsx
import { useAuth } from "@/context/AuthContext";
import { useApiData } from "@/context/ApiDataContext";
```

**After:**

```tsx
import { useAuth, useApiData } from "@/context";
```

### Custom Hooks

**Before:**

```tsx
const [value, setValue] = useState("");
const [loading, setLoading] = useState(false);
```

**After:**

```tsx
import { useAsync, useLocalStorage } from "@/hooks";

const { data, loading, error } = useAsync(fetchData);
const [value, setValue] = useLocalStorage("key", "");
```

## 🛠️ Utility Functions Migration

### Import Changes

**Before:**

```tsx
import { validateEmail } from "@/utils/validation";
import { formatDate } from "@/utils/formatting";
import { copyToClipboard } from "@/utils/clipboard";
```

**After:**

```tsx
import { validateEmail, formatDate, copyToClipboard } from "@/utils";
```

### Class Name Utility

**Before:**

```tsx
import classNames from "classnames";

const className = classNames("button", {
  "button--primary": isPrimary,
  "button--disabled": isDisabled,
});
```

**After:**

```tsx
import { cn } from "@/utils";

const className = cn("button", {
  "button--primary": isPrimary,
  "button--disabled": isDisabled,
});
```

## 🔧 API Integration Migration

### API Client Usage

**Before:**

```tsx
const response = await fetch("/api/calculate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

**After:**

```tsx
import { apiClient } from "@/lib/api";

const response = await apiClient.post("/api/calculate", data);
```

### Error Handling

**Before:**

```tsx
try {
  const response = await fetch("/api/calculate");
  if (!response.ok) {
    throw new Error("API Error");
  }
} catch (error) {
  console.error(error);
}
```

**After:**

```tsx
import { ErrorHandler } from "@/lib/errors";

const { data, error } = await ErrorHandler.safeExecute(() =>
  apiClient.post("/api/calculate", data)
);

if (error) {
  ErrorHandler.handle(error);
}
```

## 📱 Responsive Design Migration

### Breakpoint Usage

**Before:**

```css
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
}
```

**After:**

```css
@media (max-width: var(--breakpoint-md)) {
  .container {
    padding: var(--spacing-4);
  }
}
```

### Component Responsive Props

**Before:**

```tsx
<Button size="large" className="md:size-medium lg:size-large">
  Button
</Button>
```

**After:**

```tsx
<Button size="large" className="md:size-medium lg:size-large">
  Button
</Button>
```

## 🧪 Testing Migration

### Test Setup

**Before:**

```tsx
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "@/context/AuthContext";
```

**After:**

```tsx
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "@/context";
```

### Component Testing

**Before:**

```tsx
test("renders button", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText("Click me")).toBeInTheDocument();
});
```

**After:**

```tsx
test("renders button", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText("Click me")).toBeInTheDocument();
});
```

## 🚀 Performance Optimizations

### Code Splitting

**Before:**

```tsx
const LazyComponent = React.lazy(() => import("./LazyComponent"));
```

**After:**

```tsx
const LazyComponent = React.lazy(() => import("@/components/LazyComponent"));
```

### Memoization

**Before:**

```tsx
const ExpensiveComponent = ({ data }) => {
  const processedData = useMemo(() => {
    return heavyProcessing(data);
  }, [data]);

  return <div>{processedData}</div>;
};
```

**After:**

```tsx
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return heavyProcessing(data);
  }, [data]);

  return <div>{processedData}</div>;
});
```

## 🔍 Debugging and Development

### Debug Tools

**Before:**

```tsx
if (process.env.NODE_ENV === "development") {
  console.log("Debug info:", data);
}
```

**After:**

```tsx
import { Logger } from "@/lib/logger";

Logger.debug("Debug info:", { data });
```

### Environment Configuration

**Before:**

```tsx
const isDevelopment = process.env.NODE_ENV === "development";
```

**After:**

```tsx
import { env } from "@/lib/env";

const isDevelopment = env.IS_DEVELOPMENT;
```

## 📦 Build and Deployment

### Build Scripts

**Before:**

```bash
npm run build
npm start
```

**After:**

```bash
pnpm build
pnpm start
```

### Environment Variables

**Before:**

```bash
NEXT_PUBLIC_API_URL=http://localhost:5173
```

**After:**

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5173
```

## 🐛 Troubleshooting

### Common Issues

1. **Import Errors**: Make sure to use new import paths
2. **Type Errors**: Update component prop interfaces
3. **Styling Issues**: Use new CSS variables
4. **Environment Variables**: Check variable names and values

### Debug Steps

1. Check console for error messages
2. Verify environment variables are set
3. Ensure all dependencies are installed
4. Run type checking: `pnpm type-check`
5. Run linting: `pnpm lint`

## 📚 Additional Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [Component Documentation](./src/components/README.md)
- [API Documentation](./src/lib/api/README.md)
- [Styling Guide](./src/styles/README.md)

## 🤝 Support

If you encounter issues during migration:

1. Check this migration guide
2. Review the architecture documentation
3. Check the troubleshooting section
4. Create an issue in the repository

---

This migration guide ensures a smooth transition to the new architecture while maintaining all existing functionality and improving the overall development experience.
