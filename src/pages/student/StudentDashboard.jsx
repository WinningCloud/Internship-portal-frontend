import React, { useEffect, useMemo, useState } from "react";
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
  Globe
} from "lucide-react";

import api from "../../api/axiosConfig.js";
import { useDomains } from "../../context/DomainContext.jsx";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { domains, loading: domainsLoading } = useDomains();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDomain, setActiveDomain] = useState("ALL");

  // Dynamic Greeting Logic
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  /* ---------------- FETCH INTERNSHIPS ---------------- */
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

  /* ---------------- FILTER LOGIC ---------------- */
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
      <div className="h-screen flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
          <div className="absolute inset-0 blur-2xl bg-indigo-400/20 animate-pulse"></div>
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Syncing Opportunities</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto pb-20 px-4 md:px-10">
      
      {/* ---------------- 1. DYNAMIC HERO SECTION ---------------- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full bg-[#0a0a0a] rounded-[3rem] p-10 md:p-16 mb-12 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-2xl"
      >
        {/* Animated Background Blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-rose-600/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 space-y-6 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles size={14} className="animate-bounce" /> {greeting}, Student
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
            Propel Your Career <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 italic font-light">
              at CIIC Startups
            </span>
          </h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed">
            Discover {internships.length}+ exclusive internship opportunities. Apply today and build the future.
          </p>
        </div>

        <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 hidden lg:block"
        >
          <img
            src="https://illustrations.popsy.co/white/remote-work.svg"
            alt="Work"
            className="w-80 h-80 brightness-[1.1] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          />
        </motion.div>
      </motion.div>

      {/* ---------------- 2. QUICK STATS ---------------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <QuickStat icon={Briefcase} label="Total Roles" value={internships.length} color="text-indigo-600" />
          <QuickStat icon={Zap} label="New Today" value="4" color="text-amber-500" />
          <QuickStat icon={Globe} label="Active Domains" value={domains.length} color="text-emerald-500" />
          <QuickStat icon={ArrowUpRight} label="Avg. Stipend" value="₹8k" color="text-rose-500" />
      </div>

      {/* ---------------- 3. CONTROLS (SEARCH & DOMAINS) ---------------- */}
      <div className="sticky top-24 z-40 bg-slate-50/80 backdrop-blur-xl py-6 mb-12 border-b border-slate-200/50">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="relative w-full lg:max-w-2xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by title, skill, or startup name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white rounded-[2rem] border border-slate-200 shadow-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-semibold"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 w-full lg:w-auto">
            <FilterButton label="All" active={activeDomain === "ALL"} onClick={() => setActiveDomain("ALL")} />
            {domains.map((d) => (
              <FilterButton
                key={d.key}
                label={d.label}
                active={activeDomain === d.key}
                onClick={() => setActiveDomain(d.key)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- 4. INTERNSHIP GRID ---------------- */}
      <section>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black tracking-tighter uppercase italic text-slate-900">Recommended Opportunities</h2>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <Filter size={14} /> Refined results
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredInternships.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filteredInternships.map((job, i) => (
                <InternshipCard
                  key={job._id}
                  data={job}
                  navigate={navigate}
                  index={i}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center"
            >
                <div className="text-slate-300 font-black text-xl uppercase tracking-tighter">No Matching Opportunities</div>
                <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or search keywords.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

/* --- QUICK STAT COMPONENT --- */
const QuickStat = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-xl font-black text-slate-900">{value}</p>
        </div>
        <div className={`${color} bg-slate-50 p-3 rounded-2xl`}>
            <Icon size={20} />
        </div>
    </div>
);

/* --- FILTER BUTTON --- */
const FilterButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all whitespace-nowrap shadow-sm ${
      active
        ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
        : "bg-white text-slate-500 border-slate-200 hover:border-slate-900"
    }`}
  >
    {label}
  </button>
);

/* --- INTERNSHIP CARD COMPONENT --- */
const InternshipCard = ({ data, index, navigate }) => {
  const themes = [
    { bg: "bg-[#FFF4ED]", border: "border-orange-100", accent: "bg-orange-600", text: "text-orange-600", btn: "bg-orange-100 text-orange-700" },
    { bg: "bg-[#F0FDFA]", border: "border-teal-100", accent: "bg-teal-600", text: "text-teal-600", btn: "bg-teal-100 text-teal-700" },
    { bg: "bg-[#F5F3FF]", border: "border-purple-100", accent: "bg-purple-600", text: "text-purple-600", btn: "bg-purple-100 text-purple-700" },
    { bg: "bg-[#EFF6FF]", border: "border-blue-100", accent: "bg-blue-600", text: "text-blue-600", btn: "bg-blue-100 text-blue-700" },
    { bg: "bg-[#FFF1F2]", border: "border-pink-100", accent: "bg-pink-600", text: "text-pink-600", btn: "bg-pink-100 text-pink-700" }
  ];
  const theme = themes[index % themes.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -10 }}
      transition={{ delay: index * 0.05 }}
      className={`${theme.bg} ${theme.border} border-2 p-6 rounded-[2.5rem] flex flex-col justify-between h-[420px] relative group overflow-hidden shadow-sm`}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white flex items-center gap-2">
            <Globe size={12} className={theme.text} />
            <span className={`text-[10px] font-black uppercase tracking-wider text-slate-700`}>{data.domain || "Portal"}</span>
          </div>
          <button className="p-2.5 bg-white rounded-xl shadow-sm hover:bg-slate-900 hover:text-white transition-all transform active:scale-90">
            <Bookmark size={16} />
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-white p-2 group-hover:rotate-6 transition-transform">
             <img src={data.startupLogo || "https://cdn-icons-png.flaticon.com/512/281/281764.png"} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{data.companyName || "CIIC Startup"}</p>
            <h3 className="text-lg font-black text-slate-900 leading-tight truncate group-hover:text-indigo-600 transition-colors">{data.title}</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1.5 rounded-xl border border-white/40 text-[10px] font-bold text-slate-600">
                <Clock size={12} /> New Role
            </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-slate-900/5">
          <div className="flex items-center justify-between text-slate-500">
            <div className="flex items-center space-x-2">
              <MapPin size={14} className="opacity-60" />
              <span className="text-[11px] font-bold">{data.location || "Remote"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={14} className="opacity-60" />
              <span className="text-[11px] font-bold">{data.duration}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-slate-900">
            <Banknote size={14} className="opacity-60" />
            <span className="text-sm font-black">₹{data.stipend || "0"} <span className="text-[10px] text-slate-400 uppercase font-bold">/ Month</span></span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 relative z-10">
        <button 
          onClick={() => navigate(`/student/internships/${data._id}`)}
          className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:brightness-95 active:scale-95 shadow-xl shadow-slate-200 ${theme.btn}`}
        >
          Quick Apply
        </button>
        <button 
          onClick={() => navigate(`/student/internships/${data._id}`)}
          className="p-4 bg-slate-950 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-300 active:scale-90"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      
      {/* Decorative Accents */}
      <div className={`absolute bottom-[-20%] right-[-10%] w-32 h-32 rounded-full blur-3xl opacity-20 ${theme.accent}`}></div>
    </motion.div>
  );
};

export default StudentDashboard;