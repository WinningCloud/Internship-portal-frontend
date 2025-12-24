import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Users, Calendar, MapPin, 
  Edit3, Trash2, ExternalLink, Loader2, 
  Inbox, Clock, Briefcase, ChevronRight,
  TrendingUp, X, Save, AlertCircle
} from "lucide-react";
import api from "../../api/axiosConfig.js";
import { useDomains } from "../../context/DomainContext.jsx";

const ManageInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInternship, setSelectedInternship] = useState(null); // For Edit Modal
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyInternships();
  }, []);

  const fetchMyInternships = async () => {
    try {
      const res = await api.get("/startup/get-internships");
      setInternships(res.data);
    } catch (err) {
      console.error("Error fetching internships", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this internship? This action cannot be undone.")) return;
    try {
      await api.delete(`/startup/delete-internship/${id}`);
      setInternships(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert("Failed to delete internship");
    }
  };

  const filteredInternships = internships.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-4">Loading Console</p>
    </div>
  );

  return (
    <div className="w-full max-w-[1500px] mx-auto pb-20 px-6 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Internships</h1>
          <p className="text-slate-500 text-sm mt-1">Oversight and management of your active recruitment roles.</p>
        </div>
        <Link
          to="/startup/internships/create"
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} /> Post New Role
        </Link>
      </div>

      {/* --- STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatTile label="Live Postings" value={internships.length} icon={Briefcase} />
        <StatTile label="Total Applicants" value={internships.reduce((acc, curr) => acc + (curr.applicationsCount || 0), 0)} icon={Users} />
        <StatTile label="Engagement" value="High" icon={TrendingUp} />
      </div>

      {/* --- FILTER BAR --- */}
      <div className="relative mb-8 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
        <input
          type="text"
          placeholder="Filter your postings by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-sm text-slate-700"
        />
      </div>

      {/* --- LIST --- */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredInternships.length > 0 ? (
            filteredInternships.map((job, index) => (
              <InternshipRow 
                key={job._id} 
                job={job} 
                index={index} 
                navigate={navigate} 
                onEdit={() => setSelectedInternship(job)}
                onDelete={() => handleDelete(job._id)}
              />
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 bg-white rounded-3xl border border-slate-200 text-center flex flex-col items-center">
              <Inbox size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No matching roles found</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- UPDATE MODAL --- */}
      <AnimatePresence>
        {selectedInternship && (
          <EditInternshipModal 
            job={selectedInternship} 
            onClose={() => setSelectedInternship(null)} 
            onRefresh={fetchMyInternships}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const StatTile = ({ label, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
    </div>
    <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
      <Icon size={20} />
    </div>
  </div>
);

const InternshipRow = ({ job, index, navigate, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col xl:flex-row items-center justify-between gap-8 hover:border-blue-200 transition-all group"
  >
    <div className="flex items-center gap-6 flex-1 w-full xl:w-auto">
      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:bg-white transition-colors">
        <Clock className="text-slate-300" size={24} />
      </div>
      <div className="min-w-0 flex-1">
         <div className="flex items-center gap-2 mb-1.5">
           <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[9px] font-bold uppercase tracking-wider">{job.domain}</span>
           <span className="text-[10px] text-slate-400 font-medium">Applied: {new Date(job.createdAt).toLocaleDateString()}</span>
         </div>
         <h3 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">{job.title}</h3>
         <div className="flex items-center gap-4 mt-2 text-slate-500 font-semibold text-xs">
            <div className="flex items-center gap-1"><MapPin size={14} /> {job.location}</div>
            <div className="flex items-center gap-1"><Calendar size={14} /> {job.duration}</div>
         </div>
      </div>
    </div>

    <div className="hidden lg:flex items-center gap-12 px-12 border-x border-slate-100">
        <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Applicants</p>
            <span className="text-xl font-bold text-slate-900">{job.applicationsCount || 0}</span>
        </div>
        <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stipend</p>
            <span className="text-sm font-bold text-slate-700 italic">₹{job.stipend || "0"}</span>
        </div>
    </div>

    <div className="flex items-center gap-3 w-full xl:w-auto">
      <button 
        onClick={() => navigate(`/startup/internships/${job._id}/applications`)}
        className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all shadow-sm"
      >
        Candidates <ChevronRight size={14} />
      </button>
      <button onClick={onEdit} className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"><Edit3 size={18} /></button>
      <button onClick={onDelete} className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-red-600 hover:border-red-200 transition-all shadow-sm"><Trash2 size={18} /></button>
    </div>
  </motion.div>
);

/* --- EDIT MODAL --- */
const EditInternshipModal = ({ job, onClose, onRefresh }) => {
  const { domains } = useDomains();
  const [formData, setFormData] = useState({ ...job });
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/startup/update-internship/${job._id}`, formData);
      onRefresh();
      onClose();
    } catch (err) {
      alert("Failed to update internship");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Edit Posting</h2>
              <p className="text-sm text-slate-500">Update role requirements and logistics.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModalInput label="Job Title" value={formData.title} onChange={(v) => setFormData({...formData, title: v})} />
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Domain</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-600 transition-all"
                  value={formData.domain} onChange={(e) => setFormData({...formData, domain: e.target.value})}>
                  {domains.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                </select>
              </div>
              <ModalInput label="Location" value={formData.location} onChange={(v) => setFormData({...formData, location: v})} />
              <ModalInput label="Duration" value={formData.duration} onChange={(v) => setFormData({...formData, duration: v})} />
              <ModalInput label="Stipend (₹)" type="number" value={formData.stipend} onChange={(v) => setFormData({...formData, stipend: v})} />
              <ModalInput label="Positions" type="number" value={formData.positionsAvailable} onChange={(v) => setFormData({...formData, positionsAvailable: v})} />
            </div>

            <div className="space-y-1.5">
               <label className="text-xs font-bold text-slate-700 ml-1">Role Description</label>
               <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-600 transition-all min-h-[120px]"
                 value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={saving} className="flex-1 bg-slate-900 hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 shadow-sm disabled:opacity-50">
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                <span>Save Changes</span>
              </button>
              <button type="button" onClick={onClose} className="px-8 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">Cancel</button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const ModalInput = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-700 ml-1">{label}</label>
    <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-600 transition-all" />
  </div>
);

export default ManageInternships;