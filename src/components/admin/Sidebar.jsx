import React, { useContext } from 'react'; // Added useContext
import { NavLink, useNavigate } from 'react-router-dom'; // Added useNavigate
import {
    LayoutDashboard,
    Building2,
    Briefcase,
    Users,
    FileText,
    BarChart3,
    FileBarChart,
    Settings,
    LogOut
} from 'lucide-react';

import { AuthContext } from '../../context/AuthContext'; // Import your AuthContext
import cresLogo from '../../assets/cres.png';

const Sidebar = () => {
    const { logout } = useContext(AuthContext); // Access logout function
    const navigate = useNavigate();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Building2, label: 'Startups', path: '/admin/startups' },
        { icon: Briefcase, label: 'Internships', path: '/admin/internships' },
        { icon: Users, label: 'Students', path: '/admin/students' },
        { icon: FileText, label: 'Applications', path: '/admin/applications' },
        { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
        { icon: FileBarChart, label: 'Reports', path: '/admin/reports' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    // Backend Logout Logic
    const handleLogout = () => {
        logout(); // Clears localStorage and user state
        navigate('/'); // Redirects to the universal landing page
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-30 flex flex-col transition-all duration-300 font-sans">
            {/* Logo Section */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-3 text-blue-700 font-bold text-xl tracking-tight">
                    <div className="w-9 h-9 flex items-center justify-center overflow-hidden shrink-0">
                        <img 
                            src={cresLogo} 
                            alt="CIIC Logo" 
                            className="w-full h-full object-contain" 
                        />
                    </div>
                    <span className="text-gray-900 font-black tracking-tighter uppercase text-lg">
                        CIIC <span className="text-blue-600">Admin</span>
                    </span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 group'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-gray-100">
                <button 
                    onClick={handleLogout} // Attached Logic
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;