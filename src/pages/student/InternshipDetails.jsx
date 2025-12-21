import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Calendar, Banknote, 
  Users, Briefcase, Globe, Info, CheckCircle, Loader2 
} from 'lucide-react';
import api from '../../api/axiosConfig';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startupData, setStartupData] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/student/internship/get-internship/${id}`);
      setData(res.data);
      const startupId = data.startupId
      const startupRes = await api.get(`/student/internship/get-startup-details/${startupId}`);
    setStartupData(startupRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;
  if (!data) return <div className="p-20 text-center font-bold">Internship not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* --- BACK BUTTON --- */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm group transition-all"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Explorer
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- MAIN CONTENT (LEFT) --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Card */}
          <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-0 opacity-40 translate-x-20 -translate-y-20" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-[1.5rem] shadow-xl border border-slate-100 p-4 shrink-0">
                <img src={data.startupLogo || "https://cdn-icons-png.flaticon.com/512/281/281764.png"} className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{data.title}</h1>
                <p className="text-indigo-600 font-bold mt-1 flex items-center gap-2 italic">
                  at  {startupData}<Globe size={14} className="not-italic opacity-50" />
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm space-y-8">
            <section>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-4 italic">
                <Info size={20} className="text-indigo-600 not-italic" /> Role Description
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {data.description || "No detailed description provided for this role."}
              </p>
            </section>

            <section>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-4 italic">
                <CheckCircle size={20} className="text-emerald-500 not-italic" /> Requirements & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skillsRequired?.map((skill, idx) => (
                  <span key={idx} className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-100">
                    {skill}
                  </span>
                )) || <p className="text-slate-400 text-sm italic">Standard engineering skills required.</p>}
              </div>
            </section>
          </div>
        </div>

        {/* --- SIDEBAR ACTION (RIGHT) --- */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Summary</h3>
            
            <div className="space-y-6 mb-10">
              <SidebarItem icon={Banknote} label="Stipend" value={`₹${data.stipend} / month`} color="text-emerald-400" />
              <SidebarItem icon={Calendar} label="Duration" value={data.duration} color="text-indigo-300" />
              <SidebarItem icon={MapPin} label="Location" value={data.location} color="text-rose-400" />
              <SidebarItem icon={Briefcase} label="Category" value={data.category || "General"} color="text-amber-400" />
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-900/50 transition-all active:scale-95 flex items-center justify-center gap-2">
              Apply Now <Briefcase size={16} />
            </button>
            <p className="text-center text-[10px] text-slate-500 mt-6 font-bold uppercase tracking-widest">
              Secured Application via CIIC
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 text-center">
            <p className="text-xs font-bold text-slate-400 mb-2">Need help?</p>
            <a href="mailto:support@ciic.com" className="text-xs font-black text-indigo-600 hover:underline tracking-tight">Contact CIIC Admin</a>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-4">
    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-slate-100">{value}</p>
    </div>
  </div>
);

export default InternshipDetails;