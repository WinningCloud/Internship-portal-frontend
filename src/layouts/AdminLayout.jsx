import React from 'react';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/admin/Header';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-[#F6F2ED] font-sans text-gray-900 flex overflow-hidden">
            {/* Sidebar stays fixed at 64 (256px) */}
            <Sidebar />

            {/* The rest of the screen takes remaining width */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                {/* Main Content Area */}
                {/* Removed max-w-7xl and mx-auto to allow full width */}
                <main className="flex-1 pt-16 overflow-y-auto custom-scrollbar transition-all duration-300 ml-64">
                    <div className="p-6 md:p-8 w-full animate-fade-in-up">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;