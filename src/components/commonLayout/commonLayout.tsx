"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { Header, Sidebar } from "@/components";
import { useResponsive } from "@/customHooks";
import "./commonLayout.css";

interface CommonLayoutProps {
  children: ReactNode;
}

const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
  const { isMobile, isTablet } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Set sidebar open by default on desktop, closed on mobile/tablet
  useEffect(() => {
    setIsOpen(true); // Always open on desktop, controlled by mobile logic
    setIsInitialized(true);
  }, [isMobile, isTablet]);

  // Prevent layout shift during initialization
  if (!isInitialized) {
    return (
      <div>
        <Header isOpen={false} setIsOpen={setIsOpen} />
        <div style={{ display: "flex" }}>
          <Sidebar isOpen={false} setIsOpen={setIsOpen} />
          <div
            className="main-content"
            style={{
              padding: "10px 20px",
              width: "100%",
              marginLeft: "0",
              transition: "margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      <div style={{ display: "flex" }}>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        {/* Only show overlay on mobile/tablet when sidebar is open */}
        {(isMobile || isTablet) && (
          <div
            className={`overlay ${!isOpen && "overlayHidden"} ${
              isOpen && "overlayOpen"
            }`}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
        <div
          className="main-content"
          style={{
            padding: isMobile ? "10px" : "10px 20px",
            width: !isMobile && !isTablet ? "calc(100% - 300px)" : "100%",
            marginLeft: !isMobile && !isTablet ? "300px" : "0",
            transition: isInitialized
              ? "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CommonLayout;
