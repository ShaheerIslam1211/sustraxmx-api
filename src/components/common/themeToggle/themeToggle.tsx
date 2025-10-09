"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import "./themeToggle.css";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        type="text"
        size="large"
        className="theme-toggle-button"
        icon={<SunOutlined />}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      <Button
        type="text"
        size="large"
        className={`theme-toggle-button ${isDark ? "dark" : "light"}`}
        icon={isDark ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
      />
    </Tooltip>
  );
};

export default ThemeToggle;
