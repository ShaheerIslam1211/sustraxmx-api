"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { Header, Sidebar } from "@/components";
import { useResponsive } from "@/customHooks";
import "./index.css";

interface CommonLayoutProps {
  children: ReactNode;
}

const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
  const { isMobile, isTablet } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);

  // Set sidebar open by default on desktop, closed on mobile/tablet
  useEffect(() => {
    setIsOpen(!isMobile && !isTablet);
  }, [isMobile, isTablet]);

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
            width: "100vw",
            marginLeft: isOpen && !isMobile && !isTablet ? "340px" : "0",
            transition: "margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CommonLayout;
