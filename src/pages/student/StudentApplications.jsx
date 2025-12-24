import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Calendar, Clock, Building2, 
  ChevronRight, Loader2, Inbox, CheckCircle2, 
  AlertCircle, X, ShieldCheck, Briefcase, 
  Banknote, Globe, Info, Hash, Trash2
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
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleDeleteApplication = async (id) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;
    try {
      await api.delete(`/student/application/delete-application/${id}`);
      setApplications(prev => prev.filter(app => app._id !== id));
      setSelectedApp(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete application");
    }
  };

  useEffect(() => {
    let result = applications;
    if (statusFilter !== "ALL") result = result.filter(a => a.status.toUpperCase() === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => a.internshipId?.title?.toLowerCase().includes(q) || a.startupId?.name?.toLowerCase().includes(q));
    }
    setFilteredApps(result);
  }, [searchQuery, statusFilter, applications]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-[1500px] mx-auto pb-20 px-4 md:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">My Applications</h1>
        <p className="text-slate-500 font-medium text-sm">Track your progress with CIIC startups.</p>
      </div>

      {/* --- FILTERS --- */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text" placeholder="Search role..."
            className="w-full pl-14 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-semibold text-slate-700 transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2">
          {["ALL", "APPLIED", "REVIEWING", "ACCEPTED", "REJECTED"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${statusFilter === s ? "bg-slate-900 text-white border-slate-900 shadow-lg" : "bg-white text-slate-500 hover:border-slate-400"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* --- LIST --- */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredApps.map((app, index) => (
            <motion.div
              layout key={app._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
              className="bg-white border border-slate-200 p-6 rounded-[2.5rem] flex flex-col lg:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden"
            >
              <div className="flex items-center gap-6 flex-1 w-full lg:w-auto">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"><Building2 className="text-slate-300" size={28} /></div>
                <div className="min-w-0 flex-1">
                   <h3 className="text-xl font-black text-slate-900 leading-tight uppercase italic break-words">{app.internshipId?.title || "Role Title"}</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{app.startupId?.name || "Startup Name"}</p>
                </div>
              </div>

              <div className="flex items-center gap-8 px-8 border-x border-slate-100 hidden xl:flex shrink-0">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Applied</p>
                    <p className="text-xs font-bold text-slate-600">{new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest ${app.status === 'ACCEPTED' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-amber-600 bg-amber-50 border-amber-100'}`}>
                    {app.status}
                  </div>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
                <button onClick={() => setSelectedApp(app)} className="flex-1 lg:flex-none px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">
                  Details
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- MODAL --- */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="p-10 md:p-14">
                <button onClick={() => setSelectedApp(null)} className="absolute top-10 right-10 p-2 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
                
                <div className="flex items-start gap-6 mb-10">
                  <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 border border-indigo-100 shrink-0"><ShieldCheck size={32} /></div>
                  <div className="min-w-0">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-[1.1] mb-2">{selectedApp.internshipId?.title}</h2>
                    <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">{selectedApp.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  <DetailBlock icon={Building2} label="Startup" value={selectedApp.startupId?.name} />
                  <DetailBlock icon={Globe} label="Domain" value={selectedApp.internshipId?.domain?.replace('_', ' ')} />
                  <DetailBlock icon={MapPin} label="Location" value={selectedApp.internshipId?.location} />
                  <DetailBlock icon={Banknote} label="Stipend" value={selectedApp.internshipId?.stipend > 0 ? `₹${selectedApp.internshipId.stipend}` : "No Stipend"} />
                  <DetailBlock icon={Clock} label="Duration" value={selectedApp.internshipId?.duration} />
                  <DetailBlock icon={Calendar} label="Date" value={new Date(selectedApp.appliedAt).toLocaleDateString()} />
                </div>

                <div className="space-y-4 mb-10">
                   <div className="flex items-center gap-2 text-slate-900 font-black text-[10px] uppercase tracking-widest italic border-l-4 border-indigo-600 pl-3">Description</div>
                   <p className="text-sm text-slate-500 leading-relaxed font-medium bg-slate-50 p-6 rounded-3xl border border-slate-100 whitespace-pre-line">{selectedApp.internshipId?.description}</p>
                </div>

                {/* --- FOOTER: DELETE/WITHDRAW --- */}
                <div className="flex items-center gap-4 border-t border-slate-100 pt-8 mt-4">
                    <button 
                      onClick={() => handleDeleteApplication(selectedApp._id)}
                      className="flex-1 py-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Withdraw Application
                    </button>
                    <button onClick={() => setSelectedApp(null)} className="w-32 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Dismiss</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailBlock = ({ icon: Icon, label, value }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</p>
    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
      <Icon size={14} className="text-indigo-400 shrink-0" />
      <span className="text-xs font-bold text-slate-700 truncate tracking-tight uppercase italic">{value || 'N/A'}</span>
    </div>
  </div>
);

export default StudentApplications;