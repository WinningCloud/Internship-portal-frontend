import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Calendar, Banknote, 
  Briefcase, Globe, Info, CheckCircle, Loader2,
  X, FileText, Send, AlertCircle, ShieldCheck, Sparkles
} from 'lucide-react';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import { useDomains } from '../../context/DomainContext';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { domains } = useDomains();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState(null); 
  const [backendError, setBackendError] = useState("");

  const domainLabel = domains?.find(d => d.key === data?.domain)?.label || data?.domain || "Technical";

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/student/internship/get-internship/${id}`);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching internship details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setIsApplying(true);
    setAppliedStatus(null);
    setBackendError("");
    try {
      await api.post("/student/application/apply-internship", { internshipId: id }); 
      setAppliedStatus('success');
      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/student/applications'); 
      }, 2500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Server connection failed";
      setBackendError(errorMessage);
      setAppliedStatus('error');
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600 w-12 h-12" />
    </div>
  );

  if (!data) return (
    <div className="h-screen flex items-center justify-center font-bold text-slate-500 italic">
      Internship details could not be loaded.
    </div>
  );

  return (
    // 💡 The container height is constrained to fit the window minus the navbar height
    <div className="h-[calc(100vh-100px)] flex flex-col font-sans max-w-7xl mx-auto overflow-hidden px-4 md:px-8">
      
      {/* --- TOP NAVIGATION (Fixed) --- */}
      <div className="py-4 shrink-0">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] group transition-all"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Explorer
        </button>
      </div>

      {/* --- MAIN CONTENT GRID (Constrained) --- */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-6">
        
        {/* --- LEFT SIDE: SCROLLABLE CONTENT --- */}
        <div className="lg:col-span-8 flex flex-col min-h-0 space-y-6">
          
          {/* Header Card (Sticky in local scope) */}
          <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-[100px] -z-0 opacity-50 translate-x-20 -translate-y-20" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 p-4 shrink-0 flex items-center justify-center">
                <img src={data.startupLogo || "https://cdn-icons-png.flaticon.com/512/281/281764.png"} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">

                <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight  truncate">{data.title}</h1>
                <p className="text-indigo-600 font-bold mt-1 flex items-center gap-2 text-sm">
                  at {data.startupId?.name || "Startup Partner"} <Globe size={14} className="opacity-40" />
                </p>
              </div>
            </div>
          </div>

          {/* Details Modules (This area scrolls) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-2">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm space-y-12">
              <section>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-6 uppercase tracking-tighter border-l-4 border-indigo-600 pl-4">
                  Role Description
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium text-sm whitespace-pre-line">
                  {data.description || "No description provided."}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-6 uppercase tracking-tighter border-l-4 border-emerald-500 pl-4">
                  Core Requirements
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {data.skillsRequired?.length > 0 ? (
                    data.skillsRequired.map((skill, idx) => (
                      <span key={idx} className="bg-slate-50 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-100 shadow-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-400 italic text-xs">General engineering proficiency required.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: FIXED SUMMARY --- */}
        <div className="lg:col-span-4 flex flex-col min-h-0 space-y-6">
          <div className="bg-[#020617] text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden border border-white/5 flex flex-col shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
            <h3 className="text-[14px] text-white text-slate-800 uppercase tracking-[0.3em] mb-10">Internship Details</h3>
            
            <div className="space-y-6 flex-1">
              <SidebarItem icon={Banknote} label="Stipend" value={data.stipend > 0 ? `₹${data.stipend}` : "No Stipend"} color="text-emerald-400" />
              <SidebarItem icon={Calendar} label="Duration" value={data.duration} color="text-indigo-400" />
              <SidebarItem icon={MapPin} label="Location" value={data.location} color="text-rose-400" />
              <SidebarItem icon={Briefcase} label="Domain" value={domainLabel} color="text-amber-400" />
            </div>

            <div className="mt-10 pt-8 border-t border-white/5">
                <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-[1.5rem] font-black text-[16px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 group"
                >
                Quick Apply <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </div>

          {/* <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 text-center shadow-sm shrink-0">
            <p className="text-[9px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Support Access</p>
            <a href="mailto:portal@ciic.res.in" className="text-xs font-black text-indigo-600 hover:underline tracking-tight uppercase">CIIC Administration</a>
          </div> */}
        </div>
      </div>

      {/* --- MODAL (Keeps existing logic) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isApplying && setIsModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
              <div className="p-12">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
                {!appliedStatus ? (
                  <div className="space-y-8">
                    <div>
                      <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-6 shadow-inner"><ShieldCheck size={40} /></div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Confirm Submission</h2>
                      <p className="text-slate-500 text-sm mt-3 font-medium leading-relaxed">Applying will transmit your profile and resume to <span className="font-bold text-indigo-600 uppercase">{data.startupId?.name}</span>.</p>
                    </div>
                    <button onClick={handleApply} disabled={isApplying} className="w-full bg-slate-950 text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 transition-all flex justify-center items-center gap-3 disabled:opacity-50">
                      {isApplying ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                      Submit Application
                    </button>
                  </div>
                ) : (
                    <div className="text-center py-8">
                        <CheckCircle size={56} className="text-emerald-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Success!</h2>
                    </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-5">
    <div className={`w-12 h-12 rounded-[1.2rem] bg-white/5 flex items-center justify-center border border-white/5 shadow-inner shrink-0 ${color}`}>
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 leading-none">{label}</p>
      <p className="text-m font-black  tracking-tight leading-none truncate uppercase">{value}</p>
    </div>
  </div>
);

export default InternshipDetails;