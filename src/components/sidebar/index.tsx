"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEmissionData } from "../../context/EmissionDataContext";
import { Input, Avatar, Menu, Dropdown } from "antd";
import "./index.css";
import { CloseOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import { CustomInput } from "../common/formInputs/formInput";
import { useResponsive } from "../../customHooks/responsive";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { isMobile } = useResponsive();
  const searchParams = useSearchParams();
  const { emissionData } = useEmissionData();
  const router = useRouter();
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

  if (isOpen) {
    return (
      <div className={`drawer ${isOpen && "animate"} left`}>
        <div className="sidebarOpen-search">
          {isMobile && user && (
            <div className="profile-section">
              <Avatar icon={<UserOutlined />} />
              <div className="">
                <div className="username">{user.displayName}</div>
                <div className="role">User</div>
              </div>
              <Dropdown className="dropdown" overlay={menu} trigger={["click"]}>
                <a onClick={e => e.preventDefault()}>
                  <DownOutlined />
                </a>
              </Dropdown>
            </div>
          )}
          <CustomInput
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <ul
          style={{ listStyle: "none", marginTop: isMobile ? 5 : 20 }}
          className="list"
        >
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
      </div>
    );
  }

  return (
    <aside className={`container`}>
      <CustomInput
        placeholder="jump to..."
        value={search}
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
