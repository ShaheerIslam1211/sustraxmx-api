/**
 * Sidebar Component Types
 *
 * This file contains all TypeScript type definitions for sidebar components.
 */

export interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (_isOpen: boolean) => void;
}

export interface SidebarItemProps {
  key: string;
  title: string;
  icon?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export interface SidebarMenuProps {
  items: SidebarItemProps[];
  onItemClick?: (_key: string) => void;
}
