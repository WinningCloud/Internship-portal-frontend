import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Building2,
  FileText,
  ExternalLink,
  ChevronRight,
  Loader2,
  Inbox,
  Filter,
  CheckCircle2,
  AlertCircle,
  Timer,
  Users
} from "lucide-react";
import api from "../../api/axiosConfig.js";

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/student/application/get-my-applications");
      setApplications(res.data);
      setFilteredApps(res.data);
    } catch (err) {
      console.error("Error fetching applications", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  useEffect(() => {
    let result = applications;

    if (statusFilter !== "ALL") {
      result = result.filter((app) => app.status.toUpperCase() === statusFilter);
    }

    if (searchQuery) {
      result = result.filter(
        (app) =>
          app.internshipId?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.internshipId?.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredApps(result);
  }, [searchQuery, statusFilter, applications]);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving History</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-20 px-4 md:px-8">
      {/* --- HEADER --- */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Applications</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Track and manage your professional journey.</p>
      </div>

      {/* --- FILTERS & SEARCH --- */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search role or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-semibold text-slate-700"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 w-full lg:w-auto">
          {["ALL", "PENDING", "REVIEWING", "INTERVIEW", "ACCEPTED", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                statusFilter === status
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* --- APPLICATIONS LIST --- */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredApps.length > 0 ? (
            filteredApps.map((app, index) => (
              <ApplicationRow key={app._id} app={app} index={index} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center"
            >
              <Inbox size={48} className="text-slate-200 mb-4" />
              <div className="text-slate-400 font-black text-lg uppercase tracking-tighter">No Applications Found</div>
              <p className="text-slate-400 text-sm mt-1">Start applying to internships to see them here.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* --- INDIVIDUAL APPLICATION ROW --- */
const ApplicationRow = ({ app, index }) => {
  const statusConfig = {
    PENDING: { color: "text-amber-600 bg-amber-50 border-amber-100", icon: Timer, label: "Under Review" },
    REVIEWING: { color: "text-blue-600 bg-blue-50 border-blue-100", icon: FileText, label: "Screening" },
    INTERVIEW: { color: "text-indigo-600 bg-indigo-50 border-indigo-100", icon: Users, label: "Interviewing" },
    ACCEPTED: { color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: CheckCircle2, label: "Selected" },
    REJECTED: { color: "text-rose-600 bg-rose-50 border-rose-100", icon: AlertCircle, label: "Not Selected" }
  };

  const status = app.status.toUpperCase();
  const config = statusConfig[status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-slate-200 p-5 md:p-6 rounded-[2rem] flex flex-col lg:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-slate-200/40 transition-all group"
    >
      {/* Role & Company */}
      <div className="flex items-center gap-5 flex-1 w-full lg:w-auto">
        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
          <Building2 className="text-slate-400" size={24} />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-black text-slate-900 truncate tracking-tight">{app.internshipId?.title || "Role Title"}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{app.internshipId?.companyName || "Company Name"}</span>
            <div className="w-1 h-1 rounded-full bg-slate-200" />
            <span className="text-[11px] font-bold text-slate-400 italic">Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Metadata Info */}
      <div className="hidden xl:flex items-center gap-12 px-10 border-x border-slate-100">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Location</p>
          <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs italic">
            <MapPin size={14} className="text-slate-400 not-italic" /> {app.internshipId?.location || "Remote"}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Duration</p>
          <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs italic">
            <Calendar size={14} className="text-slate-400 not-italic" /> {app.internshipId?.duration || "N/A"}
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="w-full lg:w-48">
        <div className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border ${config.color} transition-all`}>
           <StatusIcon size={14} className="animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.1em]">{config.label}</span>
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center gap-2 shrink-0">
        <button className="p-3 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-90">
           <ExternalLink size={18} />
        </button>
        <button className="px-5 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-colors shadow-lg">
            Details <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default StudentApplications;