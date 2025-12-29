import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import StudentNavbar from '../components/common/StudentNavbar';

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <StudentNavbar />
      
      {/* Content Area */}
      <main className="pt-12 pb-12  px-6"> {/* Keep padding-top at 32 (128px) */}
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    // className="max-w-7xl mx-auto"
  >
    <Outlet />
  </motion.div>
</main>

      {/* Subtle Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-indigo-100/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[5%] right-[-5%] w-[25%] h-[25%] bg-purple-100/30 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};

export default StudentLayout;