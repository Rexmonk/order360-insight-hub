import { useState } from "react";
import {
  Home,
  LogOut,
  User as UserIcon,
  Menu,
  ShoppingBag,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed: boolean;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  subItems?: NavItem[];
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<NavItem | null>(null);

  const navItems: NavItem[] = [
    {
      path: "/",
      label: "Home",
      icon: <Home className="sidebar-icon" />,
    },
    {
      path: "/order-overview",
      label: "Order Overview",
      icon: <ShoppingBag className="sidebar-icon" />,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={`fixed top-[57px] left-0 h-[calc(100vh-57px)] bg-white border-r border-gray-200 transition-all duration-300 z-10 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full py-4">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={`sidebar-link ${
                          isActive(item.path) ? "active" : ""
                        } ${collapsed ? "justify-center" : ""}`}
                        onMouseEnter={() => setHoveredItem(item)}
                        onMouseLeave={() => setHoveredItem(null)}
                        aria-label={item.label}
                      >
                        {item.icon}
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent
                        className="text-xs p-1 bg-white rounded text-black TooltipContent"
                        side="right"
                      >
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>

                {/* Submenu flyout for collapsed sidebar (if needed) */}
                {collapsed &&
                  hoveredItem === item &&
                  item.subItems &&
                  item.subItems.length > 0 && (
                    <div className="absolute left-16 mt-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <ul className="py-2">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.path}>
                            <Link
                              to={subItem.path}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {subItem.icon && (
                                <span className="mr-2">{subItem.icon}</span>
                              )}
                              <span>{subItem.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
