import React, { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Banknote,
  Bookmark,
  ChevronRight,
  Clock,
  Loader2,
  Sparkles,
  ArrowUpRight,
  Filter,
  Briefcase,
  Zap,
  Globe,
  Info,
  Eye,
  ShieldCheck,
  Trophy,
  CheckCircle,
  Command
} from "lucide-react";

import api from "../../api/axiosConfig.js";
import { useDomains } from "../../context/DomainContext.jsx";
import { AuthContext } from "../../context/AuthContext";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { domains, loading: domainsLoading } = useDomains();
  const { user } = useContext(AuthContext);

  // User Display Mapping
  const studentName = user?.fullName || user?.name || "Learner";

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDomain, setActiveDomain] = useState("ALL");

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await api.get("/student/internship/get-internships");
        setInternships(res.data);
      } catch (err) {
        console.error("Fetch failure", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  const filteredInternships = useMemo(() => {
    return internships.filter((job) => {
      const matchesDomain = activeDomain === "ALL" || job.domain === activeDomain;
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDomain && matchesSearch;
    });
  }, [internships, activeDomain, searchQuery]);

  if (loading || domainsLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Syncing Environment</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-20 px-4 md:px-8">
      
      {/* ---------------- 1. DYNAMIC BENTO HERO HUB ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 mt-6">
        
        {/* Left Module: Primary CTA (7 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 bg-white border border-slate-200 rounded-[3rem] p-10 md:p-14 relative overflow-hidden shadow-sm group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:bg-indigo-100 transition-colors" />
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
              <Sparkles size={12} className="text-indigo-400" /> {greeting}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase">
              Hello, <span className="text-indigo-600">{studentName.split(' ')[0]}</span>. <br />
              Grow your career.
            </h1>
            
            <p className="text-slate-500 font-medium text-lg max-w-md leading-relaxed">
              Explore {internships.length} exclusive career-start opportunities vetted by CIIC Council.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center gap-2">
                Launch Explorer <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Module: Illustration/Status (5 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-5 bg-[#020617] rounded-[3rem] p-10 relative overflow-hidden flex flex-col justify-between shadow-2xl border border-white/10"
        >
           {/* Ghost illustration */}
          <div className="absolute inset-0 opacity-15 pointer-events-none grayscale brightness-200 scale-150 translate-x-20">
             <img src="https://illustrations.popsy.co/white/remote-work.svg" alt="" className="w-full h-full object-cover" />
          </div>

          <div className="relative z-10 flex justify-between items-start">
             <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
               <ShieldCheck size={28} />
             </div>
             <div className="text-right">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Session Data</p>
               <p className="text-sm font-black text-white uppercase">Profile Verified</p>
             </div>
          </div>

          <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem]">
              <div className="flex items-center gap-4">
                <Trophy className="text-amber-500" size={24} />
                <div>
                   <p className="text-white text-base font-bold leading-none">Portfolio Health</p>
                   <p className="text-[10px] text-slate-400 uppercase mt-1 font-bold tracking-widest">Score: Optimal (94%)</p>
                </div>
              </div>
          </div>
        </motion.div>
      </div>

      {/* ---------------- 2. ANALYTICS STATS ---------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 px-2">
          <AnalyticsStat icon={Briefcase} label="All Postings" value={internships.length} color="indigo" />
          <AnalyticsStat icon={Clock} label="Live Soon" value="12h" color="amber" />
          <AnalyticsStat icon={Globe} label="Portal Areas" value={domains.length} color="emerald" />
          <AnalyticsStat icon={Command} label="Verified" value="100%" color="rose" />
      </div>

      {/* ---------------- 3. STICKY ACTION BAR ---------------- */}
      <div className="sticky top-20 z-40 bg-[#F8FAFC]/95 backdrop-blur-md py-6 mb-12 border-b border-slate-200/50 flex flex-col xl:flex-row gap-6 items-center">
        <div className="relative flex-1 xl:max-w-3xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by internship role or startup name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 py-4.5 bg-white rounded-2xl border border-slate-200 shadow-sm focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-700"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 w-full xl:w-auto">
          <FilterPill label="Global Portal" active={activeDomain === "ALL"} onClick={() => setActiveDomain("ALL")} />
          {domains.map((d) => (
            <FilterPill key={d.key} label={d.label} active={activeDomain === d.key} onClick={() => setActiveDomain(d.key)} />
          ))}
        </div>
      </div>

      {/* ---------------- 4. INTERNSHIP FEED (WIDE GRID) ---------------- */}
      <section>
        <div className="flex items-center gap-4 mb-10 px-2 uppercase">
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 italic">Available Tracks</h2>
          <div className="h-px flex-1 bg-slate-200"></div>
          <span className="text-[10px] font-bold text-slate-400 tracking-widest">Feed Update • Instant</span>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredInternships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {filteredInternships.map((job, i) => (
                <JobFeedCard
                  key={job._id}
                  data={job}
                  navigate={navigate}
                  domains={domains}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div className="py-40 bg-white border-2 border-dashed border-slate-200 rounded-[3rem] text-center flex flex-col items-center">
                <Search size={40} className="text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">No matching opportunities found</p>
            </div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

/* --- MINI REUSABLE MODULES --- */

const AnalyticsStat = ({ icon: Icon, label, value, color }) => {
    const palette = {
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        rose: "text-rose-600 bg-rose-50 border-rose-100"
    };
    return (
        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
            <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-black text-slate-900">{value}</p>
            </div>
            <div className={`p-3.5 rounded-2xl border ${palette[color]} group-hover:scale-105 transition-transform`}>
                <Icon size={20} />
            </div>
        </div>
    );
};

const FilterPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap shadow-sm ${
      active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-900"
    }`}
  >
    {label}
  </button>
);

const JobFeedCard = ({ data, domains, navigate, index }) => {
  // Use Context for professional label
  const label = domains?.find(d => d.key === data.domain)?.label || data.domain || "Standard";
  
  return (
    <motion.div
      layout
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border-2 border-slate-100 p-8 rounded-[3rem] flex flex-col justify-between h-[480px] shadow-sm hover:shadow-2xl transition-all duration-500 group relative"
    >
      <div>
        <div className="flex justify-between items-start mb-8">
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
            <Globe size={14} className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tight">{label}</span>
          </div>
          <button className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-900 hover:text-white transition-all transform active:scale-90">
            <Bookmark size={18} />
          </button>
        </div>

        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-slate-100 p-4 shrink-0 group-hover:rotate-3 transition-transform duration-500 overflow-hidden">
             <img src={data.startupLogo || "https://cdn-icons-png.flaticon.com/512/281/281764.png"} className="w-full h-full object-contain" alt="Org Logo" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate">{data.companyName || "CIIC Startup"}</p>
            <h3 className="text-2xl font-black text-slate-900 leading-none uppercase truncate group-hover:text-indigo-600 transition-colors mt-1 tracking-tight">{data.title}</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 px-1">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-600 tracking-tight">
                <ShieldCheck size={12} className="text-indigo-600" /> Vetted Member
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-600 tracking-tight">
                <Clock size={12} className="text-indigo-600" /> 
                {data.applicationDeadline ? `Closing ${new Date(data.applicationDeadline).toLocaleDateString()}` : "Apply Soon"}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 px-1">
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin size={16} className="text-indigo-400 opacity-60" />
              <span className="text-[11px] font-bold uppercase">{data.location || "On-site"}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar size={16} className="text-indigo-400 opacity-60" />
              <span className="text-[11px] font-bold uppercase">{data.duration}</span>
            </div>
            <div className="col-span-2 flex items-center gap-2 mt-2">
              <Banknote size={16} className="text-emerald-500 opacity-60" />
              <span className="text-base font-black italic tracking-tighter">
                {data.stipend > 0 ? `₹${data.stipend}` : "No Stipend"} 
                {data.stipend > 0 && <span className="text-[9px] font-bold text-slate-400 ml-1 uppercase not-italic">Monthly</span>}
              </span>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-3 relative z-10 pt-4">
        <button 
          onClick={() => navigate(`/student/internships/${data._id}`)}
          className="flex-[2] py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2"
        >
          Quick Apply <ArrowUpRight size={14} />
        </button>
        <button 
          onClick={() => navigate(`/student/internships/${data._id}`)}
          className="flex-1 py-5 bg-slate-950 hover:bg-slate-900 text-white rounded-3xl font-black text-[11px] uppercase transition-all shadow-xl shadow-slate-300 flex justify-center items-center group/btn active:scale-95"
        >
          <Eye size={16} className="group-hover/btn:scale-125 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;