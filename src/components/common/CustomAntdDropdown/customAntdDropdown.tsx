// UserDropdown.tsx
import React from "react";
import { Avatar, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
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
  return (
    <Dropdown
      menu={{
        items: userMenuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: item.link ? (
            <Link href={item.link}>{item.text}</Link>
          ) : (
            item.text
          ),
          onClick: item.onClick,
        })),
      }}
      trigger={["click"]}
      className="avatar-dropdown"
    >
      <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
    </Dropdown>
  );
};

export default UserDropdown;
