import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, ArrowUpRight, Loader2, 
  GraduationCap, Target, Award 
} from 'lucide-react';
import api from '../../api/axiosConfig.js';

const ProfileStatusCard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await api.get('/student/profile/get-my-profile');
        setProfile(res.data);
      } catch (err) {
        console.error("Profile snapshot unavailable");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading) return (
    <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[2.5rem] p-8 flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-indigo-600" size={24} />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-4 bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-sm group hover:border-indigo-200 transition-all font-sans"
    >
      {/* --- TOP: STATUS & COMPLETION --- */}
      <div>
        <div className="flex justify-between items-start mb-8">
          <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-lg group-hover:bg-indigo-600 transition-all">
            <ShieldCheck size={24} />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Identity Status</p>
            <p className="text-sm font-black text-slate-900 uppercase mt-1">
              {profile?.isVerified ? "CIIC Verified" : "Verified User"}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Profile Strength</p>
              <span className="text-xs font-black text-indigo-600">{profile?.profileCompletion || 0}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${profile?.profileCompletion || 0}%` }}
                className="h-full bg-indigo-600 rounded-full"
              />
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mb-1">Academic Year</p>
               <p className="text-xs font-black text-slate-800 uppercase">Year {profile?.yearOfStudy || "—"}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mb-1">Standing CGPA</p>
               <p className="text-xs font-black text-slate-800 uppercase">{profile?.cgpa || "0.0"}</p>
            </div>
          </div>

          {/* Skills Preview */}
          <div className="space-y-3">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Key Endorsements</p>
             <div className="flex flex-wrap gap-1.5">
                {profile?.skills?.length > 0 ? (
                  profile.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-300 font-medium italic-off">No skills added to portfolio</p>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM: ACTION --- */}
      <div className="mt-10 space-y-4">
        <h3 className="text-xl font-bold text-slate-900 leading-tight uppercase tracking-tighter">
          Maintain your <br /> industry dossier.
        </h3>
        <button 
          onClick={() => navigate('/student/profile')}
          className="w-full py-4 bg-slate-950 hover:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-95"
        >
          Update Portfolio <ArrowUpRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileStatusCard;