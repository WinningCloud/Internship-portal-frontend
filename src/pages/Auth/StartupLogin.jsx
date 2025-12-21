import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Rocket, ArrowLeft, Sparkles } from 'lucide-react';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

const StartupLogin = () => {
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
      const res = await api.post('/auth/startup/login', { email, password });
      login(res.data.token, res.data.role);
      navigate("/startup/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Startup authentication failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff5f7] p-6 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-200 rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200 rounded-full blur-[120px] opacity-50"></div>

      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg relative">
        <div className="bg-white/80 backdrop-blur-xl border border-white p-12 rounded-[3rem] shadow-2xl shadow-rose-200/50">
          <div className="text-center">
            <div className="inline-flex p-4 bg-rose-600 rounded-3xl shadow-lg shadow-rose-200 mb-6">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Startup Portal</h2>
            <p className="text-rose-500 font-semibold text-sm uppercase tracking-widest mt-2 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Hire the Future
            </p>
          </div>

          {error && <div className="mt-8 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 text-center text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-white border border-rose-100 rounded-2xl focus:ring-4 focus:ring-rose-100 outline-none transition-all placeholder:text-slate-300" 
              placeholder="Business Email Address" />
            
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-white border border-rose-100 rounded-2xl focus:ring-4 focus:ring-rose-100 outline-none transition-all placeholder:text-slate-300" 
              placeholder="Secure Password" />

            <button disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-rose-200 transition-all active:scale-95 flex justify-center">
              {loading ? <Loader2 className="animate-spin" /> : "Access Dashboard"}
            </button>
          </form>

          <button onClick={() => navigate('/')} className="mt-8 w-full text-slate-400 hover:text-rose-600 transition text-sm font-medium">
            Not a Startup? Go back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default StartupLogin;