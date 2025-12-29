import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Banknote,
  ArrowRight,
  SearchX,
  Loader2,
  Bookmark,
  Sparkles,
  Globe,
  Clock,
  Building2,
  Filter,
  Command
} from "lucide-react";
import api from "../../api/axiosConfig";
import { useDomains } from "../../context/DomainContext";

const StudentInternships = () => {
  const navigate = useNavigate();
  const { domains, loading: domainsLoading } = useDomains();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeDomain, setActiveDomain] = useState("ALL");
  const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await api.get("/student/internship/get-internships");
        setInternships(res.data);
      } catch (err) {
        console.error("Sync Error");
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  const filteredList = useMemo(() => {
    let temp = internships.filter((job) => {
      const matchesDomain = activeDomain === "ALL" || job.domain === activeDomain;
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(search.toLowerCase());
      return matchesDomain && matchesSearch;
    });

    if (sortBy === "Newest") {
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "High Stipend") {
      temp.sort((a, b) => (b.stipend || 0) - (a.stipend || 0));
    }
    return temp;
  }, [search, activeDomain, sortBy, internships]);

  if (loading || domainsLoading) return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  );

  return (
    // Removed large pt-32/pt-10. Using pt-4 for a tight, professional fit.
    <div className="w-full max-w-full mx-auto pb-20 px-4 md:px-8 xl:px-10 font-sans bg-[#F8FAFC]">
      
      {/* --- 1. SYSTEM HEADER (Starts immediately after nav) --- */}
      <div className="pt-4 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-black text-[9px] uppercase tracking-[0.3em]">
               <Sparkles size={12} /> Opportunity Ecosystem
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Explore <span className="text-indigo-600">Internships</span>
            </h1>
          </div>
          
          {/* Quick Metrics Integrated into Header */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm shrink-0">
             <div className="px-4 py-1.5 text-center border-r border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Live Roles</p>
                <p className="text-sm font-black text-indigo-600 leading-none">{filteredList.length}</p>
             </div>
             <div className="px-4 py-1.5 text-center">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Partners</p>
                <p className="text-sm font-black text-slate-900 leading-none">{domains.length}</p>
             </div>
          </div>
        </div>
      </div>

      {/* --- 2. SEARCH & FILTER COMMAND BAR --- */}
      <div className="sticky top-20 z-40 bg-[#F8FAFC]/95 backdrop-blur-md py-4 mb-10 border-b border-slate-200/60 flex flex-col xl:flex-row gap-4 items-center justify-between">
        <div className="relative w-full xl:max-w-3xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Quick search by role, startup, or domain..."
            className="w-full pl-16 pr-8 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm focus:ring-4 focus:ring-indigo-100/50 outline-none transition-all font-bold text-slate-700 text-sm"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 w-full xl:w-auto">
          <FilterBtn label="All" active={activeDomain === "ALL"} onClick={() => setActiveDomain("ALL")} />
          {domains.map((d) => (
            <FilterBtn key={d.key} label={d.label} active={activeDomain === d.key} onClick={() => setActiveDomain(d.key)} />
          ))}
        </div>
      </div>

      {/* --- 3. THE GRID --- */}
      <AnimatePresence mode="popLayout">
        {filteredList.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8"
          >
            {filteredList.map((item, index) => (
              <InternshipCard
                key={item._id}
                data={item}
                navigate={navigate}
                index={index}
                domains={domains}
              />
            ))}
          </motion.div>
        ) : (
          <div className="py-40 bg-white border-2 border-dashed border-slate-200 rounded-[3rem] text-center flex flex-col items-center">
            <SearchX size={48} className="text-slate-100 mb-4" />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">No matching tracks found in database</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- RE-STYLED VERTICAL CARD --- */
const InternshipCard = ({ data, navigate, index, domains }) => {
  const label = domains?.find(d => d.key === data.domain)?.label || data.domain || "Technical";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] flex flex-col justify-between h-[480px] shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2">
            <Globe size={12} className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</span>
          </div>
          <button className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-300 hover:text-indigo-600 transition-all active:scale-90">
            <Bookmark size={18} />
          </button>
        </div>

        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 overflow-hidden shrink-0 group-hover:rotate-2 transition-transform duration-500">
            <img
              src={data.startupLogo || "https://via.placeholder.com/150"}
              alt="logo"
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate leading-none mb-1.5">{data.companyName}</p>
            <h3 className="text-xl font-black text-slate-900 leading-tight uppercase truncate tracking-tight group-hover:text-indigo-600 transition-colors">
              {data.title}
            </h3>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-100">
          <CardDetail icon={MapPin} label="Location" value={data.location} color="text-indigo-400" />
          <CardDetail icon={Clock} label="Duration" value={data.duration} color="text-indigo-400" />
          <div className="space-y-1">
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Remuneration</p>
             <p className={`text-sm font-black uppercase tracking-tight ${data.stipend > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                {data.stipend > 0 ? `₹${data.stipend} / mo` : "Unpaid Opportunity"}
             </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 relative z-10 pt-4">
        <button
          onClick={() => navigate(`/student/internships/${data._id}`)}
          className="flex-[2.5] bg-slate-950 hover:bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95"
        >
          View Position
        </button>
        <button 
          onClick={() => navigate(`/student/internships/${data._id}`)}
          className="flex-1 bg-white border border-slate-200 text-slate-400 py-4 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};

/* --- SHARED COMPONENTS --- */

const CardDetail = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 shrink-0"><Icon size={14} className={color} /></div>
        <div className="min-w-0">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-[11px] font-black text-slate-700 uppercase truncate leading-none">{value || "General"}</p>
        </div>
    </div>
);

const FilterBtn = ({ label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            active ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "bg-white text-slate-400 border border-slate-200 hover:border-slate-400"
        }`}
    >
        {label}
    </button>
);

export default StudentInternships;