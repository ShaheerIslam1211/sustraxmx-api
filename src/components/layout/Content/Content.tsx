"use client";

import React from "react";
import { Layout } from "antd";
import { useAppLayout } from "../AppLayout/AppLayoutContext";

const { Content: AntContent } = Layout;

interface ContentProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const Content: React.FC<ContentProps> = ({
  children,
  style,
  className = "",
  ...props
}) => {
  const { collapsed } = useAppLayout();

  return (
    <AntContent
      className={`app-content ${className}`}
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: "#fff",
        borderRadius: 8,
        ...style,
      }}
      {...props}
    >
      {children}
    </AntContent>
  );
};

export default Content;
