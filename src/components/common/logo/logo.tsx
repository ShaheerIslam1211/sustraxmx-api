"use client";

import React from "react";
import "./logo.css";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  width = 120,
  height = 40,
}) => {
  return (
    <div className={`logo-container ${className}`}>
      <img
        src="/images/loading.gif"
        alt="Sustraxmx-API Logo"
        width={width}
        height={height}
        className="logo-image"
      />
    </div>
  );
};
