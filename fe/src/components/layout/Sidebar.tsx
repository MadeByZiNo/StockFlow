import { Link, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';
import type { IMenuItem } from '../../types/menuItems'; 

interface SidebarProps {
    menuItems: IMenuItem[];
}

const Sidebar = ({ menuItems }: SidebarProps): React.ReactElement  => {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-screen fixed top-0 left-0 z-10 shadow-2xl">
      <div className="p-6 text-2xl font-extrabold text-blue-400 border-b border-gray-700 flex items-center space-x-2">
        <Settings size={28} className="text-blue-400" />
        <span>StockFlow ERP</span>
      </div>
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-lg transition duration-150 
                ${location.pathname === item.path 
                  ? 'bg-blue-600 text-white font-bold shadow-md' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              <IconComponent size={18} className="mr-3" />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">© 2024 Made by Zino</p>
      </div>
    </div>
  );
};

export default Sidebar;