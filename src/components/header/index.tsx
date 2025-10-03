"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { headerContent } from "../../mockData/mockData";
import { useResponsive } from "../../customHooks/responsive";
import { MenuOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Avatar, Dropdown, Menu } from "antd";
import { handleLogout } from "../../helpers/authHelper";
import CustomDropdown from "../common/customAntdDropdown";
import ThemeToggle from "../common/ThemeToggle";
import "./index.css";
import texts from "../../mockData/texts";

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const { isMobile, isTablet } = useResponsive();

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      text: "Profile",
      link: "/profile",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      text: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <header className="header">
      <div className="logo" style={{ fontSize: isMobile ? "18px" : "24px" }}>
        {texts.header.logoText}
      </div>

      {isTablet ? (
        <div className="hamburger-menu" onClick={() => setIsOpen(true)}>
          <MenuOutlined style={{ fontSize: isMobile ? "18px" : "24px" }} />
        </div>
      ) : (
        <>
          <nav className="menu">
            {texts.header.menuItems.map(item => (
              <Link href={item.link} className="menuItem" key={item.name}>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <ThemeToggle />

            {!user ? (
              <Link href="/login" className="login">
                {texts.header.loginText}
              </Link>
            ) : (
              <CustomDropdown userMenuItems={userMenuItems} />
            )}

            <Link href="/contactus" className="helpCenter">
              {texts.header.contactUs}
            </Link>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
