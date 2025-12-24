import React, { useState, useContext, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { 
  LayoutDashboard, UserCircle, Briefcase, 
  FileCheck, Award, Bell, LogOut, 
  User, ChevronDown, Menu as MenuIcon,
  X, Settings, Search, MessageSquare, Sparkles
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

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
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 h-20 flex items-center shadow-sm">
        <div className="w-full max-w-[1540px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-8">
          
          {/* --- 1. BRAND LOGO --- */}
          <div className="flex items-center space-x-8 shrink-0">
            <Link to="/student/dashboard" className="flex items-center space-x-3 group">
              <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-indigo-600 transition-all duration-500 transform group-hover:rotate-6">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                  CIIC <span className="text-indigo-600">Portal</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Student Edition</span>
              </div>
            </Link>

            <div className="hidden xl:block h-8 w-px bg-slate-200"></div>

            {/* --- 2. DESKTOP NAV LINKS --- */}
            <div className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-lg text-[13px] font-bold tracking-tight transition-all duration-200 flex items-center space-x-2 ${
                      isActive ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <link.icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="nav-underline"
                        className="absolute bottom-[-14px] left-0 right-0 h-1 bg-indigo-600 rounded-t-full shadow-[0_-4px_12px_rgba(79,70,229,0.4)]"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* --- 3. SEARCH BAR (Center Weight) --- */}
          <div className="hidden lg:flex flex-1 max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search internships, companies..." 
              className="w-full bg-slate-100/50 border border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium outline-none transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 border border-slate-200 rounded text-[10px] text-slate-400 font-bold bg-white">
              ⌘ K
            </div>
          </div>

          {/* --- 4. RIGHT SIDE UTILITIES --- */}
          <div className="flex items-center space-x-3 lg:space-x-5 shrink-0">
            
            {/* Action Group */}
            <div className="flex items-center bg-slate-100/50 p-1 rounded-2xl border border-slate-100">
               <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-xl transition-all relative group">
                <Bell className="w-5 h-5 group-active:scale-90 transition-transform" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
              </button>
              <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-xl transition-all group">
                <MessageSquare className="w-5 h-5 group-active:scale-90 transition-transform" />
              </button>
            </div>

            {/* Profile Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 p-1 rounded-2xl hover:bg-slate-50 transition-all outline-none group border border-transparent hover:border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 flex items-center justify-center border border-slate-800 shadow-md group-hover:shadow-indigo-100">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-[11px] font-black text-slate-900 leading-none uppercase tracking-tighter">
                    {user?.fullName?.split(' ')[0] || "Student"}
                  </p>
                  <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Verified</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
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
                <Menu.Items className="absolute right-0 mt-4 w-64 origin-top-right bg-white rounded-[24px] shadow-2xl ring-1 ring-slate-200 focus:outline-none p-2 border border-slate-100">
                  <div className="px-4 py-4 border-b border-slate-50 mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated as</p>
                    <p className="text-sm font-bold text-slate-900 truncate italic">{user?.email}</p>
                  </div>
                  
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate('/student/profile')}
                        className={`${
                          active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'
                        } group flex w-full items-center rounded-xl px-4 py-3 text-sm font-bold transition-all`}
                      >
                        <Settings className="mr-3 h-4 w-4 opacity-70 group-hover:rotate-90 transition-transform duration-500" />
                        Account Settings
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center rounded-xl px-4 py-3 text-sm font-bold transition-all mt-1 ${
                          active ? 'bg-rose-50 text-rose-600' : 'text-rose-500'
                        }`}
                      >
                        <LogOut className="mr-3 h-4 w-4 opacity-70" />
                        Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Mobile Toggle */}
            <button 
              className="xl:hidden p-2.5 bg-slate-100 text-slate-900 rounded-xl shadow-sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE DRAWER --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] xl:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[320px] bg-white z-[70] shadow-2xl xl:hidden p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-2xl font-black text-slate-900 tracking-tighter">MENU</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-100 rounded-2xl">
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-3 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 px-6 py-4 rounded-[20px] text-sm font-bold transition-all ${
                      location.pathname === link.path 
                      ? 'bg-slate-900 text-white shadow-xl rotate-1' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-3 p-5 bg-rose-50 text-rose-600 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
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