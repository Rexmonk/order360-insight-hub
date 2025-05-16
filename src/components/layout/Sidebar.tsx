
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Settings,
  HelpCircle
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}

interface SidebarProps {
  collapsed: boolean;
}

const NavItem = ({ to, icon: Icon, label, collapsed }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 py-2 px-3 rounded-md transition-colors ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-gray-600 hover:bg-gray-100'
        } ${collapsed ? 'justify-center' : ''}`
      }
    >
      <Icon size={20} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

const Sidebar = ({ collapsed }: SidebarProps) => {
  return (
    <aside
      className={`fixed left-0 top-14 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-10 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 flex flex-col h-full">
        <nav className="flex-1 space-y-1">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
          <NavItem to="/order-overview" icon={Package} label="Orders" collapsed={collapsed} />
          <NavItem to="/shipments" icon={Truck} label="Shipments" collapsed={collapsed} />
          <NavItem to="/customers" icon={Users} label="Customers" collapsed={collapsed} />
        </nav>
        
        <div className="pt-4 mt-6 border-t border-gray-200 space-y-1">
          <NavItem to="/settings" icon={Settings} label="Settings" collapsed={collapsed} />
          <NavItem to="/help" icon={HelpCircle} label="Help" collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
