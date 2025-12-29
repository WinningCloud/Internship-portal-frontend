import React, { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Calendar, Banknote, Bookmark, ChevronRight, 
  Clock, Loader2, Sparkles, ArrowUpRight, Filter, Briefcase, 
  Globe, Info, Eye, ShieldCheck, CheckCircle, Rocket, Layers
} from "lucide-react";

import api from "../../api/axiosConfig.js";
import { useDomains } from "../../context/DomainContext.jsx";
import { AuthContext } from "../../context/AuthContext";
import ProfileStatusCard from "../../components/common/ProfileStatusCard.jsx";
const StudentDashboard = () => {
  const navigate = useNavigate();
  const { domains, loading: domainsLoading } = useDomains();
  const { user } = useContext(AuthContext);

  const [internships, setInternships] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDomain, setActiveDomain] = useState("ALL");

  const studentName = user?.fullName || user?.name || "Student";

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [internRes, appRes] = await Promise.all([
          api.get("/student/internship/get-internships"),
          api.get("/student/application/get-my-applications")
        ]);
        setInternships(internRes.data);
        setMyApplications(appRes.data);
      } catch (err) {
        console.error("Dashboard synchronization error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  if (loading || domainsLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      <p className="mt-4 text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Initializing Hub</p>
    </div>
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-20 px-4 md:px-6 lg:px-10 font-sans bg-[#F8FAFC]">
      
      {/* --- 1. REDESIGNED BENTO HERO --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 mt-4">
        {/* Main Welcome Module */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 bg-slate-900 rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden shadow-2xl border border-white/5"
        >
          {/* Animated Glow */}
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-indigo-300 text-[10px] font-black uppercase tracking-[0.25em] backdrop-blur-md">
              <Sparkles size={12} className="text-indigo-400" /> {greeting}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase">
              Hello, <span className="text-indigo-400">{studentName.split(' ')[0]}</span>. <br />
              Your career starts here.
            </h1>
            
            <p className="text-slate-400 font-medium text-lg max-w-xl">
              Access the ecosystem of innovation. Vetted internships from CIIC incubated startups.
            </p>

            <div className="flex gap-4 pt-2">
                <SummaryBadge icon={Briefcase} label="Active Roles" count={internships.length} color="blue" />
                <SummaryBadge icon={CheckCircle} label="My Applications" count={myApplications.length} color="indigo" />
            </div>
          </div>

          <div className="absolute right-0 bottom-0 hidden xl:block opacity-40 translate-x-10 translate-y-10">
              <Rocket size={300} className="text-white rotate-[15deg]" strokeWidth={1} />
          </div>
        </motion.div>

        {/* Quick Access Module */}
       <ProfileStatusCard />
      </div>

      {/* --- 2. STICKY CONTROLS AREA --- */}
      <div className="sticky top-20 z-40 bg-[#F8FAFC]/95 backdrop-blur-md py-5 mb-8 border-b border-slate-200/60 flex flex-col xl:flex-row gap-4 items-center justify-between">
        <div className="relative w-full xl:max-w-2xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search roles or startups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-700"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 w-full xl:w-auto px-1">
          <FilterPill label="All Tracks" active={activeDomain === "ALL"} onClick={() => setActiveDomain("ALL")} />
          {domains.map((d) => (
            <FilterPill key={d.key} label={d.label} active={activeDomain === d.key} onClick={() => setActiveDomain(d.key)} />
          ))}
        </div>
      </div>

      {/* --- 3. WIDE INTERNSHIP GRID --- */}
      <section>
        <div className="flex items-center gap-4 mb-8 px-2">
          <h2 className="text-2xl font-black tracking-tighter uppercase text-slate-900 italic">Recommended Roles</h2>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredInternships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
              {filteredInternships.map((job, i) => (
                <WideJobCard
                  key={job._id}
                  data={job}
                  navigate={navigate}
                  index={i}
                  domains={domains}
                />
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-40 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center">
                <Search size={48} className="text-slate-100 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No matched opportunities</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

/* --- SHARED COMPONENTS --- */

const SummaryBadge = ({ icon: Icon, label, count, color }) => (
    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl px-5 py-3 flex items-center gap-4">
        <div className={`${color === 'blue' ? 'text-blue-400' : 'text-indigo-400'}`}>
            <Icon size={18} />
        </div>
        <div>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-base font-black text-white leading-none">{count < 10 ? `0${count}` : count}</p>
        </div>
    </div>
);

const FilterPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
      active ? "bg-slate-900 text-white border-slate-900 shadow-xl" : "bg-white text-slate-400 border-slate-200 hover:border-slate-900"
    }`}
  >
    {label}
  </button>
);

const WideJobCard = ({ data, index, navigate, domains }) => {
  const label = domains?.find(d => d.key === data.domain)?.label || data.domain;
  const stipendText = data.stipend > 0 ? `₹${data.stipend}` : "No Stipend";

  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white border border-slate-200 p-8 rounded-[2.5rem] flex flex-col justify-between h-[450px] md:h-[420px] transition-all duration-300 hover:shadow-2xl hover:border-indigo-100 group relative overflow-hidden shadow-sm"
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
            <Globe size={14} className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</span>
          </div>
          <button className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-300 hover:text-rose-500 transition-all transform active:scale-90">
            <Bookmark size={18} />
          </button>
        </div>

        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 p-3 shrink-0 group-hover:rotate-3 transition-transform duration-500 overflow-hidden">
             <img src={data.startupLogo || "https://cdn-icons-png.flaticon.com/512/281/281764.png"} className="w-full h-full object-contain" alt="Logo" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate leading-none mb-1">{data.companyName}</p>
            <h3 className="text-xl font-black text-slate-900 leading-tight uppercase truncate tracking-tight group-hover:text-indigo-600 transition-colors">{data.title}</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
            <DataModule icon={MapPin} label="Location" value={data.location || "On-site"} color="text-rose-500" />
            <DataModule icon={Clock} label="Timeline" value={data.duration} color="text-indigo-600" />
            <DataModule icon={Banknote} label="Stipend" value={stipendText} color="text-emerald-600" />
        </div>
      </div>

      <div className="flex items-center space-x-3 relative z-10 pt-6">
        <button 
          onClick={() => navigate(`/student/internships/${data._id}`)}
          className="flex-1 py-4.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95"
        >
          Quick Apply <ArrowUpRight size={14} />
        </button>
        <button 
          onClick={() => navigate(`/student/internships/${data._id}`)}
          className="px-6 py-4.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center active:scale-95"
        >
          <Eye size={18} />
        </button>
      </div>
    </motion.div>
  );
};

const DataModule = ({ icon: Icon, label, value, color }) => (
    <div className="space-y-1">
        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">{label}</p>
        <div className="flex items-center gap-1.5">
            <Icon size={14} className={`${color} shrink-0`} />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight truncate">{value}</span>
        </div>
    </div>
);

export default StudentDashboard;