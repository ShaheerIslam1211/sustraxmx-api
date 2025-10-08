/**
 * App Layout Context
 * Context for managing layout state across components
 */

import React, { createContext, useContext, ReactNode } from "react";

export interface AppLayoutContextValue {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  showSidebar: boolean;
  showHeader: boolean;
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const AppLayoutContext = createContext<AppLayoutContextValue | undefined>(
  undefined
);

export interface AppLayoutProviderProps {
  children: ReactNode;
  value: AppLayoutContextValue;
}

export const AppLayoutProvider: React.FC<AppLayoutProviderProps> = ({
  children,
  value,
}) => {
  return (
    <AppLayoutContext.Provider value={value}>
      {children}
    </AppLayoutContext.Provider>
  );
};

export const useAppLayout = (): AppLayoutContextValue => {
  const context = useContext(AppLayoutContext);
  if (!context) {
    throw new Error("useAppLayout must be used within an AppLayoutProvider");
  }
  return context;
};
