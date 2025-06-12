export interface SubMenuItem {
  label: string;
  path: string;
}

export interface MenuItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  subMenu?: SubMenuItem[];
}

// Props del componente
export interface ResponsiveSidebarMenuProps {
  role: number;
  userName: string;
  onLogout: () => void;
}
