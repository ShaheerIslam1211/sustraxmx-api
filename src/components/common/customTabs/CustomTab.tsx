import React from "react";
import { Tabs } from "antd";
import "./index.css";

const { TabPane } = Tabs;

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

const CustomTabs: React.FC<CustomTabsProps> = ({ activeKey, onChange, tabsData }) => {
  return (
    <Tabs defaultActiveKey={activeKey} onChange={onChange}>
      {tabsData.map(({ key, label, content }) => (
        <TabPane tab={label} key={key}>
          {content}
        </TabPane>
      ))}
    </Tabs>
  );
};

export default CustomTabs;
