import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, FileText, CheckCircle, XCircle, Clock, Search, 
  ArrowLeft, ExternalLink, Loader2, Filter, 
  UserPlus, UserCheck, Award, Trash2, ChevronLeft, 
  ChevronRight, ShieldCheck, Upload, X, Building2,
  GraduationCap, Phone, Globe, Linkedin, Github, Briefcase,
  Layers, Trophy, Eye, Users, Inbox, Send
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
      console.error("Fetch Error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (appId) => {
    setProcessingId(appId);
    try {
      const res = await api.get(`/startup/applications/get-application/${appId}`);
      setStudentProfile(res.data); 
      setIsProfileModalOpen(true);
    } catch (err) {
      alert("Failed to retrieve candidate dossier.");
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
      alert("Status transition failed.");
    } finally {
      setProcessingId(null);
    }
  };

const handleCompleteSubmission = async (e) => {
  if (e) e.preventDefault();
  
  // Start loading state
  setProcessingId(selectedApp._id);

  try {
    // 1. Create FormData object (Standard for file uploads)
    const formData = new FormData();
    
    // 2. ONLY append if a file was selected. 
    // Key must be 'certificate' to match your backend upload.single('certificate')
    if (certificateFile) {
      formData.append('certificate', certificateFile);
    }

    // 3. Make the API call
    // Note: Do NOT manually set Content-Type header; 
    // Axios + Browser will automatically add the boundary for FormData.
    const res = await api.put(
      `/startup/applications/mark-application-complete/${selectedApp._id}`, 
      formData
    );

    if (res.status === 200) {
      // Success feedback
      setIsCompleteModalOpen(false);
      setCertificateFile(null);
      setSelectedApp(null);
      
      // Refresh the main list to show status as COMPLETED
      fetchApplications(); 
    }
  } catch (err) {
    console.error("Fronend Upload Error:", err);
    alert(err.response?.data?.message || "Verification system failed to issue certificate.");
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
  const totalPages = Math.ceil(filteredData.length / appsPerPage);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-20 px-8 font-sans">
      
      {/* --- HEADER --- */}
      <div className="mb-10 pt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-6">
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg">
                <Users size={24} />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">All Applicants </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
           <StatPill label="TOTAL" count={applications.length} color="blue" />
           <StatPill label="Shortlisted" count={applications.filter(a=>a.status==='SHORTLISTED').length} color="indigo" />
           <StatPill label="Selected" count={applications.filter(a=>a.status==='SELECTED').length} color="emerald" />
            <StatPill label="Rejected" count={applications.filter(a=>a.status==='REJECTED').length} color="red" />
        </div>
      </div>

      {/* --- UTILITY BAR --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text" placeholder="Search by candidate name..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-600 transition-all shadow-sm"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          {["ALL", "APPLIED", "SHORTLISTED", "SELECTED", "COMPLETED", "REJECTED"].map(s => (
            <button key={s} onClick={() => {setStatusFilter(s); setCurrentPage(1);}} 
              className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${statusFilter === s ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="w-[35%] pl-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidate Profile</th>
              <th className="w-[15%] px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="w-[35%] px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Hiring Decision</th>
              <th className="w-[15%] pr-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Records</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentData.map((app) => (
              <tr key={app._id} className={`transition-colors group ${app.status === 'COMPLETED' ? 'bg-slate-50/50 opacity-60 grayscale-[0.5]' : 'hover:bg-slate-50/30'}`}>
                <td className="pl-10 py-6">
                  <div className="flex items-center gap-4">
                    <div 
                        onClick={() => fetchStudentDetails(app._id)}
                        className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-sm border border-slate-200 shadow-inner overflow-hidden cursor-pointer hover:border-blue-400 group-hover:bg-white transition-all"
                    >
                        {processingId === app._id ? <Loader2 className="animate-spin" size={16} /> : app.studentId?.fullName?.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p onClick={() => fetchStudentDetails(app._id)} className="text-sm font-bold text-slate-900 uppercase tracking-tight cursor-pointer hover:text-blue-600 transition-colors">{app.studentId?.fullName}</p>
                        <Eye size={12} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{app.studentId?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center justify-center gap-2">
                     {app.status === 'APPLIED' && (
                       <>
                         <ActionBtn onClick={() => updateStatus(app._id, 'shortlist')} icon={UserPlus} color="blue" label="Shortlist" />
                         <ActionBtn onClick={() => updateStatus(app._id, 'reject')} icon={XCircle} color="red" label="Reject" />
                       </>
                     )}
                     {app.status === 'SHORTLISTED' && (
                       <>
                         <ActionBtn onClick={() => updateStatus(app._id, 'select')} icon={UserCheck} color="emerald" label="Select" />
                         <ActionBtn onClick={() => updateStatus(app._id, 'reject')} icon={XCircle} color="red" label="Reject" />
                       </>
                     )}
                     {app.status === 'SELECTED' && (
                        <ActionBtn onClick={() => { setSelectedApp(app); setIsCompleteModalOpen(true); }} icon={Award} color="indigo" label="Mark Complete" />
                     )}
                     {app.status === 'COMPLETED' && (
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                         <ShieldCheck size={12} className="text-emerald-500" /> Professional Cycle Closed
                       </div>
                     )}
                  </div>
                </td>
                <td className="pr-10 py-6 text-right">
                    <button onClick={() => updateStatus(app._id, 'delete')} className="p-2.5 bg-white border border-slate-200 text-slate-300 hover:text-red-600 rounded-lg transition-all active:scale-90 shadow-sm"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && <EmptyState />}
      </div>

      {/* --- STUDENT PROFILE MODAL --- */}
      <AnimatePresence>
        {isProfileModalOpen && studentProfile && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProfileModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[85vh]">
              
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0 font-sans">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-bold shadow-xl">{studentProfile.studentId?.fullName?.charAt(0)}</div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{studentProfile.studentId?.fullName}</h2>
                    <div className="flex items-center gap-3 mt-2">
                       <StatusBadge status={studentProfile.status} />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CIIC Verified Profile</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <a href={studentProfile.studentId?.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95">
                    <FileText size={16} /> Open Candidate CV
                  </a>
                  <button onClick={() => setIsProfileModalOpen(false)} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm"><X size={20} /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white custom-scrollbar">
                <div className="lg:col-span-8 space-y-12">
                   <ModuleCard title="Academic Portfolio" icon={GraduationCap}>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                        <DataBox label="Department" value={studentProfile.studentId?.department} />
                        <DataBox label="Course" value={studentProfile.studentId?.course} />
                        <DataBox label="Year" value={`Year ${studentProfile.studentId?.yearOfStudy}`} />
                        <DataBox label="Current CGPA" value={studentProfile.studentId?.cgpa} highlight />
                        <DataBox label="Corporate Phone" value={studentProfile.studentId?.phone} />
                        <DataBox label="Student Email" value={studentProfile.studentId?.personalEmail} />
                      </div>
                   </ModuleCard>

                   <ModuleCard title="Technical Skillset" icon={Layers}>
                      <div className="flex flex-wrap gap-2.5">
                        {studentProfile.studentId?.skills?.map((s, i) => (
                          <span key={i} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm uppercase tracking-tight">{s}</span>
                        ))}
                      </div>
                   </ModuleCard>

                   <ModuleCard title="Featured Projects" icon={Briefcase}>
                      <div className="grid grid-cols-1 gap-4">
                        {studentProfile.studentId?.projects?.map((p, i) => (
                          <div key={i} className="p-6 border border-slate-100 rounded-[2rem] bg-slate-50/30">
                             <div className="flex justify-between items-start mb-3">
                               <h4 className="font-bold text-slate-900 uppercase text-[13px] tracking-tight">{p.title}</h4>
                               {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="p-2 bg-white rounded-lg text-blue-600 shadow-sm"><ExternalLink size={14} /></a>}
                             </div>
                             <p className="text-xs text-slate-500 leading-relaxed font-medium">{p.description}</p>
                          </div>
                        ))}
                      </div>
                   </ModuleCard>
                </div>

                <div className="lg:col-span-4 space-y-8">
                   <ModuleCard title="Digital Channels" icon={Globe}>
                      <div className="space-y-3">
                        <SocialLink icon={Linkedin} label="LinkedIn Network" url={studentProfile.studentId?.linkedInUrl} />
                        <SocialLink icon={Github} label="GitHub Registry" url={studentProfile.studentId?.githubUrl} />
                        <SocialLink icon={Globe} label="Public Portfolio" url={studentProfile.studentId?.portfolioUrl} />
                      </div>
                   </ModuleCard>

                   <ModuleCard title="Key Achievements" icon={Trophy}>
                      <div className="space-y-4">
                        {studentProfile.studentId?.achievements?.map((a, i) => (
                          <div key={i} className="flex gap-4 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/50">
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                             <p className="text-[11px] font-bold text-slate-700 leading-normal">{a}</p>
                          </div>
                        ))}
                      </div>
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
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 text-center overflow-hidden">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner mx-auto"><Award size={40} /></div>
                <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Issue Certification</h2>
                <p className="text-sm text-slate-500 mt-2 font-medium px-4">Upload the final certificate for {selectedApp.studentId?.fullName}. This is optional.</p>
                
                <form onSubmit={handleCompleteSubmission} className="w-full mt-8 space-y-6">
                 <label className="block w-full border-2 border-dashed border-blue-200 rounded-[2rem] p-10 hover:border-blue-500 transition-all cursor-pointer group bg-blue-50/20">
  <input 
    type="file" 
    className="hidden" 
    accept=".pdf,.png,.jpg" 
    onChange={(e) => setCertificateFile(e.target.files[0])} 
  />
  
  <div className="flex flex-col items-center">
    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-500 mb-4 group-hover:scale-110 transition-transform">
      <Upload size={24} />
    </div>
    
    {certificateFile ? (
      <div className="text-center">
        <p className="text-xs font-bold text-slate-900 uppercase tracking-widest truncate max-w-[200px]">
          {certificateFile.name}
        </p>
        <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase tracking-tight">Ready for deployment</p>
      </div>
    ) : (
      <div className="text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Upload Accomplishment Certificate</p>
        <p className="text-[9px] text-slate-300 mt-1 uppercase">PDF or Image (Optional)</p>
      </div>
    )}
  </div>
</label>
                  <div className="flex gap-4">
                    <button type="submit" disabled={processingId === selectedApp._id} className="flex-1 bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-xl flex justify-center items-center gap-2 disabled:opacity-50">
                       {processingId === selectedApp._id ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                       {certificateFile ? 'Issue & Complete' : 'Skip & Complete'}
                    </button>
                    <button type="button" onClick={() => setIsCompleteModalOpen(false)} className="px-6 bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">Cancel</button>
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
    const colors = { 
      blue: "text-blue-600", 
      indigo: "text-indigo-600", 
      emerald: "text-emerald-600",
      red: "text-rose-600" // 👈 Added professional red shade
    };

    return (
        <div className="px-6 py-1 text-center border-r last:border-0 border-slate-100 min-w-[110px]">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">
              {label}
            </p>
            <p className={`text-lg font-black ${colors[color] || 'text-slate-900'}`}>
              {count < 10 ? `0${count}` : count}
            </p>
        </div>
    );
};

const StatusBadge = ({ status }) => {
  const map = {
    APPLIED: "bg-blue-50 text-blue-600 border-blue-100",
    SHORTLISTED: "bg-indigo-50 text-indigo-600 border-indigo-100",
    SELECTED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    COMPLETED: "bg-slate-900 text-white border-slate-800",
    REJECTED: "bg-red-50 text-red-600 border-red-100"
  };
  return <span className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold uppercase tracking-widest ${map[status] || 'bg-slate-50 text-slate-400'}`}>{status}</span>;
};

const ActionBtn = ({ icon: Icon, onClick, color, label }) => {
    const colors = { 
        blue: "hover:bg-blue-50 hover:text-blue-600", 
        emerald: "hover:bg-emerald-50 hover:text-emerald-600", 
        indigo: "hover:bg-indigo-50 hover:text-indigo-600", 
        red: "hover:bg-red-50 hover:text-red-600" 
    };
    return (
        <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-[9px] font-bold uppercase tracking-widest text-slate-500 transition-all active:scale-95 shadow-sm ${colors[color]}`}>
            <Icon size={14} /> {label}
        </button>
    );
};

const ModuleCard = ({ title, icon: Icon, children }) => (
    <div className="space-y-6">
        <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Icon size={18} /></div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{title}</h3>
        </div>
        {children}
    </div>
);

const DataBox = ({ label, value, highlight }) => (
    <div className="space-y-1.5">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
        <p className={`text-[13px] font-bold ${highlight ? 'text-blue-600' : 'text-slate-800'}`}>{value || '—'}</p>
    </div>
);

const SocialLink = ({ icon: Icon, label, url }) => (
    <a href={url} target="_blank" rel="noreferrer" className={`flex items-center gap-4 p-4 rounded-[1.5rem] border border-slate-100 transition-all ${url ? 'hover:bg-blue-50 hover:border-blue-200' : 'opacity-20 grayscale pointer-events-none'}`}>
        <Icon size={18} className="text-slate-300" />
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{label}</span>
    </a>
);

const EmptyState = () => (
    <div className="py-40 text-center flex flex-col items-center bg-white rounded-[3rem]">
        <Building2 size={64} className="text-slate-100 mb-6" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Applicants list currently empty</p>
    </div>
);

export default ViewApplications;