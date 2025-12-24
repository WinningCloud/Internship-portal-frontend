import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Users,
  Calendar,
  MapPin,
  Edit3,
  Trash2,
  ExternalLink,
  Loader2,
  Inbox,
  Clock,
  Briefcase,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import api from "../../api/axiosConfig.js";

const ManageInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyInternships();
  }, []);

  const fetchMyInternships = async () => {
    try {
      // Updated to your specific endpoint
      const res = await api.get("/startup/get-internships"); 
      setInternships(res.data);
    } catch (err) {
      console.error("Error fetching internships", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInternships = internships.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
          <div className="absolute inset-0 blur-2xl bg-rose-400/20 animate-pulse"></div>
          <p className="mt-6 text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Accessing Console</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1500px] mx-auto pb-20 px-4 md:px-8">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest">
            <Briefcase size={12} /> Recruitment Hub
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Manage Internships</h1>
          <p className="text-slate-500 font-medium text-sm">Review, track, and manage your active career opportunities.</p>
        </div>
        
        <Link
          to="/startup/internships/create"
          className="group flex items-center justify-center gap-3 bg-slate-900 hover:bg-rose-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 transition-all active:scale-95"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
          <span>Post New Internship</span>
        </Link>
      </div>

      {/* --- ANALYTICS TILES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <MetricCard label="Active Roles" value={internships.length} icon={Calendar} theme="rose" />
        <MetricCard label="Total Applicants" value={internships.reduce((acc, curr) => acc + (curr.applicationsCount || 0), 0)} icon={Users} theme="indigo" />
        <MetricCard label="Growth Index" value="+12%" icon={TrendingUp} theme="emerald" />
      </div>

      {/* --- FILTER & SEARCH BAR --- */}
      <div className="sticky top-20 z-40 bg-slate-50/90 backdrop-blur-md py-6 mb-8 border-b border-slate-200/60">
        <div className="relative w-full max-w-2xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search your postings by title or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-rose-50 outline-none transition-all font-semibold text-slate-700"
          />
        </div>
      </div>

      {/* --- MANAGEMENT LIST --- */}
      <div className="space-y-5">
        <AnimatePresence mode="popLayout">
          {filteredInternships.length > 0 ? (
            filteredInternships.map((job, index) => (
              <InternshipManagementRow key={job._id} job={job} index={index} navigate={navigate} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-40 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center"
            >
              <Inbox size={60} className="text-slate-100 mb-6" />
              <div className="text-slate-400 font-black text-xl uppercase tracking-tighter italic">Console Empty</div>
              <p className="text-slate-400 text-sm mt-2 font-medium">You haven't posted any internships yet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const MetricCard = ({ label, value, icon: Icon, theme }) => {
  const themes = {
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-lg transition-all duration-300">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
      </div>
      <div className={`p-5 rounded-[1.5rem] border ${themes[theme]}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

const InternshipManagementRow = ({ job, index, navigate }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-slate-200 p-6 md:p-8 rounded-[2.5rem] flex flex-col xl:flex-row items-center justify-between gap-8 hover:shadow-2xl hover:shadow-rose-100/30 transition-all group relative overflow-hidden"
    >
      {/* Visual Accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Info Section */}
      <div className="flex items-center gap-8 flex-1 w-full xl:w-auto">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-3 transition-transform duration-500">
          <Clock className="text-rose-600/40" size={28} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500">
              {job.domain || "CIIC Startup"}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
               Live
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 truncate tracking-tight uppercase italic">{job.title}</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <MapPin size={14} className="text-rose-500" /> {job.location}
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-200" />
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
              {job.duration}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Section */}
      <div className="hidden lg:grid grid-cols-2 gap-12 px-12 border-x border-slate-100">
        <div className="text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Applicants</p>
          <div className="flex items-center justify-center gap-2.5">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             <span className="text-2xl font-black text-slate-900 leading-none">{job.applicationsCount || 0}</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Stipend</p>
          <span className="text-lg font-black text-slate-600 italic">₹{job.stipend}</span>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-3 w-full xl:w-auto">
        <button 
          onClick={() => navigate(`/startup/internships/${job._id}/applications`)}
          className="flex-1 xl:flex-none flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-slate-200 group/btn"
        >
          <span>Applicants</span>
          <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
        
        <div className="flex gap-2">
            <button className="p-4 bg-white text-slate-400 rounded-2xl hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-200 shadow-sm active:scale-90">
                <Edit3 size={20} />
            </button>
            <button className="p-4 bg-white text-slate-400 rounded-2xl hover:text-red-600 hover:bg-red-50 transition-all border border-slate-200 shadow-sm active:scale-90">
                <Trash2 size={20} />
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageInternships;