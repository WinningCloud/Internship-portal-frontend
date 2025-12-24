import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, FileText, CheckCircle, XCircle, Clock, Search, 
  ArrowLeft, ExternalLink, Loader2, Filter, 
  UserPlus, UserCheck, Award, Trash2, ChevronLeft, 
  ChevronRight, ShieldCheck, Upload, X, Building2,
  GraduationCap, Phone, Globe, Linkedin, Github, Briefcase,
  Layers, Trophy, Eye, Users // 👈 Ensure Eye and Users are here
} from "lucide-react";
import api from "../../api/axiosConfig.js";

const ViewApplications = () => {
  const { id: internshipId } = useParams();
  const navigate = useNavigate();

  // State Management
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState(null);

  // Modals State
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);

  const appsPerPage = 8;

  useEffect(() => {
    fetchApplications();
  }, [internshipId]);

  const fetchApplications = async () => {
    try {
      const res = await api.get(`/startup/applications/get-application-for-internship/${internshipId}`);
      setApplications(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (appId) => {
    setProcessingId(appId);
    try {
      const res = await api.get(`/startup/applications/get-application/${appId}`);
      setStudentProfile(res.data); // This contains populated studentId details
      setIsProfileModalOpen(true);
    } catch (err) {
      alert("Could not retrieve student profile details.");
    } finally {
      setProcessingId(null);
    }
  };

  const updateStatus = async (appId, action) => {
    setProcessingId(appId);
    try {
      const endpoints = {
        shortlist: `/startup/applications/shortlist-application/${appId}`,
        reject: `/startup/applications/reject-application/${appId}`,
        select: `/startup/applications/select-application/${appId}`,
        delete: `/startup/applications/delete-application/${appId}`
      };

      if (action === 'delete') {
        if (!window.confirm("Permanently remove this application?")) return;
        await api.delete(endpoints.delete);
        setApplications(prev => prev.filter(a => a._id !== appId));
      } else {
        await api.put(endpoints[action]);
        fetchApplications();
      }
    } catch (err) {
      alert("Action failed.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCompleteSubmission = async (e) => {
    e.preventDefault();
    setProcessingId(selectedApp._id);
    const formData = new FormData();
    if (certificateFile) formData.append('certificate', certificateFile);

    try {
      await api.put(`/startup/applications/mark-application-complete/${selectedApp._id}`, formData);
      setIsCompleteModalOpen(false);
      setCertificateFile(null);
      fetchApplications();
    } catch (err) {
      alert("Failed to issue certificate.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredData = useMemo(() => {
    return applications.filter(app => {
      const name = app.studentId?.fullName || "";
      return name.toLowerCase().includes(searchQuery.toLowerCase()) && 
             (statusFilter === "ALL" || app.status === statusFilter);
    });
  }, [applications, searchQuery, statusFilter]);

  const currentData = filteredData.slice((currentPage - 1) * appsPerPage, currentPage * appsPerPage);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-20 px-6 font-sans">
      
      {/* --- HEADER --- */}
      <div className="mb-10 pt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-6">
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase leading-none">Hiring Pipeline</h1>
          <p className="text-slate-400 text-sm font-medium mt-2">Manage candidates and view their professional profiles.</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
           <StatPill label="Applied" count={applications.length} color="blue" />
           <StatPill label="Shortlisted" count={applications.filter(a=>a.status==='SHORTLISTED').length} color="indigo" />
           <StatPill label="Selected" count={applications.filter(a=>a.status==='ACCEPTED').length} color="emerald" />
        </div>
      </div>

      {/* --- UTILITY --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={18} />
          <input 
            type="text" placeholder="Filter by candidate name..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-600 transition-all shadow-sm"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {["ALL", "APPLIED", "SHORTLISTED", "ACCEPTED", "COMPLETED", "REJECTED"].map(s => (
            <button key={s} onClick={() => {setStatusFilter(s); setCurrentPage(1);}} 
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${statusFilter === s ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="pl-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidate Information</th>
              <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Pipeline Actions</th>
              <th className="pr-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Records</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentData.map((app) => (
              <tr key={app._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="pl-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-sm border border-slate-200 shadow-inner">{app.studentId?.fullName?.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-tight uppercase">{app.studentId?.fullName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{app.studentId?.department} • Year {app.studentId?.yearOfStudy}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-2">
                     {app.status === 'APPLIED' && <ActionBtn onClick={() => updateStatus(app._id, 'shortlist')} icon={UserPlus} color="blue" label="Shortlist" />}
                     {app.status === 'SHORTLISTED' && <ActionBtn onClick={() => updateStatus(app._id, 'select')} icon={UserCheck} color="emerald" label="Select" />}
                     {app.status === 'ACCEPTED' && <ActionBtn onClick={() => { setSelectedApp(app); setIsCompleteModalOpen(true); }} icon={Award} color="indigo" label="Mark Complete" />}
                     {['APPLIED', 'SHORTLISTED'].includes(app.status) && <ActionBtn onClick={() => updateStatus(app._id, 'reject')} icon={XCircle} color="red" label="Reject" />}
                  </div>
                </td>
                <td className="pr-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                     <button 
                       onClick={() => fetchStudentDetails(app._id)}
                       className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-sm"
                     >
                       <User size={14} /> Profile
                     </button>
                     <button onClick={() => updateStatus(app._id, 'delete')} className="p-2 bg-white border border-slate-200 text-slate-300 hover:text-red-600 rounded-lg transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- STUDENT PROFILE MODAL --- */}
      <AnimatePresence>
        {isProfileModalOpen && studentProfile && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProfileModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[90vh]">
              
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl">{studentProfile.studentId?.fullName?.charAt(0)}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{studentProfile.studentId?.fullName}</h2>
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">Register No: {studentProfile.studentId?.registerNumber || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <a href={studentProfile.studentId?.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                    <FileText size={16} /> View Resume
                  </a>
                  <button onClick={() => setIsProfileModalOpen(false)} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white">
                
                {/* Academic & Bio */}
                <div className="lg:col-span-8 space-y-10">
                   <ModuleCard title="Academic Profile" icon={GraduationCap}>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <DataBox label="Department" value={studentProfile.studentId?.department} />
                        <DataBox label="Course" value={studentProfile.studentId?.course} />
                        <DataBox label="Year" value={studentProfile.studentId?.yearOfStudy} />
                        <DataBox label="CGPA" value={studentProfile.studentId?.cgpa} highlight />
                        <DataBox label="Contact Email" value={studentProfile.studentId?.personalEmail} />
                        <DataBox label="Phone" value={studentProfile.studentId?.phone} />
                      </div>
                   </ModuleCard>

                   <ModuleCard title="Skills & Interests" icon={Layers}>
                      <div className="space-y-6">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Core Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {studentProfile.studentId?.skills?.map((s, i) => (
                              <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Interests</p>
                          <div className="flex flex-wrap gap-2">
                            {studentProfile.studentId?.interests?.map((s, i) => (
                              <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-100">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                   </ModuleCard>

                   <ModuleCard title="Projects" icon={Briefcase}>
                      <div className="space-y-4">
                        {studentProfile.studentId?.projects?.map((p, i) => (
                          <div key={i} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50">
                             <div className="flex justify-between items-start mb-2">
                               <h4 className="font-bold text-slate-900 uppercase text-sm tracking-tight">{p.title}</h4>
                               {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-blue-600"><ExternalLink size={14} /></a>}
                             </div>
                             <p className="text-xs text-slate-500 leading-relaxed font-medium">{p.description}</p>
                          </div>
                        ))}
                      </div>
                   </ModuleCard>
                </div>

                {/* Achievements & Links */}
                <div className="lg:col-span-4 space-y-6">
                   <ModuleCard title="Links" icon={Globe}>
                      <div className="space-y-3">
                        <SocialLink icon={Linkedin} label="LinkedIn" url={studentProfile.studentId?.linkedInUrl} />
                        <SocialLink icon={Github} label="Github" url={studentProfile.studentId?.githubUrl} />
                        <SocialLink icon={Globe} label="Portfolio" url={studentProfile.studentId?.portfolioUrl} />
                      </div>
                   </ModuleCard>

                   <ModuleCard title="Achievements" icon={Trophy}>
                      <ul className="space-y-3">
                        {studentProfile.studentId?.achievements?.map((a, i) => (
                          <li key={i} className="flex gap-3 text-xs font-medium text-slate-600">
                             <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                             {a}
                          </li>
                        ))}
                      </ul>
                   </ModuleCard>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- COMPLETE INTERNSHIP MODAL --- */}
      <AnimatePresence>
        {isCompleteModalOpen && selectedApp && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCompleteModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 overflow-hidden text-center">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner mx-auto"><Award size={32} /></div>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Issue Certification</h2>
                <p className="text-sm text-slate-500 mt-2 font-medium">Confirm completion for {selectedApp.studentId?.fullName}.</p>
                
                <form onSubmit={handleCompleteSubmission} className="w-full mt-8 space-y-6">
                  <label className="block w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-blue-400 transition-all cursor-pointer group bg-slate-50/50">
                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => setCertificateFile(e.target.files[0])} />
                    <Upload className="mx-auto text-slate-300 group-hover:text-blue-500 mb-3" size={32} />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{certificateFile ? certificateFile.name : 'Select PDF Certificate'}</p>
                  </label>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-sm transition-all shadow-lg flex justify-center items-center gap-2">
                       {processingId ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                       Complete Role
                    </button>
                    <button type="button" onClick={() => setIsCompleteModalOpen(false)} className="px-6 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">Cancel</button>
                  </div>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const StatPill = ({ label, count, color }) => {
    const colors = { blue: "text-blue-600", indigo: "text-indigo-600", emerald: "text-emerald-600" };
    return (
        <div className="px-5 py-1 text-center border-r last:border-0 border-slate-100 min-w-[100px]">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
            <p className={`text-base font-bold ${colors[color]}`}>{count}</p>
        </div>
    );
};

const StatusBadge = ({ status }) => {
  const map = {
    APPLIED: "bg-blue-50 text-blue-600 border-blue-100",
    SHORTLISTED: "bg-indigo-50 text-indigo-600 border-indigo-100",
    ACCEPTED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    COMPLETED: "bg-slate-900 text-white border-slate-800",
    REJECTED: "bg-red-50 text-red-600 border-red-100"
  };
  return <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-widest ${map[status] || 'bg-slate-50 text-slate-400'}`}>{status}</span>;
};

const ActionBtn = ({ icon: Icon, onClick, color, label }) => {
    const colors = { blue: "hover:bg-blue-50 hover:text-blue-600", emerald: "hover:bg-emerald-50 hover:text-emerald-600", indigo: "hover:bg-indigo-50 hover:text-indigo-600", red: "hover:bg-red-50 hover:text-red-600" };
    return (
        <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[9px] font-bold uppercase tracking-widest text-slate-500 transition-all active:scale-95 ${colors[color]}`}>
            <Icon size={13} /> {label}
        </button>
    );
};

const ModuleCard = ({ title, icon: Icon, children }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-3">
            <Icon size={16} className="text-slate-400" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{title}</h3>
        </div>
        {children}
    </div>
);

const DataBox = ({ label, value, highlight }) => (
    <div className="space-y-1">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
        <p className={`text-sm font-bold ${highlight ? 'text-blue-600' : 'text-slate-800'}`}>{value || '—'}</p>
    </div>
);

const SocialLink = ({ icon: Icon, label, url }) => (
    <a href={url} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-3 rounded-xl border border-slate-100 transition-all ${url ? 'hover:bg-blue-50 hover:border-blue-200' : 'opacity-30 grayscale pointer-events-none'}`}>
        <Icon size={16} className="text-slate-400" />
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{label}</span>
    </a>
);

const EmptyState = () => (
    <div className="py-40 text-center flex flex-col items-center bg-white">
        <Inbox size={48} className="text-slate-100 mb-4" />
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Application Pool Empty</p>
    </div>
);

export default ViewApplications;