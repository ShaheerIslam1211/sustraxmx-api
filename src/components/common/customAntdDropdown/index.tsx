// UserDropdown.tsx
import React from "react";
import { Avatar, Dropdown, Menu } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Link from "next/link";

interface UserMenuItem {
  key: string;
  icon?: React.ReactNode;
  text: string;
  link?: string;
  onClick?: () => void;
}

interface UserDropdownProps {
  userMenuItems: UserMenuItem[];
}

const UserDropdown: React.FC<UserDropdownProps> = ({ userMenuItems }) => {
  const menu = (
    <Menu>
      {userMenuItems.map(item => (
        <Menu.Item key={item.key} icon={item.icon} onClick={item.onClick}>
          {item.link ? <Link href={item.link}>{item.text}</Link> : item.text}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} className="avatar-dropdown">
      <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
    </Dropdown>
  );
};

export default UserDropdown;
