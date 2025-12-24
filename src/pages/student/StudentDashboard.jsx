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
  CheckCircle,
  Eye,
  Info
} from "lucide-react";

import api from "../../api/axiosConfig.js";
import { useDomains } from "../../context/DomainContext.jsx";
import { AuthContext } from "../../context/AuthContext"; 

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { domains, loading: domainsLoading } = useDomains();
  
  // Access User Data. Using fallback for name to ensure it is ALWAYS visible
  const { user } = useContext(AuthContext);
  const studentName = user?.fullName || user?.name || "Student";

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
        console.error("Error fetching internships", err);
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
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <div className="absolute inset-0 blur-2xl bg-indigo-400/20 animate-pulse"></div>
        </div>
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Syncing Opportunities</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-20 px-4 md:px-8">
      
      {/* ---------------- 1. OPTIMIZED SMALLER HERO SECTION ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full min-h-[280px] bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] rounded-[2.5rem] p-10 md:p-14 mb-10 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="absolute top-[-10%] right-[-5%] w-72 h-72 bg-indigo-500/20 rounded-full blur-[80px] animate-pulse"></div>

        <div className="relative z-10 space-y-5 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/5 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
            <Sparkles size={12} className="text-indigo-400" /> {greeting}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
            Welcome, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-300 italic">
              {studentName}!
            </span>
          </h1>
          <p className="text-slate-300 font-medium text-base leading-relaxed opacity-80">
            Explore {internships.length} exclusive career-start opportunities matching your profile.
          </p>
        </div>

        <div className="relative z-10 hidden lg:block pr-10">
          <motion.img
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            src="https://illustrations.popsy.co/white/remote-work.svg"
            alt="Work"
            className="w-[380px] brightness-125 drop-shadow-[0_15px_40px_rgba(79,70,229,0.4)]"
          />
        </div>
      </motion.div>

      {/* ---------------- 2. STATS OVERVIEW ---------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <QuickStat icon={Briefcase} label="All Internships" value={internships.length} color="text-indigo-600" />
          <QuickStat icon={Zap} label="Recent Roles" value="New" color="text-amber-500" />
          <QuickStat icon={Globe} label="Portal Domains" value={domains.length} color="text-emerald-500" />
          <QuickStat icon={ArrowUpRight} label="Avg Stipend" value="8k+" color="text-rose-500" />
      </div>

      {/* ---------------- 3. STICKY CONTROLS ---------------- */}
      <div className="sticky top-20 z-40 bg-slate-50/95 backdrop-blur-md py-5 mb-10 border-b border-slate-200/60">
        <div className="flex flex-col xl:flex-row gap-6 items-center">
          <div className="relative w-full xl:max-w-3xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by title, skills, or startup name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-semibold text-slate-700"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 w-full xl:w-auto">
            <FilterPill label="All" active={activeDomain === "ALL"} onClick={() => setActiveDomain("ALL")} />
            {domains.map((d) => (
              <FilterPill key={d.key} label={d.label} active={activeDomain === d.key} onClick={() => setActiveDomain(d.key)} />
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- 4. INTERNSHIP GRID (WIDE CARDS) ---------------- */}
      <section>
        <div className="flex items-center justify-between mb-10 px-2">
          <h2 className="text-2xl font-black tracking-tighter uppercase text-slate-900 italic">Recommended Matches</h2>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <Filter size={12} /> Refined Result
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredInternships.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {filteredInternships.map((job, i) => (
                <WideInternshipCard
                  key={job._id}
                  data={job}
                  navigate={navigate}
                  index={i}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                <div className="text-slate-300 font-black text-xl uppercase tracking-widest">No matching roles found</div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

/* --- REUSABLE COMPONENTS --- */

const QuickStat = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group">
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{value}</p>
        </div>
        <div className={`${color} bg-slate-50 p-3.5 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={20} />
        </div>
    </div>
);

const FilterPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
      active ? "bg-slate-900 text-white border-slate-900 shadow-xl" : "bg-white text-slate-500 border-slate-200 hover:border-slate-900"
    }`}
  >
    {label}
  </button>
);

const WideInternshipCard = ({ data, index, navigate }) => {
  const themes = [
    { bg: "bg-[#fcf8f6]", border: "border-orange-100", text: "text-orange-600" },
    { bg: "bg-[#f4faf9]", border: "border-teal-100", text: "text-teal-600" },
    { bg: "bg-[#f8f7ff]", border: "border-purple-100", text: "text-purple-600" },
    { bg: "bg-[#f5faff]", border: "border-blue-100", text: "text-blue-600" },
    { bg: "bg-[#fef6f7]", border: "border-pink-100", text: "text-pink-600" }
  ];
  const theme = themes[index % themes.length];

  // Logic for "No Stipend" display
  const stipendDisplay = data.stipend > 0 ? `₹${data.stipend}` : "No Stipend";

  return (
    <motion.div
      layout
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${theme.bg} ${theme.border} border-2 p-8 rounded-[3rem] flex flex-col justify-between h-[450px] transition-all duration-500 shadow-sm hover:shadow-2xl group`}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white flex items-center gap-2 shadow-sm">
            <Globe size={14} className={theme.text} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{data.domain || "CIIC Partner"}</span>
          </div>
          <button className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-900 hover:text-white transition-all transform active:scale-90">
            <Bookmark size={18} />
          </button>
        </div>

        <div className="flex items-center space-x-5 mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-white p-3 shrink-0 group-hover:rotate-3 transition-transform duration-500">
             <img src={data.startupLogo || "https://cdn-icons-png.flaticon.com/512/281/281764.png"} className="w-full h-full object-contain" alt="Logo" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{data.companyName || "CIIC Startup"}</p>
            <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors truncate mt-1">{data.title}</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
            <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-xl border border-white/40 text-[10px] font-bold text-slate-600">
                <CheckCircle size={12} className="text-emerald-500" /> CIIC Verified
            </div>
            <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-xl border border-white/40 text-[10px] font-bold text-slate-600">
                <Clock size={12} className="text-indigo-500" /> Apply by {new Date(data.applicationDeadline).toLocaleDateString() || 'Soon'}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-900/5">
            <div className="flex items-center space-x-3 text-slate-500">
              <MapPin size={16} className="opacity-30" />
              <span className="text-[11px] font-bold uppercase tracking-wide">{data.location || "Remote"}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-500">
              <Calendar size={16} className="opacity-30" />
              <span className="text-[11px] font-bold uppercase tracking-wide">{data.duration}</span>
            </div>
            <div className="col-span-2 flex items-center space-x-3 text-slate-900 mt-1">
              <Banknote size={18} className="opacity-30" />
              <span className={`text-sm font-black italic ${data.stipend > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                {stipendDisplay} 
                {data.stipend > 0 && <span className="text-[10px] text-slate-400 font-bold not-italic ml-1 uppercase">/ Mo</span>}
              </span>
            </div>
        </div>
      </div>

      {/* Uniform Action Buttons */}
      <div className="flex items-center space-x-3 relative z-10 pt-4">
        <button 
          onClick={() => navigate(`/student/internships/${data._id}`)}
          className="flex-[2.5] py-4.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
        >
          Quick Apply <ArrowUpRight size={14} />
        </button>
        {/* <button 
          onClick={() => navigate(`/student/internships/${data._id}`)}
          className="flex-1 py-4.5 bg-slate-950 text-white rounded-[1.5rem] hover:bg-slate-800 transition-all shadow-xl flex justify-center items-center group/btn"
        >
          <Info size={18} className="mr-2" />
          <span className="text-[9px] font-black uppercase">Details</span>
        </button> */}
      </div>
    </motion.div>
  );
};

export default StudentDashboard;