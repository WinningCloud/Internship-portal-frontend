import React from 'react';
import { Bell, User, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        if (!path || path === 'dashboard') return 'Portal Overview';
        return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    };

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-8 transition-all duration-300">
            {/* Page Title - Removed Italics, using Bold tracking */}
            <div>
                <h1 className="text-sm font-black text-gray-800 uppercase tracking-[0.2em]">
                    {getPageTitle()}
                </h1>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden lg:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search global records..."
                        className="pl-9 pr-4 py-2 bg-gray-100 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-100 w-64 transition-all"
                    />
                </div>

                <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#F36B7F] rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-[11px] font-black text-gray-900 uppercase leading-none">Admin</p>
                        {/* <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Superuser</p> */}
                    </div>
                    <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg border border-slate-700">
                        <User size={18} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;