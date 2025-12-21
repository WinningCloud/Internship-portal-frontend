import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, MapPin, 
  Calendar, Banknote, Clock, ArrowRight,
  SearchX, Loader2, Bookmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const StudentInternships = () => {
  const [internships, setInternships] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const navigate = useNavigate();

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, category, sortBy, internships]);

  const fetchInternships = async () => {
    try {
      const res = await api.get('/student/internship/get-internships');
      setInternships(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let temp = [...internships];

    // Search logic
    if (search) {
      temp = temp.filter(i => 
        i.title.toLowerCase().includes(search.toLowerCase()) || 
        i.companyName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category logic
    if (category !== "All") {
      temp = temp.filter(i => i.category === category);
    }

    // Sort logic
    if (sortBy === "Newest") temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "High Stipend") temp.sort((a, b) => (b.stipend || 0) - (a.stipend || 0));

    setFiltered(temp);
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Internships</h1>
          <p className="text-slate-500 font-medium text-sm">Find your next big opportunity today.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-400">
          Showing <span className="text-indigo-600">{filtered.length}</span> Roles
        </div>
      </div>

      {/* --- SEARCH & FILTER BAR --- */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" placeholder="Search by role or company..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-medium"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Web">Web Dev</option>
            <option value="AI/ML">AI / ML</option>
            <option value="Design">UI/UX Design</option>
          </select>
          <select 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 outline-none"
          >
            <option value="Newest">Newest First</option>
            <option value="High Stipend">Highest Stipend</option>
          </select>
        </div>
      </div>

      {/* --- GRID --- */}
      <AnimatePresence>
        {filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, idx) => (
              <InternshipCard key={item._id} data={item} navigate={navigate} />
            ))}
          </motion.div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-[3rem]">
            <SearchX size={48} className="mb-4 opacity-20" />
            <p className="font-bold">No internships found matching your criteria.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InternshipCard = ({ data, navigate }) => {
  // Color palette for variety
  const colors = ['bg-indigo-50 border-indigo-100', 'bg-rose-50 border-rose-100', 'bg-emerald-50 border-emerald-100', 'bg-amber-50 border-amber-100'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`p-6 rounded-[2.5rem] border ${color} flex flex-col h-full justify-between transition-all group`}
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm overflow-hidden p-2">
            <img src={data.startupLogo || "https://cdn-icons-png.flaticon.com/512/281/281764.png"} alt="logo" className="w-full h-full object-contain" />
          </div>
          <button className="p-2.5 bg-white/50 rounded-xl hover:bg-white transition shadow-sm"><Bookmark size={16} className="text-slate-400" /></button>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{data.companyName}</p>
        <h3 className="text-xl font-black text-slate-900 leading-tight mb-4">{data.title}</h3>
        
        <div className="space-y-2.5 mb-8">
          <div className="flex items-center text-xs font-bold text-slate-500 gap-2"><MapPin size={14} className="opacity-50" /> {data.location}</div>
          <div className="flex items-center text-xs font-bold text-slate-500 gap-2"><Banknote size={14} className="opacity-50" /> ₹{data.stipend || "Unpaid"} / month</div>
          <div className="flex items-center text-xs font-bold text-slate-500 gap-2"><Calendar size={14} className="opacity-50" /> {data.duration}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate(`/student/internships/${data._id}`)}
          className="flex-1 bg-white border border-slate-200 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-300"
        >
          View Details
        </button>
        <button className="p-3.5 bg-slate-900 text-white rounded-2xl hover:scale-105 transition active:scale-95 shadow-lg shadow-slate-200">
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default StudentInternships;