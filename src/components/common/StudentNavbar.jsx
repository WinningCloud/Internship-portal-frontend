import React, { useState, useContext, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { 
  LayoutDashboard, UserCircle, Briefcase, 
  FileCheck, Award, Bell, LogOut, 
  User, ChevronDown, Menu as MenuIcon,
  X, Settings, Search, MessageSquare, Sparkles,
  ShieldCheck, Globe, Command
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import cresLogo from '../../assets/cres.png';

const StudentNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/student/profile', icon: UserCircle },
    { name: 'Internships', path: '/student/internships', icon: Briefcase },
    { name: 'Applications', path: '/student/applications', icon: FileCheck },
    { name: 'Certificates', path: '/student/certificates', icon: Award },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login/student');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 h-20 flex items-center shadow-sm">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-10 flex items-center justify-between gap-10">
          
          {/* --- MODULE 1: BRAND IDENTITY --- */}
          <div className="flex items-center space-x-10 shrink-0">
            <Link to="/student/dashboard" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-1.5 shadow-sm group-hover:border-indigo-600 transition-all duration-300 transform group-hover:rotate-3">
                <img src={cresLogo} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                  CIIC <span className="text-indigo-600">Portal</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Student Module</span>
              </div>
            </Link>

            <div className="hidden xl:block h-10 w-px bg-slate-200"></div>

            {/* --- MODULE 2: NAVIGATION LINKS --- */}
            <div className="hidden xl:flex items-center h-20 space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-5 h-full flex items-center text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                      isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="nav-glow"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full shadow-[0_-4px_12px_rgba(79,70,229,0.4)]"
                        transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* --- MODULE 3: SEARCH BAR (COMMAND CENTER) --- */}
          {/* <div className="hidden lg:flex flex-1 max-w-md relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Quick search internships..." 
              className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50/50 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none transition-all placeholder:text-slate-400"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 border border-slate-200 rounded-lg bg-white shadow-sm opacity-50 group-focus-within:opacity-100 transition-opacity">
               <Command size={10} className="text-slate-400" />
               <span className="text-[9px] font-black text-slate-400 uppercase">K</span>
            </div>
          </div> */}

          {/* --- MODULE 4: UTILITY & PROFILE --- */}
          <div className="flex items-center space-x-4 lg:space-x-8 shrink-0">
            
            {/* System Actions */}
            {/* <div className="flex items-center gap-2">
                <button className="relative p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all active:scale-90">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
                </button>
                <button className="hidden sm:block p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all">
                    <MessageSquare size={20} />
                </button>
            </div> */}

            {/* Profile Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 p-1 rounded-2xl hover:bg-slate-50 transition-all outline-none group border border-transparent hover:border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 shadow-md group-hover:bg-indigo-600 transition-colors">
                  <User size={20} className="text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-[11px] font-black text-slate-900 leading-none uppercase tracking-tighter">
                    {user?.fullName?.split(' ')[0] || "User"}
                  </p>
                  <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-1">Verified</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95 translate-y-2"
                enterTo="transform opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-100"
                leaveFrom="transform opacity-100 scale-100 translate-y-0"
                leaveTo="transform opacity-0 scale-95 translate-y-2"
              >
                <Menu.Items className="absolute right-0 mt-4 w-64 origin-top-right bg-white rounded-[24px] shadow-2xl ring-1 ring-slate-200 focus:outline-none p-2 border border-slate-100 overflow-hidden">
                  {/* <div className="px-5 py-5 border-b border-slate-50 mb-2">
                    <div className="flex items-center gap-2 mb-1.5">
                        <ShieldCheck size={12} className="text-indigo-600" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Academic Access</p>
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.email}</p>
                  </div> */}
                  
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate('/student/profile')}
                        className={`${active ? 'bg-slate-50 text-indigo-600' : 'text-slate-600'} group flex w-full items-center rounded-xl px-4 py-3 text-xs font-bold transition-all uppercase tracking-widest`}
                      >
                        <Settings className="mr-3 h-4 w-4 opacity-50 group-hover:rotate-90 transition-transform duration-500" />
                        Settings
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center rounded-xl px-4 py-3 text-xs font-bold transition-all mt-1 uppercase tracking-widest ${
                          active ? 'bg-rose-50 text-rose-600' : 'text-rose-500'
                        }`}
                      >
                        <LogOut className="mr-3 h-4 w-4 opacity-50" />
                        Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Mobile Toggle */}
            <button 
              className="xl:hidden p-2.5 bg-slate-900 text-white rounded-xl shadow-lg shadow-indigo-200 active:scale-90 transition-transform"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuIcon size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE MODULAR DRAWER --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] xl:hidden" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[300px] bg-white z-[70] shadow-2xl xl:hidden p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">MENU</span>
                    <div className="h-1 w-8 bg-indigo-600 rounded-full mt-1"></div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                  <X size={22} />
                </button>
              </div>
              
              <div className="space-y-2 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 px-6 py-4 rounded-[20px] text-xs font-black uppercase tracking-[0.2em] transition-all ${
                      location.pathname === link.path 
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-2' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <link.icon size={18} />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-3 p-5 bg-rose-50 text-rose-600 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95"
                >
                  <LogOut size={18} />
                  <span>Logout Session</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-20"></div>
    </>
  );
};

export default StudentNavbar;