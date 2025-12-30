import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Calendar, Banknote, 
  Briefcase, Globe, CheckCircle, Loader2,
  X, Send, ShieldCheck, AlertTriangle, UserCheck
} from 'lucide-react';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';
import { useDomains } from '../../context/DomainContext';
//useMemo not defined
import { useMemo } from 'react';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { domains } = useDomains();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState(null); 
  const [backendError, setBackendError] = useState("");
 const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const domainLabel = domains?.find(d => d.key === data?.domain)?.label || data?.domain || "Technical";

  useEffect(() => {
    fetchDetails();
     fetchStudentProfile();
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

const fetchStudentProfile = async () => {
    try {
      const res = await api.get("/student/profile/get-my-profile");
      // Note: If your response is the object directly, use res.data
      setProfile(res.data); 
    } catch (err) {
      console.error("Profile synchronization failed");
    } finally {
      setIsProfileLoading(false);
    }
  };

   const isProfileComplete = useMemo(() => {
    if (!profile) return false;
    
    // We check for the keys present in your JSON response
    const requiredFields = [
         // Cloudinary link
      'phone',           // Contact string
      'course',          // E.g. "CSE Cyber"
      'registerNumber'   // E.g. "240071601039"
    ];

    return requiredFields.every(field => {
      const value = profile[field];
      return value !== undefined && value !== null && value !== '';
    });
  }, [profile]);

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
    // 💡 Changed from fixed height to min-h-screen for mobile compatibility
    <div className="min-h-screen lg:h-[calc(100vh-100px)] flex flex-col font-sans max-w-7xl mx-auto lg:overflow-hidden px-4 md:px-8">
      
      {/* --- TOP NAVIGATION --- */}
      <div className="py-4 lg:py-6 shrink-0">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] group transition-all"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Explorer
        </button>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-24 lg:pb-6 min-h-0">
        
        {/* --- LEFT SIDE: HEADER & CONTENT --- */}
        <div className="lg:col-span-8 flex flex-col min-h-0 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-8 border border-slate-200 shadow-sm relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-50 rounded-full blur-[80px] -z-0 opacity-50 translate-x-10 -translate-y-10" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 shrink-0 flex items-center justify-center">
                <img src={data.startupLogo || "https://cdn-icons-png.flaticon.com/512/281/281764.png"} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl lg:text-3xl font-black text-slate-900 tracking-tighter leading-tight lg:truncate uppercase">{data.title}</h1>
                <p className="text-indigo-600 font-bold mt-1 flex items-center gap-2 text-xs lg:text-sm">
                  at {data.startupId?.name || "Startup Partner"} <Globe size={14} className="opacity-40" />
                </p>
              </div>
            </div>
          </div>

          {/* Details Modules - Scrollable on Desktop, Natural on Mobile */}
          <div className="lg:flex-1 lg:overflow-y-auto custom-scrollbar space-y-6 lg:pr-2">
            <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-10 border border-slate-200 shadow-sm space-y-10 lg:space-y-12">
              <section>
                <h3 className="text-md lg:text-lg font-black text-slate-900 flex items-center gap-3 mb-4 lg:mb-6 uppercase tracking-tighter border-l-4 border-indigo-600 pl-4">
                  Role Description
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium text-sm whitespace-pre-line">
                  {data.description || "No description provided."}
                </p>
              </section>

              <section>
                <h3 className="text-md lg:text-lg font-black text-slate-900 flex items-center gap-3 mb-4 lg:mb-6 uppercase tracking-tighter border-l-4 border-emerald-500 pl-4">
                  Core Requirements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.skillsRequired?.length > 0 ? (
                    data.skillsRequired.map((skill, idx) => (
                      <span key={idx} className="bg-slate-50 px-4 py-2 rounded-xl lg:rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-100 shadow-sm">
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

        {/* --- RIGHT SIDE: SUMMARY --- */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <div className="bg-[#020617] text-white rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden border border-white/5 flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
            <h3 className="text-[11px] lg:text-[14px] text-slate-400 uppercase tracking-[0.3em] mb-8 lg:mb-10 font-black">Internship Metadata</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 flex-1">
              <SidebarItem icon={Banknote} label="Stipend" value={data.stipend > 0 ? `₹${data.stipend}` : "No Stipend"} color="text-emerald-400" />
              <SidebarItem icon={Calendar} label="Duration" value={data.duration} color="text-indigo-400" />
              <SidebarItem icon={MapPin} label="Location" value={data.location} color="text-rose-400" />
              <SidebarItem icon={Briefcase} label="Domain" value={domainLabel} color="text-amber-400" />
            </div>

            {/* Apply Button (Hidden on very small mobile if using sticky bar, but visible for tablet/desktop) */}
            <div className="mt-10 pt-8 border-t border-white/5 hidden lg:block">
                <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-[1.5rem] font-black text-[16px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 group"
                >
                Quick Apply <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- STICKY MOBILE APPLY BAR --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-slate-100 z-50">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 flex items-center justify-center gap-3"
        >
          Quick Apply <Send size={14} />
        </button>
      </div>

      {/* --- MODAL (Responsive Adjustments) --- */}
     <AnimatePresence>
  {isModalOpen && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isApplying && setIsModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-12">
          <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>

          {isProfileLoading ? (
            <div className="py-10 flex flex-col items-center">
              <Loader2 className="animate-spin text-indigo-600 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Profile Data...</p>
            </div>
          ) : !appliedStatus ? (
            <>
              {!isProfileComplete ? (
                /* INCOMPLETE STATE */
                <div className="space-y-8">
                  <div>
                    <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-6 shadow-inner">
                      <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Profile Incomplete</h2>
                    <p className="text-slate-500 text-sm mt-3 font-medium leading-relaxed">
                      Your CIIC profile requires the following verified credentials before you can apply for internships.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Missing Credentials:</p>
                     <ul className="text-[11px] font-bold text-slate-700 space-y-2">
                        {/* {!profile?.resumeUrl && <li className="flex items-center gap-2 text-rose-600"><div className="w-1 h-1 rounded-full bg-rose-600" /> Professional Resume (PDF)</li>} */}
                        {!profile?.phone && <li className="flex items-center gap-2 text-rose-600"><div className="w-1 h-1 rounded-full bg-rose-600" /> Contact Number</li>}
                        {!profile?.course && <li className="flex items-center gap-2 text-rose-600"><div className="w-1 h-1 rounded-full bg-rose-600" /> Degree / Course Information</li>}
                        {!profile?.registerNumber && <li className="flex items-center gap-2 text-rose-600"><div className="w-1 h-1 rounded-full bg-rose-600" /> University Reg Number</li>}
                     </ul>
                  </div>

                  <button 
                    onClick={() => navigate('/student/profile')} 
                    className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 transition-all flex justify-center items-center gap-3"
                  >
                    Complete Profile
                  </button>
                </div>
              ) : (
                /* READY TO APPLY STATE */
                <div className="space-y-8">
                  <div>
                    <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-6 shadow-inner">
                      <ShieldCheck size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Submit Application</h2>
                    <p className="text-slate-500 text-sm mt-3 font-medium leading-relaxed">
                      Your verified profile and resume will be transmitted to <span className="font-bold text-indigo-600 uppercase">{data.startupId?.name}</span>.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center">
                          <CheckCircle className="text-emerald-500" size={20} />
                      </div>
                      <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Profile Status</p>
                          <p className="text-[11px] font-bold text-slate-900 uppercase">Verified & Ready</p>
                      </div>
                  </div>

                  <button onClick={handleApply} disabled={isApplying} className="w-full bg-slate-950 text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 transition-all flex justify-center items-center gap-3 disabled:opacity-50">
                    {isApplying ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    Transmit Application
                  </button>
                </div>
              )}
            </>
          ) : (
            /* SUCCESS STATE */
            <div className="text-center py-8">
                <CheckCircle size={56} className="text-emerald-500 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Success!</h2>
                <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-widest">Entry Logged in System</p>
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
  <div className="flex items-center gap-4 lg:gap-5">
    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-[1.2rem] bg-white/5 flex items-center justify-center border border-white/5 shadow-inner shrink-0 ${color}`}>
      <Icon size={18} />
    </div>
    <div className="min-w-0">
      <p className="text-[8px] lg:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 leading-none">{label}</p>
      <p className="text-xs lg:text-sm font-black tracking-tight leading-none truncate uppercase">{value}</p>
    </div>
  </div>
);

export default InternshipDetails;