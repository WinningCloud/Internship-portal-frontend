import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Calendar, Clock, Building2, 
  Loader2, Inbox, ShieldCheck, Briefcase, 
  Banknote, Globe, Info, X, Trash2
} from "lucide-react";
import api from "../../api/axiosConfig.js";

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/student/application/get-my-applications");
      setApplications(res.data);
      setFilteredApps(res.data);
    } catch (err) { 
      console.error("Transmission Error"); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDeleteApplication = async (id) => {
    if (!window.confirm("Confirm withdrawal from this internship?")) return;
    try {
      await api.delete(`/student/application/delete-application/${id}`);
      setApplications(prev => prev.filter(app => app._id !== id));
      setSelectedApp(null);
    } catch (err) {
      alert("Withdrawal protocol failed.");
    }
  };

  useEffect(() => {
    let result = applications;
    if (statusFilter !== "ALL") result = result.filter(a => a.status.toUpperCase() === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.internshipId?.title?.toLowerCase().includes(q) || 
        a.startupId?.name?.toLowerCase().includes(q)
      );
    }
    setFilteredApps(result);
  }, [searchQuery, statusFilter, applications]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    // Responsive Height: Fixed on desktop, natural on mobile
    <div className="min-h-screen lg:h-[calc(100vh-100px)] flex flex-col font-sans max-w-[1600px] mx-auto px-4 md:px-6 lg:overflow-hidden bg-[#F8FAFC]">
      
      {/* --- 1. SYSTEM HEADER MODULE --- */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-6 shrink-0 pt-4">
        <div className="flex-1 bg-white border border-slate-200 rounded-[1.5rem] lg:rounded-[2rem] p-4 lg:p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
              <Briefcase size={20} className="lg:hidden" />
              <Briefcase size={28} className="hidden lg:block" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-black text-slate-900 uppercase tracking-tighter">My Applications</h1>
              <p className="text-[8px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Live Tracking System</p>
            </div>
          </div>

          <div className="hidden sm:flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 gap-1">
             <StatusToggle label="Active Logs" count={applications.length} active />
          </div>
        </div>

        <div className="w-full lg:w-96">
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={18} />
                <input
                    type="text" placeholder="Search entries..."
                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-sm text-slate-800 transition-all placeholder:text-slate-200"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* --- 2. CONTROLS AREA --- */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar shrink-0 px-1 py-1">
         <FilterBtn label="All" active={statusFilter === "ALL"} onClick={() => setStatusFilter("ALL")} />
         {["APPLIED", "SELECTED", "REJECTED", "SHORTLISTED"].map(s => (
            <FilterBtn key={s} label={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
         ))}
      </div>

      {/* --- 3. LIST MODULE --- */}
      <div className="flex-1 lg:overflow-hidden bg-white border border-slate-200 rounded-[2rem] lg:rounded-[2.5rem] shadow-sm flex flex-col mb-8 lg:mb-6">
        <div className="flex-1 lg:overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-4">
           <AnimatePresence mode="popLayout">
            {filteredApps.length > 0 ? filteredApps.map((app, index) => (
                <ApplicationRow 
                    key={app._id} 
                    app={app} 
                    onView={() => setSelectedApp(app)} 
                    index={index} 
                />
            )) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                    <Inbox size={48} className="text-slate-100 mb-4" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">No digital logs available</p>
                </div>
            )}
           </AnimatePresence>
        </div>
      </div>

      {/* --- DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white w-full h-full md:h-[85vh] md:max-w-4xl md:rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
              
              <div className="p-6 lg:p-10 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                 <div className="flex items-center gap-4 lg:gap-6">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-slate-900 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shrink-0">
                        <ShieldCheck size={24} className="lg:hidden" />
                        <ShieldCheck size={32} className="hidden lg:block" />
                    </div>
                    <div>
                        <h2 className="text-lg lg:text-2xl font-black text-slate-900 tracking-tighter uppercase leading-[1.1] max-w-[200px] lg:max-w-lg truncate lg:whitespace-normal">{selectedApp.internshipId?.title}</h2>
                        <div className="flex flex-wrap items-center gap-2 mt-1 lg:mt-2">
                           <StatusBadge status={selectedApp.status} />
                           <span className="hidden sm:inline text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Record #{selectedApp._id.slice(-6)}</span>
                        </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedApp(null)} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-8 lg:space-y-12 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    <DataModule label="Corporate Partner" value={selectedApp.startupId?.name} icon={Building2} />
                    <DataModule label="Deployment" value={selectedApp.internshipId?.domain?.replace('_', ' ')} icon={Globe} />
                    <DataModule label="Basis" value={selectedApp.internshipId?.location} icon={MapPin} />
                    <DataModule label="Compensation" value={selectedApp.internshipId?.stipend > 0 ? `₹${selectedApp.internshipId.stipend}` : "Non-Stipendiary"} icon={Banknote} />
                    <DataModule label="Commitment" value={selectedApp.internshipId?.duration} icon={Clock} />
                    <DataModule label="Archive Date" value={new Date(selectedApp.appliedAt).toLocaleDateString()} icon={Calendar} />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-4 py-1">
                        <Info size={14} className="text-slate-400" />
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Role Summary</h3>
                    </div>
                    <p className="text-xs lg:text-sm text-slate-500 font-bold leading-relaxed bg-slate-50/50 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 whitespace-pre-line">{selectedApp.internshipId?.description}</p>
                </div>
              </div>

              <div className="p-6 lg:p-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white shrink-0">
                  <button 
                    onClick={() => handleDeleteApplication(selectedApp._id)}
                    className="w-full sm:w-auto px-6 py-3 border border-rose-200 text-rose-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                  >
                    Withdraw Application
                  </button>
                  <button onClick={() => setSelectedApp(null)} className="w-full sm:w-48 py-4 lg:py-5 bg-slate-900 text-white rounded-xl lg:rounded-2xl font-black text-[10px] uppercase tracking-[0.3em]">Dismiss</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- SHARED COMPONENTS --- */

const ApplicationRow = ({ app, onView, index }) => (
    <motion.div
        layout
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-[#FBFBFE] border border-slate-100 p-4 lg:p-6 rounded-2xl lg:rounded-3xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-8 transition-all hover:border-slate-200 group"
    >
        <div className="flex items-center gap-4 lg:gap-6 flex-1 w-full min-w-0">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 shrink-0 group-hover:text-indigo-600 transition-colors">
                <Building2 size={24} />
            </div>
            <div className="min-w-0 flex-1">
                <h3 className="text-md lg:text-lg font-black text-slate-900 tracking-tight leading-tight uppercase truncate">{app.internshipId?.title || "Unknown Position"}</h3>
                <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-1 truncate">{app.startupId?.name}</p>
            </div>
            {/* Mobile Status Badge - Only visible on small screens */}
            <div className="lg:hidden shrink-0">
                <StatusBadge status={app.status} isSmall />
            </div>
        </div>

        <div className="hidden lg:flex items-center gap-10 px-8 border-x border-slate-100 h-10 shrink-0">
            <div className="text-center">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Entry Date</p>
                <p className="text-xs font-bold text-slate-700">{new Date(app.appliedAt).toLocaleDateString()}</p>
            </div>
            <StatusBadge status={app.status} />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-50">
            <div className="flex-1 lg:hidden text-left">
                 <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Entry Date</p>
                 <p className="text-[10px] font-bold text-slate-700">{new Date(app.appliedAt).toLocaleDateString()}</p>
            </div>
            <button onClick={onView} className="px-8 py-3 bg-slate-950 text-white rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 shadow-lg active:scale-95">
                Full Details
            </button>
        </div>
    </motion.div>
);

const FilterBtn = ({ label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl text-[8px] lg:text-[10px] font-black uppercase tracking-[0.15em] border transition-all whitespace-nowrap ${
        active ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-400 border-slate-200'
    }`}
  >
    {label}
  </button>
);

const StatusToggle = ({ label, count, active }) => (
    <div className={`flex flex-col items-center justify-center px-4 rounded-xl ${active ? 'bg-indigo-50/50' : ''}`}>
        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
        <p className={`text-sm font-black ${active ? 'text-indigo-600' : 'text-slate-800'}`}>{count < 10 ? `0${count}` : count}</p>
    </div>
);

const DataModule = ({ label, value, icon: Icon }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-2 text-slate-300 ml-1">
        <Icon size={12} />
        <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest leading-none">{label}</p>
    </div>
    <div className="bg-slate-50 border border-slate-100 p-3 lg:p-4 rounded-xl lg:rounded-[1.5rem] flex items-center justify-center text-center">
      <span className="text-[10px] lg:text-xs font-bold text-slate-800 uppercase tracking-tight truncate">{value || 'N/A'}</span>
    </div>
  </div>
);

const StatusBadge = ({ status, isSmall }) => {
    const config = {
        ACCEPTED: "text-emerald-600 bg-emerald-50 border-emerald-100",
        REJECTED: "text-rose-600 bg-rose-50 border-rose-100",
        SHORTLISTED: "text-indigo-600 bg-indigo-50 border-indigo-100",
        default: "text-amber-600 bg-amber-50 border-amber-100"
    };
    return (
        <span className={`${isSmall ? 'px-2 py-1 text-[7px]' : 'px-4 py-2 text-[9px]'} rounded-xl border font-black uppercase tracking-widest ${config[status] || config.default}`}>
            {status}
        </span>
    );
};

export default StudentApplications;