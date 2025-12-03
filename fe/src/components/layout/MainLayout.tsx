import React from "react"
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import Header from './Header';   
import {menuItems} from '../../types/menuItems'; 

const MainLayout = (): React.ReactElement => {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar menuItems={menuItems} />

            <div className="flex flex-col flex-grow ml-64">
                <Header menuItems={menuItems} />

                <main className="flex-grow p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;