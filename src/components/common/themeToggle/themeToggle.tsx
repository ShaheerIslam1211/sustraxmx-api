"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import "./themeToggle.css";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="theme-toggle-slider">
        <div className="slider-track">
          <div className="slider-thumb">
            <SunOutlined className="slider-icon" />
          </div>
        </div>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      <div
        className={`theme-toggle-slider ${isDark ? "dark" : "light"}`}
        onClick={toggleTheme}
      >
        <div className="slider-track">
          <div className="slider-thumb">
            {isDark ? (
              <MoonOutlined className="slider-icon" />
            ) : (
              <SunOutlined className="slider-icon" />
            )}
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default ThemeToggle;
