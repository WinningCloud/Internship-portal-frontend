// // import React, { useEffect, useState } from 'react';
// // import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
// // import api from '../../api/axiosConfig';

// // const AdminLogin = () => {


// //     const [email, setEmail] = useState("");
// //     const [password, setPassword] = useState("");
// //     const handleLogin = async (e) => {
// //         e.preventDefault();
// //         setLoading(true);
// //         setError("");

// //         try {
// //             // 1. Call your Backend API
// //             const response = await api.post('/auth/startup/login', { email, password });
            
// //             // 2. Destructure response (ensure this matches your Backend's return keys)
// //             const { token, role } = response.data;

// //             // 3. Update Global Auth State (This saves to localStorage)
// //             login(token, role);

// //             // 4. Role-based Redirection
// //             if (role === "STARTUP") {
// //                 navigate("/startup/dashboard");
// //             } else if (role === "CIIC") {
// //                 navigate("/ciic/dashboard");
// //             } else if (role === "STUDENT") {
// //                 navigate("/student/dashboard");
// //             } else if (role === "STUDENT_ADMIN") {
// //                 navigate("/student-admin/dashboard");
// //             } else {
// //                 navigate("/unauthorized");
// //             }

// //         } catch (err) {
// //             setError(err.response?.data?.message || "Invalid credentials. Please try again.");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

    

// //     return (
// //         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
// //             <div className="bg-white/95 backdrop-blur-sm w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">

// //                 {/* Header Section */}
// //                 <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
// //                     <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-y-6 origin-top-left translate-y-4"></div>
// //                     <div className="relative z-10 flex flex-col items-center">
// //                         <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 shadow-inner backdrop-blur-md">
// //                             <ShieldCheck className="w-8 h-8 text-white" />
// //                         </div>
// //                         <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Admin Portal</h2>
// //                         <p className="text-indigo-100 text-sm">Welcome back! Please login to continue.</p>
// //                     </div>
// //                 </div>

// //                 {/* Form Section */}
// //                 <div className="p-8">
// //                     <form className="space-y-6">
// //                         <div className="space-y-2">
// //                             <label className="text-sm font-medium text-gray-700 block" htmlFor="email">Email Address</label>
// //                             <div className="relative group">
// //                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                                     <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
// //                                 </div>
// //                                 <input
// //                                     id="email"
// //                                     type="email"
// //                                     className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
// //                                     placeholder="admin@example.com"
// //                                     required
// //                                 />
// //                             </div>
// //                         </div>

// //                         <div className="space-y-2">
// //                             <label className="text-sm font-medium text-gray-700 block" htmlFor="password">Password</label>
// //                             <div className="relative group">
// //                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                                     <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
// //                                 </div>
// //                                 <input
// //                                     id="password"
// //                                     type="password"
// //                                     className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
// //                                     placeholder="••••••••"
// //                                     required
// //                                 />
// //                             </div>
// //                         </div>

// //                         <div className="flex items-center justify-between">
// //                             <div className="flex items-center">
// //                                 <input
// //                                     id="remember-me"
// //                                     name="remember-me"
// //                                     type="checkbox"
// //                                     className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
// //                                 />
// //                                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
// //                                     Remember me
// //                                 </label>
// //                             </div>

// //                             <div className="text-sm">
// //                                 <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
// //                                     Forgot password?
// //                                 </a>
// //                             </div>
// //                         </div>

// //                         <button
// //                             type="submit"
// //                             className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:scale-[1.02]"
// //                             // onClick={handleLogin}
// //                         >
// //                             Sign in to Dashboard
// //                             <ArrowRight className="ml-2 h-4 w-4" />
// //                         </button>
// //                     </form>

// //                     <div className="mt-6 text-center">
// //                         <p className="text-xs text-gray-400">
// //                             © 2024 Internship Portal. Secured by <span className="text-indigo-500 hover:text-indigo-600 cursor-pointer">AdminShield</span>
// //                         </p>
// //                     </div>
// //                 </div>

// //                 {/* Decorative bottom bar */}
// //                 <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default AdminLogin;

// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Mail, Lock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
// import api from '../../api/axiosConfig';
// import { AuthContext } from '../../context/AuthContext'; // Import your context

// const AdminLogin = () => {
//     // 1. States for form data and UI feedback
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const navigate = useNavigate();
//     const { login } = useContext(AuthContext); // Get login function from context

