import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, GraduationCap, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post('/auth/student/login', { email, password });
      if (res.data.user.role !== 'STUDENT') throw new Error("Please use the correct portal.");
      login(res.data.token, res.data.user.role);
      navigate("/student/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid credentials");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side: Visual Branding */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center space-x-3 text-white">
            <GraduationCap className="w-10 h-10" />
            <span className="text-2xl font-black tracking-tighter">CIIC STUDENT</span>
          </div>
        </motion.div>

        <div className="relative z-10">
          <h2 className="text-5xl font-bold text-white leading-tight">Your gateway to <br />top-tier startups.</h2>
          <div className="mt-8 space-y-4">
            {['Verified Startups', 'Smart Application Tracking', 'Digital Certificates'].map((text, i) => (
              <div key={i} className="flex items-center text-indigo-100 space-x-2">
                <CheckCircle className="w-5 h-5 text-indigo-300" />
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-indigo-200 text-sm italic">©Crescent Innovation and Incubation Council </p>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <button onClick={() => navigate('/')} className="mb-8 flex items-center text-slate-400 hover:text-indigo-600 transition group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </button>
          
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back!</h2>
          <p className="text-slate-500 mt-2">Log in to check latest internship opportunites.</p>

          {error && <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">University Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all outline-none" 
                  placeholder="name@university.edu" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all outline-none" 
                  placeholder="••••••••" />
              </div>
            </div>

            <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin" /> : "Log in to dashboard"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500">
            Don't have an account? <Link to="/register/student" className="text-indigo-600 font-bold hover:underline">Register Now</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentLogin;