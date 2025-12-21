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
  Sparkles,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const StudentNavbar = () => {
  const { logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center shadow-sm">
        <div className="w-full px-6 lg:px-12 flex items-center justify-between">
          
          {/* --- 1. BRAND LOGO --- */}
          <Link to="/student/dashboard" className="flex items-center space-x-3 group shrink-0">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-md group-hover:bg-indigo-700 transition-colors">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              CIIC <span className="text-indigo-600 font-extrabold tracking-tighter">Portal</span>
            </span>
          </Link>

          {/* --- 2. DESKTOP CENTER NAVIGATION --- */}
          <div className="hidden lg:flex items-center h-16 ml-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-5 h-full flex items-center text-sm font-semibold transition-all duration-200 group ${
                    isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <link.icon className={`w-4 h-4 mr-2 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                  <span>{link.name}</span>
                  
                  {/* Sharp Bottom Active Line */}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-indigo-600 shadow-[0_-4px_10px_rgba(79,70,229,0.3)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* --- 3. RIGHT SIDE ACTIONS --- */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all active:scale-95">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>

            <div className="hidden lg:block h-6 w-px bg-slate-200 mx-2"></div>

            {/* Profile Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 p-1 rounded-xl hover:bg-slate-50 transition-all group outline-none">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center border border-indigo-200 overflow-hidden">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-[12px] font-bold text-slate-900 leading-none">Student</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-3 w-56 origin-top-right bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none p-1.5 border border-slate-100">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => navigate('/student/profile')}
                          className={`${
                            active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'
                          } group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-semibold transition-all`}
                        >
                          <UserCircle className="mr-3 h-4 w-4 opacity-70" />
                          Account Settings
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-rose-50 text-rose-600' : 'text-rose-500'
                          } group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-semibold transition-all`}
                        >
                          <LogOut className="mr-3 h-4 w-4 opacity-70" />
                          Sign Out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE SIDE OVERLAY NAV --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[51] lg:hidden"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-72 bg-white z-[52] shadow-2xl lg:hidden p-6"
            >
              <div className="flex items-center justify-between mb-10">
                <span className="font-bold text-slate-900">Navigation</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-lg">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      location.pathname === link.path 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>

              <div className="absolute bottom-8 left-6 right-6">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-3 p-4 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacing for Fixed Nav */}
      <div className="h-16"></div>
    </>
  );
};

export default StudentNavbar;