import React, { useState, useContext, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { 
  LayoutDashboard, 
  UserCircle, 
  Briefcase, 
  FileCheck, 
  Award, 
  Bell, 
  LogOut, 
  User, 
  ChevronDown,
  Menu as MenuIcon,
  X,
  Settings
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
    { name: 'My Applications', path: '/student/applications', icon: FileCheck },
    { name: 'Certificates', path: '/student/certificates', icon: Award },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login/student');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 h-20 flex items-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          
          {/* --- 1. BRAND LOGO AREA --- */}
          <div className="flex items-center space-x-10">
            <Link to="/student/dashboard" className="flex items-center space-x-3 group shrink-0">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center p-1 group-hover:border-indigo-500 transition-all shadow-sm">
                {/* CIIC LOGO PLACEHOLDER */}
                <img 
                  src="https://via.placeholder.com/150" 
                  alt="CIIC Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                  CIIC <span className="text-indigo-600">Portal</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Innovation Council</span>
              </div>
            </Link>

            {/* --- 2. CENTER NAVIGATION --- */}
            <div className="hidden lg:flex items-center h-20 space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-5 h-full flex items-center text-[13px] font-extrabold uppercase tracking-wider transition-all duration-300 ${
                      isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span>{link.name}</span>
                    
                    {/* Sharp Active Indicator (Solid Bottom Line) */}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full shadow-[0_-2px_8px_rgba(79,70,229,0.4)]"
                        transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* --- 3. RIGHT SIDE ACTIONS --- */}
          <div className="flex items-center space-x-4 lg:space-x-8">
            
            {/* Notification Module */}
            <button className="relative p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all active:scale-95 group">
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>

            {/* Account Module */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 p-1.5 pr-3 rounded-2xl bg-slate-900 hover:bg-indigo-600 transition-all group outline-none shadow-md shadow-slate-200">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-[11px] font-black text-white uppercase tracking-tighter">My Account</p>
                </div>
                <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="transform opacity-0 scale-95 translate-y-2"
                enterTo="transform opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-100"
                leaveFrom="transform opacity-100 scale-100 translate-y-0"
                leaveTo="transform opacity-0 scale-95 translate-y-2"
              >
                <Menu.Items className="absolute right-0 mt-4 w-60 origin-top-right bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 focus:outline-none p-2 border border-slate-100">
                  <div className="px-3 py-3 border-b border-slate-50 mb-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.email || "student@crescent.education"}</p>
                  </div>
                  
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate('/student/profile')}
                        className={`${
                          active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'
                        } group flex w-full items-center rounded-xl px-3 py-3 text-[13px] font-bold transition-all`}
                      >
                        <Settings className="mr-3 h-4 w-4 opacity-70" />
                        Account Settings
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-rose-50 text-rose-600' : 'text-rose-600'
                        } group flex w-full items-center rounded-xl px-3 py-3 text-[13px] font-bold transition-all mt-1`}
                      >
                        <LogOut className="mr-3 h-4 w-4 opacity-70" />
                        Log Out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Mobile Menu Icon */}
            <button 
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE NAVIGATION DRAWER --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[51] lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[300px] bg-white z-[52] shadow-2xl lg:hidden p-8"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-xl shadow-inner">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 px-5 py-4 rounded-2xl text-[14px] font-bold transition-all ${
                      location.pathname === link.path 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>

              <div className="absolute bottom-10 left-8 right-8">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-3 p-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-100 transition-all shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content overlap */}
      <div className="h-20"></div>
    </>
  );
};

export default StudentNavbar;