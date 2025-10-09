"use client";

import { ConfigProvider, theme } from "antd";
import { ThemeProvider, useTheme } from "next-themes";
import {
  AuthProvider,
  EmissionDataProvider,
  ApiDataProvider,
} from "../context";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const getAntdTheme = (isDark: boolean) => ({
  algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: isDark ? "#34d399" : "#22c55e",
    colorSuccess: isDark ? "#34d399" : "#22c55e",
    colorWarning: isDark ? "#fbbf24" : "#f59e0b",
    colorError: isDark ? "#f87171" : "#ef4444",
    colorInfo: isDark ? "#60a5fa" : "#3b82f6",
    borderRadius: 8,
    fontFamily: inter.style.fontFamily,
    colorBgContainer: isDark ? "#1e293b" : "#ffffff",
    colorBgElevated: isDark ? "#334155" : "#ffffff",
    colorBorder: isDark ? "#334155" : "#e5e7eb",
    colorText: isDark ? "#f1f5f9" : "#1f2937",
    colorTextSecondary: isDark ? "#cbd5e1" : "#64748b",
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      colorBgContainer: isDark ? "#334155" : "#ffffff",
      colorBorder: isDark ? "#475569" : "#e5e7eb",
    },
    Card: {
      borderRadius: 12,
      colorBgContainer: isDark ? "#1e293b" : "#ffffff",
    },
    Menu: {
      colorBgContainer: "transparent",
      colorItemBg: "transparent",
      colorItemBgSelected: isDark ? "#34d399" : "#22c55e",
      colorItemTextSelected: "#ffffff",
    },
    Layout: {
      colorBgBody: isDark ? "#0f172a" : "#ffffff",
      colorBgContainer: isDark ? "#0f172a" : "#ffffff",
    },
  },
});

function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const { theme: currentTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ConfigProvider theme={getAntdTheme(false)}>{children}</ConfigProvider>
    );
  }

  const isDark = resolvedTheme === "dark";
  return (
    <ConfigProvider theme={getAntdTheme(isDark)}>{children}</ConfigProvider>
  );
}

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
      storageKey="sustrax-theme"
    >
      <AntdConfigProvider>
        <ErrorBoundary>
          <AuthProvider>
            <EmissionDataProvider>
              <ApiDataProvider>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                  {children}
                </div>
              </ApiDataProvider>
            </EmissionDataProvider>
          </AuthProvider>
        </ErrorBoundary>
      </AntdConfigProvider>
    </ThemeProvider>
  );
}
