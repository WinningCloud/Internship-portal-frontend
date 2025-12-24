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
      const { token, role, id } = res.data;
      if (role !== 'CIIC' && role !== 'STUDENT_ADMIN') throw new Error("Restricted access.");
      login(token, role, id);
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