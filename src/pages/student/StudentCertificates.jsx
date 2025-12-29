import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Award,
  Calendar,
  Building2,
  ExternalLink,
  Download,
  Loader2,
  Inbox,
  X,
  ShieldCheck,
  Eye,
  FileText,
  Clock
} from "lucide-react";
import api from "../../api/axiosConfig.js";

const StudentCertificates = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get("/student/application/get-my-applications");
      // Filter only completed internships that have a certificate URL
      const certified = res.data.filter(app => app.status === "COMPLETED" && app.certificateUrl);
      setApplications(certified);
    } catch (err) {
      console.error("Certificate fetch error");
    } finally {
      setLoading(false);
    }
  };

  const filteredCerts = useMemo(() => {
    return applications.filter(app => 
      app.internshipId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.startupId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [applications, searchQuery]);

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${filename}_Certificate.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      window.open(url, '_blank'); // Fallback
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  );

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col font-sans max-w-[1600px] mx-auto px-6 overflow-hidden bg-[#F8FAFC]">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6 shrink-0 pt-4">
        <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
              <Award size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">My certificates</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Verified Completion Certificates</p>
            </div>
          </div>
          <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 text-indigo-600 font-black text-xs uppercase tracking-widest">
            {applications.length} Issued
          </div>
        </div>

        <div className="w-full lg:w-96 group">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={18} />
            <input
              type="text" placeholder="Search certifications..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-bold text-sm text-slate-800 transition-all placeholder:text-slate-200 shadow-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="flex-1 overflow-hidden bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex flex-col mb-6">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
              <tr>
                <th className="pl-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Credential Name</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Issued By</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Completion Date</th>
                <th className="pr-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCerts.map((app, index) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                  key={app._id} className="hover:bg-[#FBFBFE] transition-colors group"
                >
                  <td className="pl-10 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm"><FileText size={18}/></div>
                       <div>
                         <p className="text-sm font-bold text-slate-900 uppercase tracking-tight leading-tight">{app.internshipId?.title}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ref ID: {app._id.slice(-6).toUpperCase()}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                      <Building2 size={12} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{app.startupId?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center">
                        <p className="text-xs font-bold text-slate-700">{new Date(app.updatedAt).toLocaleDateString()}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Verified Sync</p>
                    </div>
                  </td>
                  <td className="pr-10 py-6 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                        onClick={() => setSelectedCert(app)}
                        className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 rounded-xl shadow-sm transition-all active:scale-90"
                       >
                         <Eye size={18} />
                       </button>
                       <button 
                        onClick={() => handleDownload(app.certificateUrl, app.internshipId?.title)}
                        className="p-3 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-indigo-600 transition-all active:scale-90"
                       >
                         <Download size={18} />
                       </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredCerts.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center py-24 opacity-40">
                <Inbox size={64} className="text-slate-200 mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No achievements unlocked yet</p>
             </div>
          )}
        </div>
      </div>

      {/* --- CERTIFICATE MODAL --- */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCert(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-white/20"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner"><Award size={24} /></div>
                   <div>
                     <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{selectedCert.internshipId?.title}</h2>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Issuer: {selectedCert.startupId?.name}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleDownload(selectedCert.certificateUrl, selectedCert.internshipId?.title)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
                  >
                    <Download size={14} /> Download
                  </button>
                  <button onClick={() => setSelectedCert(null)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all"><X size={20} /></button>
                </div>
              </div>

              {/* Certificate Display Area */}
              <div className="flex-1 bg-slate-100 overflow-hidden flex items-center justify-center p-8 relative">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                 
                 <div className="relative w-full h-full bg-white shadow-2xl rounded-lg overflow-hidden border border-slate-200">
                    <img 
                        src={selectedCert.certificateUrl} 
                        className="w-full h-full object-contain" 
                        alt="Certification Document"
                    />
                 </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-6 shrink-0">
                 <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digitally Signed by CIIC Council</span>
                 </div>
                 <div className="w-1 h-1 bg-slate-200 rounded-full" />
                 <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Permanent Record Entry</span>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentCertificates;