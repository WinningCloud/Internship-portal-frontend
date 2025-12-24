import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Users, Calendar, MapPin, 
  Edit3, Trash2, Loader2, Inbox, Clock, 
  Briefcase, ChevronRight, X, Save, 
  Eye, EyeOff, CheckCircle, AlertCircle
} from "lucide-react";
import api from "../../api/axiosConfig.js";
import { useDomains } from "../../context/DomainContext.jsx";

const ManageInternships = () => {
  const { domains } = useDomains();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInternship, setSelectedInternship] = useState(null);
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

  // Visibility Toggle Function
 const toggleVisibility = async (id, currentStatus) => {
  // 1. Prepare dynamic message based on the future state
  const actionText = currentStatus 
    ? "deactivate and hide this internship from students" 
    : "activate and make this internship visible to all students";

  // 2. Ask for confirmation
  const isConfirmed = window.confirm(`Are you sure you want to ${actionText}?`);

  // 3. Exit if the user cancels
  if (!isConfirmed) return;

  try {
    // 4. Proceed with the API call
    const response = await api.put(`/startup/update-internship/${id}`, { 
      isActive: !currentStatus 
    });

    // 5. Update local state for immediate UI feedback
    setInternships(prev => 
      prev.map(item => 
        item._id === id ? { ...item, isActive: !currentStatus } : item
      )
    );

    // Optional: Log success (or use a toast notification here)
    console.log(`Status updated: ${!currentStatus ? 'Active' : 'Inactive'}`);
    
  } catch (err) {
    console.error("Visibility update failed:", err);
    alert(err.response?.data?.message || "Failed to update visibility. Please check your connection.");
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This will delete the internship and all related applications.")) return;
    try {
      await api.delete(`/startup/delete-internship/${id}`);
      setInternships(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert("Failed to delete internship");
    }
  };

  // Grouping and Filtering Logic
  const processedLists = useMemo(() => {
    const filtered = internships.filter((job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      active: filtered.filter(j => j.isActive),
      inactive: filtered.filter(j => !j.isActive)
    };
  }, [internships, searchQuery]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="w-full max-w-[1500px] mx-auto pb-20 px-6 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Internships</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Control the visibility and details of your career opportunities.</p>
        </div>
        <Link
          to="/startup/internships/create"
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} /> Post New Role
        </Link>
      </div>

      {/* --- SEARCH --- */}
      <div className="relative mb-10 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
        <input
          type="text"
          placeholder="Filter by internship title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-sm text-slate-700"
        />
      </div>

      {/* --- ACTIVE SECTION --- */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6 px-2">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Active Postings</h2>
            <div className="h-[1px] flex-1 bg-slate-100"></div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                {processedLists.active.length} Live
            </span>
        </div>
        
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {processedLists.active.map((job, index) => (
              <InternshipRow 
                key={job._id} 
                job={job} 
                domains={domains}
                onEdit={() => setSelectedInternship(job)}
                onDelete={() => handleDelete(job._id)}
                onToggle={() => toggleVisibility(job._id, job.isActive)}
                navigate={navigate}
              />
            ))}
          </AnimatePresence>
          {processedLists.active.length === 0 && <EmptyState message="No active internships found" />}
        </div>
      </section>

      {/* --- INACTIVE SECTION --- */}
      <section>
        <div className="flex items-center gap-3 mb-6 px-2">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Inactive / Hidden</h2>
            <div className="h-[1px] flex-1 bg-slate-100"></div>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full border border-slate-200">
                {processedLists.inactive.length} Hidden
            </span>
        </div>

        <div className="space-y-4 opacity-75 grayscale-[0.5]">
          <AnimatePresence mode="popLayout">
            {processedLists.inactive.map((job, index) => (
              <InternshipRow 
                key={job._id} 
                job={job} 
                domains={domains}
                onEdit={() => setSelectedInternship(job)}
                onDelete={() => handleDelete(job._id)}
                onToggle={() => toggleVisibility(job._id, job.isActive)}
                navigate={navigate}
              />
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* --- EDIT MODAL --- */}
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

/* --- ROW COMPONENT --- */
const InternshipRow = ({ job, domains, onEdit, onDelete, onToggle, navigate }) => {
  // Find the professional label from context
  const domainLabel = domains.find(d => d.key === job.domain)?.label || job.domain;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col xl:flex-row items-center justify-between gap-8 hover:border-blue-200 transition-all group"
    >
      <div className="flex items-center gap-6 flex-1 w-full xl:w-auto min-w-0">
        {/* Status Icon */}
        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:bg-white transition-colors">
          {job.isActive ? <Eye className="text-blue-500" size={24} /> : <EyeOff className="text-slate-300" size={24} />}
        </div>

        {/* Text Content - min-w-0 is crucial here */}
        <div className="min-w-0 flex-1">
           <div className="flex items-center gap-2 mb-2">
             <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
               {domainLabel}
             </span>
             <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap shrink-0">
               {job.internshipType}
             </span>
           </div>

           {/* 
             Title Implementation:
             - line-clamp-3: limits to 3 lines
             - leading-snug: better spacing for multi-line
             - break-words: prevents long strings from breaking layout
           */}
           <h3 className="text-lg font-bold text-slate-900 leading-snug tracking-tight line-clamp-3 break-words">
              {job.title}
           </h3>

           <div className="flex items-center gap-4 mt-3 text-slate-500 font-semibold text-xs">
              <div className="flex items-center gap-1 shrink-0"><MapPin size={14} /> {job.location}</div>
              <div className="flex items-center gap-1 shrink-0"><Users size={14} /> {job.applicationsCount || 0} Applicants</div>
           </div>
        </div>
      </div>

      {/* Action Buttons Container - xl:shrink-0 ensures it never gets squeezed */}
      <div className="flex items-center gap-3 w-full xl:w-auto xl:shrink-0">
        <button 
          onClick={() => navigate(`/startup/internships/${job._id}/applications`)}
          className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all shadow-sm"
        >
          View Applicants <ChevronRight size={14} />
        </button>

        <div className="flex gap-2">
            <button 
              onClick={onToggle}
              title={job.isActive ? "Hide from students" : "Make visible to students"}
              className={`p-3 rounded-xl border transition-all shadow-sm ${
                job.isActive 
                ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' 
                : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-white hover:text-blue-600'
              }`}
            >
              {job.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            
            <button onClick={onEdit} className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                <Edit3 size={18} />
            </button>
            <button onClick={onDelete} className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-red-600 hover:border-red-200 transition-all shadow-sm">
                <Trash2 size={18} />
            </button>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = ({ message }) => (
  <div className="py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{message}</p>
  </div>
);

/* --- EDIT MODAL (RE-IMPLEMENTED MODULARLY) --- */
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
      alert("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Edit Posting</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={20} /></button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModalInput label="Position Title" value={formData.title} onChange={(v) => setFormData({...formData, title: v})} />
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Domain</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-600"
                  value={formData.domain} onChange={(e) => setFormData({...formData, domain: e.target.value})}>
                  {domains.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                </select>
              </div>
              <ModalInput label="Office Location" value={formData.location} onChange={(v) => setFormData({...formData, location: v})} />
              <ModalInput label="Duration" value={formData.duration} onChange={(v) => setFormData({...formData, duration: v})} />
            </div>
            
            <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Job Overview</label>
                <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-600 min-h-[140px]"
                 value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-100">
              <button type="submit" disabled={saving} className="flex-1 bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-50">
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                <span>Update Record</span>
              </button>
              <button type="button" onClick={onClose} className="px-8 py-4 bg-slate-50 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-100">Cancel</button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const ModalInput = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-600" />
  </div>
);

export default ManageInternships;