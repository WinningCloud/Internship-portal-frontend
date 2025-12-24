import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // 👈 FIXED: Added missing import
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  UserCircle, 
  LogOut, 
  Sparkles 
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const StartupSidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Dynamic user data from context
  const companyName = user?.name || "Startup Admin";
  const companyEmail = user?.email || "farhantech@gmail.com";

  const menuItems = [
    { name: 'Dashboard', path: '/startup/dashboard', icon: LayoutDashboard },
    { name: 'My Internships', path: '/startup/internships', icon: Briefcase },
    { name: 'Post Internship', path: '/startup/internships/create', icon: PlusCircle },
    { name: 'Company Profile', path: '/startup/profile', icon: UserCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen w-72 bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-50 font-sans">
      
      {/* 1. Brand Section - High Contrast Minimal */}
      <div className="p-8 mb-4">
        <div 
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={() => navigate('/startup/dashboard')}
        >
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-blue-600 transition-all duration-300">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none uppercase">CIIC</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Startup Hub</p>
          </div>
        </div>
      </div>

      {/* 2. Navigation Menu */}
      <div className="flex-1 px-4 overflow-y-auto">
        <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Management</p>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className={`text-[13px] font-semibold tracking-tight ${isActive ? 'text-blue-700' : 'text-slate-600'}`}>
                    {item.name}
                  </span>
                </div>

                {/* Animated Active Indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-indicator"
                    className="w-1 h-5 bg-blue-600 rounded-full absolute right-2"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. Integrated User Section */}
      <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50">
        
        {/* Dynamic User Info Card */}
        <div className="flex items-center gap-3 p-3 mb-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
            <UserCircle className="w-6 h-6 text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-900 truncate tracking-tight">{companyName}</p>
            <p className="text-[11px] text-slate-400 truncate font-medium">{companyEmail}</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-slate-600 font-bold text-[12px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 border border-transparent hover:border-red-100"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>

        <p className="text-[10px] text-center text-slate-300 mt-4 font-bold tracking-widest uppercase">
          © 2025 CIIC Council
        </p>
      </div>
    </div>
  );
};

export default StartupSidebar;