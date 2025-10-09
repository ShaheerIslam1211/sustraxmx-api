/**
 * UI Configuration
 * Centralized UI settings, themes, and design tokens
 */

// Color palette
export const colors = {
  // Primary colors
  primary: {
    50: "#f6ffed",
    100: "#d9f7be",
    200: "#b7eb8f",
    300: "#95de64",
    400: "#73d13d",
    500: "#52c41a", // Main primary color
    600: "#389e0d",
    700: "#237804",
    800: "#135200",
    900: "#092b00",
  },

  // Secondary colors
  secondary: {
    50: "#e6f7ff",
    100: "#bae7ff",
    200: "#91d5ff",
    300: "#69c0ff",
    400: "#40a9ff",
    500: "#1890ff", // Main secondary color
    600: "#096dd9",
    700: "#0050b3",
    800: "#003a8c",
    900: "#002766",
  },

  // Semantic colors
  success: "#52c41a",
  warning: "#faad14",
  error: "#ff4d4f",
  info: "#1890ff",

  // Neutral colors
  gray: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#f0f0f0",
    300: "#d9d9d9",
    400: "#bfbfbf",
    500: "#8c8c8c",
    600: "#595959",
    700: "#434343",
    800: "#262626",
    900: "#1f1f1f",
  },

  // Dark mode colors
  dark: {
    background: "#141414",
    surface: "#1f1f1f",
    border: "#303030",
    text: "#ffffff",
    textSecondary: "#a6a6a6",
  },
} as const;

// Typography
export const typography = {
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
    mono: ["JetBrains Mono", "Consolas", "monospace"],
  },

  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

// Spacing
export const spacing = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
} as const;

// Breakpoints
export const breakpoints = {
  xs: "480px",
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  xxl: "1600px",
} as const;

// Animation
export const animation = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },

  easing: {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    cubic: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  },
} as const;

// Shadows
export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
} as const;

// Border radius
export const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  base: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

// Z-index
export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// UI Configuration
export const uiConfig = {
  colors,
  typography,
  spacing,
  breakpoints,
  animation,
  shadows,
  borderRadius,
  zIndex,

  // Theme configuration
  theme: {
    primary: colors.primary[500],
    secondary: colors.secondary[500],
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
  },

  // Component-specific configurations
  components: {
    button: {
      height: {
        sm: "2rem", // 32px
        md: "2.5rem", // 40px
        lg: "3rem", // 48px
      },
      padding: {
        sm: "0.5rem 1rem",
        md: "0.75rem 1.5rem",
        lg: "1rem 2rem",
      },
    },

    input: {
      height: {
        sm: "2rem", // 32px
        md: "2.5rem", // 40px
        lg: "3rem", // 48px
      },
      padding: {
        sm: "0.5rem 0.75rem",
        md: "0.75rem 1rem",
        lg: "1rem 1.25rem",
      },
    },
  },
} as const;

export type UiConfig = typeof uiConfig;
