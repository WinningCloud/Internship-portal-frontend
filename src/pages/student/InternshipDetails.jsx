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

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState(null); // 'success' | 'error'
  const [backendError, setBackendError] = useState("");

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
      // FIX: Passing id directly as a string value
      const response = await api.post("/student/application/apply-internship", {
        internshipId: id 
      }); 

      console.log("Application Successful:", response.data);
      setAppliedStatus('success');

      // Redirect after showing success state
      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/student/applications'); 
      }, 2500);

    } catch (err) {
      // LOGGING THE EXACT ERROR FROM BACKEND
      const errorMessage = err.response?.data?.message || "Server connection failed";
      console.error("BACKEND ERROR LOG:", {
        status: err.response?.status,
        data: err.response?.data,
        message: errorMessage
      });

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
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-8">
      {/* --- TOP NAVIGATION --- */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] group transition-all"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Explorer
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* --- MAIN CONTENT (LEFT) --- */}
        <div className="lg:col-span-8 space-y-10">
          
          <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-[100px] -z-0 opacity-50 translate-x-20 -translate-y-20" />
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
              <div className="w-28 h-28 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-5 shrink-0 flex items-center justify-center group-hover:rotate-3 transition-transform">
                <img 
                  src={data.startupLogo || "https://cdn-icons-png.flaticon.com/512/281/281764.png"} 
                  alt="Logo"
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                  <Sparkles size={12} /> CIIC Verified Opportunity
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-tight  ">{data.title}</h1>
                <p className="text-indigo-600 font-bold mt-3 flex items-center justify-center md:justify-start gap-2 text-lg">
                  at {data.startupId?.name || "Startup Partner"} <Globe size={16} className="opacity-40" />
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-200 shadow-sm space-y-12">
            <section>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-6 uppercase tracking-tighter italic border-l-4 border-indigo-600 pl-4">
                Role Description
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium text-base whitespace-pre-line">
                {data.description || "No description provided."}
              </p>
            </section>

            <section>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-6 uppercase tracking-tighter italic border-l-4 border-emerald-500 pl-4">
                Core Requirements
              </h3>
              <div className="flex flex-wrap gap-3">
                {data.skillsRequired?.length > 0 ? (
                  data.skillsRequired.map((skill, idx) => (
                    <span key={idx} className="bg-slate-50 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 border border-slate-100 shadow-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-400 italic text-sm">General engineering proficiency required.</p>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* --- SIDEBAR ACTION (RIGHT) --- */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-[#020617] text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-12">Snapshot Details</h3>
            
            <div className="space-y-8 mb-14">
              <SidebarItem 
                icon={Banknote} 
                label="Monthly Stipend" 
                value={data.stipend > 0 ? `₹${data.stipend}` : "No Stipend"} 
                color="text-emerald-400" 
              />
              <SidebarItem icon={Calendar} label="Duration" value={data.duration} color="text-indigo-400" />
              <SidebarItem icon={MapPin} label="Location" value={data.location} color="text-rose-400" />
              <SidebarItem icon={Briefcase} label="Portal Domain" value={data.domain || "Technical"} color="text-amber-400" />
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-indigo-950/50 transition-all active:scale-95 flex items-center justify-center gap-3 group"
            >
              Apply Position <Send size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 text-center shadow-sm">
            <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">Support Inquiry</p>
            <a href="mailto:portal@ciic.res.in" className="text-sm font-black text-indigo-600 hover:underline tracking-tight">CIIC Administration</a>
          </div>
        </div>
      </div>

      {/* --- APPLICATION MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isApplying && setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-12 md:p-16">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-12 right-12 p-2 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all active:scale-90"
                >
                  <X size={20} />
                </button>

                {!appliedStatus ? (
                  <div className="space-y-10">
                    <div>
                      <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-8 shadow-inner">
                        <ShieldCheck size={40} />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Confirm Submission</h2>
                      <p className="text-slate-500 text-sm mt-3 font-medium leading-relaxed">
                        Ready to apply? We will share your CIIC student profile and resume with the hiring managers at <span className="font-bold text-indigo-600 uppercase">{data.startupId?.name}</span>.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200 flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 border border-slate-100 shrink-0">
                          <FileText size={32} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate tracking-tight uppercase">Primary_Resume.pdf</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Sourced from profile</p>
                        </div>
                    </div>

                    <button 
                      onClick={handleApply}
                      disabled={isApplying}
                      className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isApplying ? <Loader2 className="animate-spin w-5 h-5" /> : <Send size={18} />}
                      {isApplying ? "Authenticating..." : "Submit Application"}
                    </button>
                  </div>
                ) : appliedStatus === 'success' ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                    <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-10 shadow-inner">
                      <CheckCircle size={56} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Applied!</h2>
                    <p className="text-slate-500 mt-4 font-bold text-sm">Your details were successfully transmitted. Redirecting you to your history...</p>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                    <div className="w-28 h-28 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-10 shadow-inner">
                      <AlertCircle size={56} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Notice</h2>
                    <p className="text-slate-500 mt-4 font-bold text-sm px-4">
                      {backendError || "You have already applied for this role or the session expired."}
                    </p>
                    <button 
                      onClick={() => setAppliedStatus(null)} 
                      className="mt-10 bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
                    >
                      Retry Submission
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- HELPER SUB-COMPONENT --- */
const SidebarItem = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-6">
    <div className={`w-14 h-14 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/5 shadow-inner shrink-0 ${color}`}>
      <Icon size={24} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">{label}</p>
      <p className="text-base font-black text-slate-100 tracking-tight truncate">{value}</p>
    </div>
  </div>
);

export default InternshipDetails;