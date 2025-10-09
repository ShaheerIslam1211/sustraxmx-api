/**
 * App Layout Component
 * Main application layout with sidebar and header
 */

import React, { useState } from "react";
import { Layout } from "antd";
import { Header } from "../header/index";
import { Sidebar } from "../sidebar/index";
import { Content } from "../Content/index";
import { AppLayoutProvider } from "./appLayoutContext";
import "./appLayout.css";

export interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: (collapsed: boolean) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showSidebar = true,
  showHeader = true,
  sidebarCollapsed: initialCollapsed = false,
  onSidebarToggle,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(initialCollapsed);

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
    onSidebarToggle?.(collapsed);
  };

  const toggleCollapsed = () => {
    handleSidebarToggle(!sidebarCollapsed);
  };

  const contextValue = {
    sidebarCollapsed,
    setSidebarCollapsed: handleSidebarToggle,
    showSidebar,
    showHeader,
    collapsed: sidebarCollapsed,
    toggleCollapsed,
  };

  return (
    <AppLayoutProvider value={contextValue}>
      <Layout className="app-layout">
        {showSidebar && (
          <Sidebar
            isOpen={!sidebarCollapsed}
            setIsOpen={(isOpen: boolean) => handleSidebarToggle(!isOpen)}
          />
        )}

        <Layout className="app-layout-body">
          {showHeader && (
            <Header
              isOpen={!sidebarCollapsed}
              setIsOpen={handleSidebarToggle}
            />
          )}

          <Content>{children}</Content>
        </Layout>
      </Layout>
    </AppLayoutProvider>
  );
};

export default AppLayout;