//     // 2. Optimized Login Handler
//     const handleLogin = async (e) => {
//         e.preventDefault(); // Prevents page reload
//         setLoading(true);
//         setError("");

//         try {
//             // POST request to your startup-specific endpoint
//             const response = await api.post('/auth/startup/login', { 
//                 email, 
//                 password 
//             });
            
//             const { token, role } = response.data;

//             // Save token and role globally in AuthContext
//             login(token, role);

//             // Redirection logic
//             if (role === "STARTUP") {
//                 navigate("/startup/dashboard");
//             } else {
//                 // In case a non-startup tries to use this specific portal
//                 setError("This login is reserved for Startup accounts.");
//             }

//         } catch (err) {
//             // Error handling from backend
//             setError(
//                 err.response?.data?.message || 
//                 "Invalid email or password. Please try again."
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
//             <div className="bg-white/95 backdrop-blur-sm w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">

//                 {/* Header Section */}
//                 <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
//                     <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-y-6 origin-top-left translate-y-4"></div>
//                     <div className="relative z-10 flex flex-col items-center">
//                         <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 shadow-inner backdrop-blur-md">
//                             <ShieldCheck className="w-8 h-8 text-white" />
//                         </div>
//                         <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Startup Portal</h2>
//                         <p className="text-indigo-100 text-sm">Grow your team. Login to manage internships.</p>
//                     </div>
//                 </div>

//                 {/* Form Section */}
//                 <div className="p-8">
//                     {/* Error Display */}
//                     {error && (
//                         <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
//                             {error}
//                         </div>
//                     )}

//                     <form className="space-y-6" onSubmit={handleLogin}>
//                         <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700 block" htmlFor="email">Email Address</label>
//                             <div className="relative group">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
//                                 </div>
//                                 <input
//                                     id="email"
//                                     type="email"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
//                                     placeholder="startup@example.com"
//                                     required
//                                 />
//                             </div>
//                         </div>

//                         <div className="space-y-2">
//                             <label className="text-sm font-medium text-gray-700 block" htmlFor="password">Password</label>
//                             <div className="relative group">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
//                                 </div>
//                                 <input
//                                     id="password"
//                                     type="password"
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
//                                     placeholder="••••••••"
//                                     required
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center">
//                                 <input
//                                     id="remember-me"
//                                     name="remember-me"
//                                     type="checkbox"
//                                     className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                                 />
//                                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
//                                     Remember me
//                                 </label>
//                             </div>

//                             <div className="text-sm">
//                                 <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
//                                     Forgot password?
//                                 </a>
//                             </div>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
//                         >
//                             {loading ? (
//                                 <>
//                                     <Loader2 className="animate-spin mr-2 h-4 w-4" />
//                                     Authenticating...
//                                 </>
//                             ) : (
//                                 <>
//                                     Sign in as Startup
//                                     <ArrowRight className="ml-2 h-4 w-4" />
//                                 </>
//                             )}
//                         </button>
//                     </form>

//                     <div className="mt-6 text-center">
//                         <p className="text-xs text-gray-400">
//                             © 2024 Internship Portal. Secured by <span className="text-indigo-500 hover:text-indigo-600 cursor-pointer">AdminShield</span>
//                         </p>
//                     </div>
//                 </div>

//                 {/* Decorative bottom bar */}
//                 <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
//             </div>
//         </div>
//     );
// };

// export default AdminLogin;
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Loader2, Key } from 'lucide-react';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/ciic/login', { email, password });
      const { token, role } = res.data;
      if (role !== 'CIIC' && role !== 'STUDENT_ADMIN') throw new Error("Restricted access.");
      login(token, role);
      navigate(role === 'CIIC' ? "/ciic/dashboard" : "/student-admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Admin login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6">
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Central Admin</h1>
            <p className="text-slate-500 text-sm mt-1">Authorized personnel only</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-5 pr-4 py-4 bg-slate-950 border border-slate-800 text-white rounded-xl focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600" 
                placeholder="Admin Email" />
            </div>

            <div className="relative group">
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-5 pr-4 py-4 bg-slate-950 border border-slate-800 text-white rounded-xl focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600" 
                placeholder="Master Password" />
            </div>

            <button disabled={loading} className="w-full bg-white text-slate-950 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-400 transition-all flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin" /> : "Verify Identity"}
            </button>
          </form>
        </div>

        <p className="mt-10 text-center text-slate-600 text-[10px] uppercase tracking-[0.3em]">
          Secured by CIIC Neural Network
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;