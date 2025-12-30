import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Loader2, Mail, Lock, ArrowLeft } from 'lucide-react';
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
    setError("");
    try {
      const res = await api.post('/auth/ciic/login', { email, password });
      const { token, role, id } = res.data;
      
      // Keep your specific admin role logic
      if (role !== 'CIIC' && role !== 'STUDENT_ADMIN') {
        throw new Error("Restricted access. Authorized personnel only.");
      }
      
      login(token, role, id);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Admin login failed");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6 font-sans">
      
      {/* --- MINIMAL BACK BUTTON --- */}
      <button 
        onClick={() => navigate('/')} 
        className="fixed top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-xs font-semibold tracking-wide"
      >
        <ArrowLeft size={14} /> BACK TO PORTAL
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-[440px]"
      >
        {/* --- BRAND LOGO (Modified for Admin) --- */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md mb-6 text-white">
             <ShieldAlert size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Central Admin</h1>
          <p className="text-slate-500 text-sm mt-2">Authorized personnel and system curators only.</p>
        </div>

        {/* --- LOGIN CARD --- */}
        <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Admin Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1">Admin Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-400 text-sm font-medium" 
                  placeholder="admin@ciic.res.in" 
                />
              </div>
            </div>

            {/* Master Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-700">Master Password</label>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-400 text-sm font-medium" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              disabled={loading} 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 mt-4 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Verifying Identity...</span>
                </>
              ) : (
                <span>Access Portal</span>
              )}
            </button>
          </form>
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 opacity-40">
            <div className="h-px w-12 bg-slate-300"></div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">
              Secured by CIIC Systems
            </span>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;