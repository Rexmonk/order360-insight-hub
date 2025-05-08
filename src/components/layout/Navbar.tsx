
import { useEffect, useState } from 'react';
import { User, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { login, logout, getActiveAccount, setupTokenRefresh } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Navbar = ({ toggleSidebar, isSidebarCollapsed }: NavbarProps) => {
  const [userName, setUserName] = useState<string>('Guest User');
  const navigate = useNavigate();
  
  useEffect(() => {
    const account = getActiveAccount();
    if (account?.name) {
      setUserName(account.name);
      setupTokenRefresh();
    }
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleLogin = async () => {
    await login();
    const account = getActiveAccount();
    if (account?.name) {
      setUserName(account.name);
      setupTokenRefresh();
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed w-full z-20 top-0 left-0 shadow-sm">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            type="button"
            className="btn-icon mr-3"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center">
            <span className="text-primary font-bold text-2xl">Order</span>
            <span className="text-gray-800 font-bold text-2xl">360</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="hidden md:flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-4">
              {userName}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={userName === 'Guest User' ? handleLogin : undefined}
              className="rounded-full"
              aria-label="User profile"
            >
              <User className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="rounded-full"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
