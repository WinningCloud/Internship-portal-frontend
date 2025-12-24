import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  UserCircle, 
  LogOut, 
  Building2,
  ShieldCheck
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

// Import the logo from your assets folder
import ciicLogo from '../../assets/ciic.png'; 

const StartupSidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    companyName: "Loading...",
    logoUrl: null,
    isVerified: true,
    email: ""
  });

  useEffect(() => {
    const fetchSidebarData = async () => {
      if (!user?._id) return;
      try {
        const res = await api.get(`/startup/profile/get-profile/${user._id}`);
        const data = res.data.profile || res.data;
        if (data) {
          setProfile({
            companyName: data.companyName,
            logoUrl: data.logoUrl,
            isVerified: true,
            email: data.companyEmail
          });
        }
      } catch (err) {
        console.error("Sidebar profile fetch error");
      }
    };

    fetchSidebarData();
  }, [user?._id]);

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
      
      {/* 1. New Brand Section - Centered Image Logo */}
      <div className="p-8 pb-4 flex justify-center">
        <div 
          className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]" 
          onClick={() => navigate('/startup/dashboard')}
        >
          <img 
            src={ciicLogo} 
            alt="CIIC Logo" 
            className="h-16 w-auto object-contain" 
          />
        </div>
      </div>

      {/* 2. Navigation Menu */}
      <div className="flex-1 px-4 overflow-y-auto custom-scrollbar mt-4">
        <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Management</p>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-200 ${
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

                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-indicator"
                    className="w-1 h-5 bg-blue-600 rounded-full absolute right-2"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. Dynamic Startup Identity Section */}
      <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50">
        
        <div className="px-3 mb-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-[9px] uppercase tracking-[0.2em] mb-3">
                <ShieldCheck size={12} /> Partner Verified
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                {profile.logoUrl ? (
                    <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                    <Building2 className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-slate-900 truncate tracking-tight">
                    {profile.companyName || "Configure Profile"}
                </p>
                <p className="text-[10px] text-slate-400 truncate font-medium">
                    {profile.email || "No Email Set"}
                </p>
              </div>
            </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-slate-500 font-bold text-[12px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 border border-transparent hover:border-red-100"
        >
          <LogOut size={16} />
          <span>Terminate Session</span>
        </button>

        <p className="text-[9px] text-center text-slate-300 mt-4 font-bold tracking-widest uppercase">
          CIIC Portal v2.4.0
        </p>
      </div>
    </div>
  );
};

export default StartupSidebar;