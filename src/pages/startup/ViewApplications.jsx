import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, FileText, CheckCircle, 
  XCircle, Clock, Search, ArrowLeft, 
  ExternalLink, Loader2, Download, 
  Filter, MoreHorizontal, MessageSquare
} from "lucide-react";
import api from "../../api/axiosConfig.js";

const ViewApplications = () => {
  const { id } = useParams(); // Internship ID
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [id]);

  const fetchApplications = async () => {
    try {
      // API call to your specific endpoint
      const res = await api.get(`/startup/applications/get-applications/${id}`);
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await api.patch(`/startup/application/update-status/${appId}`, { status: newStatus });
      setApplications(prev => 
        prev.map(app => app._id === appId ? { ...app, status: newStatus } : app)
      );
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApps = applications.filter(app => 
    app.studentId?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Loading Applicant Pool</p>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-4 md:px-8">
      
      {/* --- HEADER --- */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-all mb-4"
          >
            <ArrowLeft size={14} /> Back to Internships
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Applicant Pipeline</h1>
          <p className="text-slate-500 text-sm font-medium">Reviewing {applications.length} candidates for this position.</p>
        </div>

        <div className="flex items-center gap-3">
            <div className="bg-blue-50 border border-blue-100 px-5 py-3 rounded-2xl">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Candidates</p>
                <p className="text-xl font-black text-blue-600">{applications.filter(a => a.status === 'PENDING').length}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-2xl">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Shortlisted</p>
                <p className="text-xl font-black text-emerald-600">{applications.filter(a => a.status === 'ACCEPTED').length}</p>
            </div>
        </div>
      </div>

      {/* --- UTILITY BAR --- */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text"
                placeholder="Search candidates by name..."
                className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-semibold text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={16} /> Filter Results
        </button>
      </div>

      {/* --- APPLICANTS TABLE --- */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied Date</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resume</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Decisions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence>
              {filteredApps.map((app, index) => (
                <motion.tr 
                  key={app._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  {/* Candidate Info */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold group-hover:border-blue-300 group-hover:bg-white transition-all">
                        {app.studentId?.fullName?.charAt(0) || <User size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-none mb-1">{app.studentId?.fullName}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{app.studentId?.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Applied Date */}
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-500 italic">
                      {new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </td>

                  {/* Resume */}
                  <td className="px-8 py-6">
                    <a 
                      href={app.studentId?.resumeUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <Download size={12} /> CV.PDF
                    </a>
                  </td>

                  {/* Status Badge */}
                  <td className="px-8 py-6">
                    <StatusBadge status={app.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        disabled={updatingId === app._id}
                        onClick={() => handleUpdateStatus(app._id, 'ACCEPTED')}
                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 active:scale-90"
                       >
                         {updatingId === app._id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                       </button>
                       <button 
                        disabled={updatingId === app._id}
                        onClick={() => handleUpdateStatus(app._id, 'REJECTED')}
                        className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100 active:scale-90"
                       >
                         <XCircle size={18} />
                       </button>
                       <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all border border-slate-100">
                         <MoreHorizontal size={18} />
                       </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {filteredApps.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
                <FileText size={48} className="text-slate-100 mb-4" />
                <p className="text-slate-400 font-black uppercase text-xs">No matching candidates</p>
            </div>
        )}
      </div>
    </div>
  );
};

/* --- HELPER COMPONENTS --- */

const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    ACCEPTED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REJECTED: "bg-rose-50 text-rose-600 border-rose-100",
    INTERVIEW: "bg-blue-50 text-blue-600 border-blue-100",
  };

  return (
    <span className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${styles[status?.toUpperCase()] || styles.PENDING}`}>
      {status}
    </span>
  );
};

export default ViewApplications;