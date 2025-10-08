import React from "react";
import { Tabs } from "antd";
import "./index.css";

interface TabData {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface CustomTabsProps {
  activeKey?: string;
  onChange?: (key: string) => void;
  tabsData: TabData[];
}

const CustomTabs: React.FC<CustomTabsProps> = ({
  activeKey,
  onChange,
  tabsData,
}) => {
  const items = tabsData.map(({ key, label, content }) => ({
    key,
    label,
    children: content,
  }));

  return (
    <Tabs defaultActiveKey={activeKey} onChange={onChange} items={items} />
  );
};

export default CustomTabs;
