import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import type { IMenuItem } from '../../types/menuItems'; 


interface HeaderProps {
    menuItems: IMenuItem[];
}

const Header = ({ menuItems }: HeaderProps): React.ReactElement => {
    const location = useLocation();
    
    const currentTitle = menuItems.find(item => item.path === location.pathname)?.title || 'ERP 시스템';

    return (
        <header className="flex justify-between items-center p-4 bg-white border-b shadow-sm sticky top-0 z-20">
            <h1 className="text-2xl font-bold text-gray-800">{currentTitle}</h1>
            <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium hidden sm:inline">관리자님, 환영합니다!</span>
                <button className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                    <Bell size={20} />
                </button>
                <a href="/login" className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition">
                    로그아웃
                </a>
            </div>
        </header>
    );
};

export default Header;