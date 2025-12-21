import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, SlidersHorizontal, MapPin, 
  Calendar, Banknote, Bookmark, 
  ChevronRight, Clock, Loader2 
} from 'lucide-react';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

const StudentDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchInternships = async () => {
        
      try {
        const res = await api.get('/student/internship/get-internships');
        setInternships(res.data);
      } catch (err) {
        console.error("Error fetching internships", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  // Filter Logic
  const categories = ["All", "IOT", "AI/ML", "Web", "Design"];
  
  // Card Color Logic (Matches your design colors)
  const cardThemes = [
    { bg: "bg-orange-50", border: "border-orange-100", text: "text-orange-600", btn: "bg-orange-100 text-orange-700" },
    { bg: "bg-teal-50", border: "border-teal-100", text: "text-teal-600", btn: "bg-teal-100 text-teal-700" },
    { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-600", btn: "bg-purple-100 text-purple-700" },
    { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600", btn: "bg-blue-100 text-blue-700" },
    { bg: "bg-pink-50", border: "border-pink-100", text: "text-pink-600", btn: "bg-pink-100 text-pink-700" },
  ];

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      <p className="text-slate-400 font-medium italic">Loading opportunities...</p>
    </div>
  );

  return (
    <div className="pb-20">
      
      {/* --- 1. HERO BANNER --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-[#111111] rounded-[2.5rem] p-8 md:p-12 mb-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden"
      >
        <div className="relative z-10 space-y-4 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Welcome Back, <br /> 
            <span className="text-slate-400">Lets Find Your Internship!</span>
          </h1>
        </div>
        {/* Placeholder Illustration (Replacing with professional SVG concept) */}
        <div className="relative z-10 mt-8 md:mt-0">
           <img 
            src="https://illustrations.popsy.co/white/remote-work.svg" 
            alt="Dashboard Illustration" 
            className="w-64 h-64 object-contain brightness-200"
           />
        </div>
        {/* Decorative background circle */}
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </motion.div>

      {/* --- 2. SEARCH & FILTERS --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="relative w-full md:max-w-xl group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text"
            placeholder="Search for internship..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-full shadow-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center space-x-3 overflow-x-auto pb-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-8 py-3 rounded-full text-sm font-bold border transition-all whitespace-nowrap ${
                activeFilter === cat 
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- 3. RECOMMENDED SECTION --- */}
      <section className="mb-16">
        <div className="flex items-center space-x-4 mb-8">
          <h2 className="text-2xl font-black text-slate-900">Recommended</h2>
          <span className="bg-white border border-slate-200 px-4 py-1 rounded-full text-sm font-bold text-slate-500">
            {internships.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {internships.map((job, index) => (
            <InternshipCard 
              key={job._id} 
              data={job} 
              theme={cardThemes[index % cardThemes.length]} 
            />
          ))}
        </div>
      </section>

      {/* --- 4. APPLIED SECTION --- */}
      <section>
        <div className="flex items-center space-x-4 mb-8">
          <h2 className="text-2xl font-black text-slate-900">Applied</h2>
          <span className="bg-white border border-slate-200 px-4 py-1 rounded-full text-sm font-bold text-slate-500">
            {/* Logic: Filter internships where student has applied */}
            {internships.filter(i => i.isApplied).length || 0}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-80">
          {/* Using a slice as a placeholder for Applied list if backend doesn't separate them yet */}
          {internships.slice(0, 4).map((job, index) => (
            <InternshipCard 
              key={`applied-${job._id}`} 
              data={job} 
              theme={cardThemes[(index + 2) % cardThemes.length]} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};

/* --- REUSABLE INTERNSHIP CARD COMPONENT --- */
const InternshipCard = ({ data, theme }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`${theme.bg} ${theme.border} border p-5 rounded-[2rem] flex flex-col justify-between h-[380px] transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50`}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {new Date(data.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
          <button className="p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform">
            <Bookmark className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm overflow-hidden p-2">
            <img src={data.startupLogo || "https://cdn-icons-png.flaticon.com/512/281/281764.png"} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase truncate w-32">{data.companyName || "Startup Name"}</p>
            <h3 className="text-lg font-black text-slate-900 leading-tight">{data.title}</h3>
          </div>
        </div>

        <div className="inline-flex items-center space-x-2 bg-white/50 px-3 py-1 rounded-full mb-6 border border-white/50">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tighter">1 Day to go</span>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 gap-2 mb-6">
          <div className="flex items-center space-x-2 text-slate-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{data.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{data.duration}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-500">
            <Banknote className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{data.stipend || "Unpaid"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:brightness-95 ${theme.btn}`}>
          Apply Now
        </button>
        <button className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors shadow-lg">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;