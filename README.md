# SustraxMX API Playground

An interactive API playground for testing and exploring SustraxMX backend endpoints with modern React architecture and comprehensive developer tools.

## 🚀 Features

- **Interactive API Testing**: Dynamic UI for testing all SustraxMX endpoints
- **Smart Form Generation**: Auto-generated forms based on selected API endpoints
- **Multi-Language Code Generation**: Real-time code snippets (curl, JavaScript, Python)
- **Advanced Response Viewer**: JSON response viewer with syntax highlighting
- **Developer Experience**: Copy-to-clipboard, error handling, and debugging tools
- **Modern UI/UX**: Built with Tailwind CSS and Ant Design components
- **Authentication**: Firebase-based user authentication and authorization
- **Responsive Design**: Mobile-first design with responsive breakpoints
- **Type Safety**: Full TypeScript implementation with strict type checking

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Ant Design
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **State Management**: React Context API
- **Package Manager**: pnpm
- **Linting**: ESLint with custom configuration
- **Code Formatting**: Prettier

## 📋 Prerequisites

- Node.js 18.0.0 or later
- pnpm (recommended) or npm
- Firebase project setup (for authentication features)

## 🚀 Getting Started

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd sustraxmx-api
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Environment Setup:**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Run the development server:**
```bash
pnpm dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Architecture

### Directory Structure

```
sustraxmx-api/
├── public/                     # Static assets
│   ├── images/                 # Image assets
│   ├── favicon.ico            # Site favicon
│   └── manifest.json          # PWA manifest
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── login/             # Authentication pages
│   │   ├── register/          # Registration pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── providers.tsx      # Context providers
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── common/            # Reusable UI components
│   │   ├── forms/             # Form components
│   │   ├── layout/            # Layout components
│   │   └── index.ts           # Barrel exports
│   ├── context/               # React Context providers
│   │   ├── AuthContext.tsx    # Authentication context
│   │   ├── ApiDataContext.tsx # API data management
│   │   └── index.ts           # Barrel exports
│   ├── hooks/                 # Custom React hooks
│   │   ├── useIsMobile.ts     # Mobile detection hook
│   │   ├── useIsIframed.ts    # Iframe detection hook
│   │   └── index.ts           # Barrel exports
│   ├── customHooks/           # Additional custom hooks
│   │   ├── responsive.tsx     # Responsive design hooks
│   │   └── index.ts           # Barrel exports
│   ├── lib/                   # Core utilities and services
│   │   ├── firebase/          # Firebase configuration and services
│   │   ├── config.ts          # App configuration
│   │   ├── countries.ts       # Country data utilities
│   │   ├── errorHandler.ts    # Error handling utilities
│   │   └── index.ts           # Barrel exports
│   ├── utils/                 # Utility functions
│   │   ├── api.ts             # API utilities
│   │   ├── clipboard.ts       # Clipboard operations
│   │   ├── formatting.ts      # Data formatting
│   │   ├── validation.ts      # Input validation
│   │   └── index.ts           # Barrel exports
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts           # Global type exports
│   ├── styles/                # Global styles
│   │   └── globals.css        # Global CSS
│   └── mockData/              # Mock data for development
├── .eslintrc.json             # ESLint configuration
├── .prettierrc                # Prettier configuration
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

### 🏗️ Architecture Patterns

#### Barrel Exports
The project uses barrel exports (`index.ts` files) for clean imports:

```typescript
// Instead of:
import { AuthProvider } from '../context/AuthContext';
import { ApiDataProvider } from '../context/ApiDataContext';

// Use:
import { AuthProvider, ApiDataProvider } from '../context';
```

#### Component Organization
- **Atomic Design**: Components are organized by complexity and reusability
- **Feature-based**: Related components are grouped by feature/domain
- **Separation of Concerns**: Logic, styling, and presentation are clearly separated

#### State Management
- **Context API**: For global state (auth, API data)
- **Local State**: For component-specific state
- **Custom Hooks**: For reusable stateful logic

## 🧭 Navigation Guide

### Key Components

#### Authentication Flow
- `src/components/auth/login/` - Login form and logic
- `src/components/auth/signUp/` - Registration form
- `src/context/AuthContext.tsx` - Authentication state management

#### API Testing Interface
- `src/components/apiDetails/` - API endpoint details and testing
- `src/components/dynamicForm/` - Dynamic form generation
- `src/components/sidebar/` - Navigation sidebar

#### Core Layout
- `src/components/commonLayout/` - Main application layout
- `src/components/header/` - Application header
- `src/app/layout.tsx` - Root layout wrapper

### Development Workflow

#### Adding New Components
1. Create component in appropriate directory
2. Add to barrel export (`index.ts`)
3. Update type definitions if needed
4. Add tests (if applicable)

#### Adding New API Endpoints
1. Update `src/lib/config.ts` with new endpoint
2. Add form configuration in dynamic form system
3. Update mock data if needed
4. Test with API playground interface

#### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use Ant Design components for complex UI elements

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm type-check   # Run TypeScript type checking

# Testing
pnpm test         # Run tests (if configured)
pnpm test:watch   # Run tests in watch mode
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
pnpm build
pnpm start
```

### Environment Variables
Ensure all required environment variables are set in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Maintain consistent formatting with Prettier

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Ant Design Documentation](https://ant.design/docs/react/introduce)
- [Firebase Documentation](https://firebase.google.com/docs)

## 📄 License

[MIT](LICENSE)
