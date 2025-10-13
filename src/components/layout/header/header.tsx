"use client";

import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useResponsive } from "../../../customHooks/responsive";
import { UserOutlined, LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import { handleLogout } from "../../../helpers/authHelper";
import CustomDropdown from "../../common/CustomAntdDropdown/customAntdDropdown";
import ThemeToggle from "../../common/themeToggle/themeToggle";
import "./header.css";
import texts from "../../../mockData/texts";

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const { isSmallMobile, isMobile, isTablet, isDesktop } = useResponsive();

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
      <div className="header-left">
        {/* Sidebar toggle for mobile and tablet */}
        {!isDesktop && (
          <div className="hamburger-menu" onClick={() => setIsOpen(!isOpen)}>
            <MenuOutlined
              style={{
                fontSize: isSmallMobile ? "16px" : isMobile ? "18px" : "20px",
              }}
            />
          </div>
        )}
        <div
          className="logo"
          style={{
            fontSize: isSmallMobile ? "16px" : isMobile ? "18px" : "24px",
          }}
        >
          {texts.header.logoText}
        </div>
      </div>

      {isDesktop ? (
        <>
          <nav className="menu">
            {texts.header.menuItems.map((item: any) => (
              <Link href={item.link} className="menuItem" key={item.name}>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            {!user ? (
              <Link href="/auth?type=login" className="login">
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
      ) : (
        <div className="header-actions">
          <ThemeToggle />
          {!user ? (
            <Link href="/auth?type=login" className="login">
              {texts.header.loginText}
            </Link>
          ) : (
            <CustomDropdown userMenuItems={userMenuItems} />
          )}
        </div>
      )}
    </header>
  );
};
export default Header;
