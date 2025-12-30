import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, ShieldCheck, 
  Loader2, ArrowLeft, GraduationCap, 
  CheckCircle2, Sparkles 
} from 'lucide-react';
import api from '../../api/axiosConfig';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: "", 
    email: "", 
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Domain Validation
    if (!formData.email.endsWith('@crescent.education')) {
      setError("Registration restricted to @crescent.education emails only.");
      setLoading(false);
      return;
    }

    // 2. Password Match Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Send only required fields to the backend
      const { confirmPassword, ...submitData } = formData;
      await api.post('/auth/student/register', submitData);
      
      alert("Account created successfully! Welcome to the portal.");
      navigate("/login/student");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all outline-none placeholder:text-slate-400 font-medium";
  const labelStyle = "text-sm font-bold text-slate-700 ml-1 mb-2 block";

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-indigo-100">
      
      {/* --- LEFT SIDE: THE BRAND PANEL --- */}
      <div className="hidden lg:flex w-5/12 bg-[#4f46e5] relative flex-col justify-between p-16 overflow-hidden text-white">
        {/* Animated Background Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-300/40 via-transparent to-transparent blur-3xl"
        />

        <div className="relative z-10">
          {/* <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 mb-12"
          >
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-xl border border-white/20 shadow-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic">CRESCENT<span className="text-indigo-200 not-italic font-light ml-1">PORTAL</span></span>
          </motion.div> */}
          
          <motion.h1 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-black leading-[1.05] mb-8"
          >
            Empowering <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-100 to-indigo-300">Talent.</span>
          </motion.h1>
          <p className="text-indigo-100 text-lg leading-relaxed max-w-sm font-medium">
            Join the elite network of students securing internships at premium CIIC-incubated startups.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 space-y-5"
        >
          {["Exclusive Opportunities", "Verified Startup Network", "Skill-based Matching"].map((text, idx) => (
            <div key={idx} className="flex items-center space-x-4 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default group">
              <div className="bg-indigo-400/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5 text-indigo-200" />
              </div>
              <span className="text-indigo-50 font-semibold tracking-wide">{text}</span>
            </div>
          ))}
        </motion.div>

        <div className="relative z-10 text-indigo-300/60 text-[10px] uppercase font-bold tracking-[0.3em]">
          © 2025 CIIC Incubation Council
        </div>
      </div>

      {/* --- RIGHT SIDE: THE FORM PANEL --- */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-slate-50/50">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100"
        >
          {/* Header */}
          <div className="mb-12">
            <button 
              onClick={() => navigate('/login/student')} 
              className="mb-8 flex items-center text-slate-400 hover:text-indigo-600 transition group font-bold text-xs uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
              Back to Sign In
            </button>
            <h2 className="text-4xl font-black text-slate-900 flex items-center gap-3">
              Get Started <Sparkles className="w-8 h-8 text-indigo-500" />
            </h2>
            <p className="text-slate-400 mt-3 font-medium">Create your university account to continue.</p>
          </div>

          {/* Alert Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 text-sm font-bold flex items-center gap-3"
            >
              <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
              {error}
            </motion.div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name */}
            <div className="space-y-2">
              <label className={labelStyle}>Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  required 
                  className={inputStyle}
                  placeholder="John Doe"
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className={labelStyle}>University Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="email" 
                  required 
                  className={inputStyle}
                  placeholder="id@crescent.education"
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelStyle}>Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="password" 
                    required 
                    className={inputStyle}
                    placeholder="••••••••"
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelStyle}>Confirm</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="password" 
                    required 
                    className={inputStyle}
                    placeholder="••••••••"
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              disabled={loading}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Processing
                </>
              ) : (
                <>
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Redirect to Login */}
          <p className="mt-10 text-center text-slate-400 font-semibold text-sm">
            Already registered? 
            <Link to="/login/student" className="text-indigo-600 font-black hover:underline ml-2">
              SIGN IN
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentRegister;