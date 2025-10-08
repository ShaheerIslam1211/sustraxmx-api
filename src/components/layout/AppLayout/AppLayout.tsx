/**
 * App Layout Component
 * Main application layout with header, sidebar, and content area
 */

import React, { useState } from "react";
import { Layout } from "antd";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import { Content } from "../Content";
import { AppLayoutProvider } from "./AppLayoutContext";
import "./AppLayout.css";

const { Sider } = Layout;

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

  return (
    <AppLayoutProvider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed: handleSidebarToggle,
        showSidebar,
        showHeader,
        collapsed: sidebarCollapsed,
        toggleCollapsed,
      }}
    >
      <Layout className="app-layout">
        {showHeader && (
          <Header isOpen={!sidebarCollapsed} setIsOpen={handleSidebarToggle} />
        )}

        <Layout className="app-layout-body">
          {showSidebar && (
            <Sider
              collapsible
              collapsed={sidebarCollapsed}
              onCollapse={handleSidebarToggle}
              className="app-layout-sidebar"
              width={280}
              collapsedWidth={80}
            >
              <Sidebar
                isOpen={!sidebarCollapsed}
                setIsOpen={handleSidebarToggle}
              />
            </Sider>
          )}

          <Content>{children}</Content>
        </Layout>
      </Layout>
    </AppLayoutProvider>
  );
};

export default AppLayout;
