import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEmissionData } from "../../../context/EmissionDataContext";
import { Avatar, Menu, Dropdown } from "antd";
import "./Sidebar.css";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { CustomInput } from "../../common/formInputs";
import { useResponsive } from "../../../customHooks/responsive";
import { useAuth } from "../../../context/AuthContext";

export interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { emissionData } = useEmissionData();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleEmissionClick = (name: string) => {
    router.push(`/form?name=${name}`);
    setIsOpen(false);
  };

  const filteredEmissions = Object.keys(emissionData).filter(key =>
    emissionData[key].title.toLowerCase().includes(search)
  );

  const isActive = (key: string) => searchParams.get("name") === key;

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link href="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <Link href="/login" onClick={() => {}}>
          Logout
        </Link>
      </Menu.Item>
    </Menu>
  );

  if (isMobile) {
    return (
      <>
        {/* Overlay for mobile */}
        <div
          className={`sidebar-overlay ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(false)}
        />
        <div className={`container mobile-container ${isOpen ? "open" : ""}`}>
          <div className="mobile-header">
            <h3 className="mobile-title">Navigation</h3>
          </div>
          <div className="mobile-search">
            <CustomInput
              placeholder="Search forms..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <ul className="mobile-nav-list">
            {filteredEmissions.map(key => (
              <li
                key={key}
                className={`mobile-nav-item ${isActive(key) ? "active" : ""}`}
              >
                <Link
                  href={`/form?name=${key}`}
                  className="mobile-nav-link"
                  onClick={() => {
                    handleEmissionClick(key);
                    setIsOpen(false); // Close mobile menu after selection
                  }}
                >
                  {emissionData[key].title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }

  return (
    <aside className="container">
      <CustomInput
        placeholder="Search forms..."
        onChange={handleSearchChange}
      />
      <ul style={{ listStyle: "none", marginTop: 20 }} className="list">
        {filteredEmissions.map(key => (
          <li
            key={key}
            className={`sidebar-item ${isActive(key) ? "active" : ""}`}
          >
            <Link
              href={`/form?name=${key}`}
              className="link"
              onClick={() => handleEmissionClick(key)}
            >
              {emissionData[key].title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
