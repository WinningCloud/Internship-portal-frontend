import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, User, Loader2, X, GraduationCap, 
  BookOpen, Award, Github, Linkedin, Globe, 
  ExternalLink, FileText, Phone, Mail, 
  Trophy, Layers, Code, Briefcase, Hash,
  ShieldCheck, AlertCircle, UserX
} from 'lucide-react';
import api from '../../api/axiosConfig';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/ciic/students/students');
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch student registry");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = async (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
    setModalLoading(true);
    setProfileData(null);

    try {
      const res = await api.get(`/ciic/students/students-profile/${student._id}`);
      setProfileData(res.data);
    } catch (err) {
      // 404 handled: profileData remains null, showing "Incomplete" UI
      console.log("Dossier not found for this candidate.");
    } finally {
      setModalLoading(false);
    }
  };

  const filteredList = useMemo(() => {
    return students.filter(s => 
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F6F2ED]">
      <Loader2 className="animate-spin text-[#F36B7F]" size={40} />
    </div>
  );

  return (
    <div className="space-y-6 bg-[#F6F2ED] p-8 min-h-screen font-sans text-gray-900">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase leading-none">
            Student <span className="text-[#F36B7F]">Registry</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Institutional Talent Pool</p>
        </div> */}

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#F36B7F] transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#E7E2DB] rounded-xl outline-none focus:ring-4 focus:ring-rose-50 transition-all font-bold text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-[2rem] border border-[#E7E2DB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-[#E7E2DB]">
                <th className="px-8 py-5">Full Name </th>
                <th className="px-6 py-5">University Email</th>
                <th className="px-6 py-5">Registered On</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-10 py-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2DB]">
              {filteredList.map((student) => (
                <tr key={student._id} className="hover:bg-[#FADADD]/10 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center font-black text-[#F36B7F] group-hover:bg-white transition-all shadow-inner">
                        {student.name?.charAt(0)}
                      </div>
                      <p className="font-bold text-gray-900 text-sm tracking-tight uppercase">{student.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs font-bold text-gray-500 lowercase">{student.email}</td>
                  <td className="px-6 py-6 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${student.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={() => handleViewProfile(student)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E7E2DB] rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#F36B7F] hover:border-[#F36B7F] transition-all shadow-sm active:scale-95"
                    >
                      <User size={14} /> Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PROFILE MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-[#E7E2DB]"
            >
              {modalLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-[#F36B7F]" size={40} />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Assembling Dossier...</p>
                </div>
              ) : !profileData ? (
                /* --- PROFILE INCOMPLETE STATE --- */
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                    <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-rose-300 mb-8 border border-rose-100 shadow-inner">
                        <UserX size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic-none">Profile Incomplete</h3>
                    <p className="text-sm text-slate-400 mt-3 font-bold max-w-sm mx-auto leading-relaxed uppercase tracking-tight">
                        Student has registered an account but has not yet completed the professional profile documentation.
                    </p>
                    <button onClick={() => setIsModalOpen(false)} className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#F36B7F] transition-all">Dismiss</button>
                </div>
              ) : (
                /* --- FULL PROFILE VIEW --- */
                <>
                  <div className="px-10 py-10 bg-slate-50 border-b border-[#E7E2DB] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-6">
                      <div className="w-18 h-18 bg-white border border-[#E7E2DB] rounded-3xl flex items-center justify-center text-blue-600 font-black text-3xl shadow-sm uppercase">
                        {profileData.fullName.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-2">{profileData.fullName}</h2>
                        <div className="flex items-center gap-3">
                           {/* <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-widest">
                             <ShieldCheck size={12} /> Identity Verified
                           </div> */}
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none border-l border-slate-200 pl-3">Rrn: {profileData.registerNumber}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm active:scale-90"><X size={24} /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-white">
                    {/* Academic Module */}
                    <div className="space-y-6">
                        <ModuleHeader icon={GraduationCap} title="Academics" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#F6F2ED]/50 p-8 rounded-[2.5rem] border border-[#E7E2DB] shadow-inner">
                            <DataBox label="Department" value={profileData.department} />
                            <DataBox label="Degree / Course" value={profileData.course} />
                            <DataBox label="Academic Year" value={`${profileData.yearOfStudy} Year`} />
                            <DataBox label="Current CGPA" value={profileData.cgpa} highlight />
                        </div>
                    </div>

                    {/* Skills & Interests */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <ModuleHeader icon={Code} title="Technical Proficiencies" />
                            <div className="flex flex-wrap gap-2.5">
                                {profileData.skills.map((s, i) => (
                                    <span key={i} className="px-4 py-2 bg-white border border-[#E7E2DB] rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm">{s}</span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <ModuleHeader icon={Hash} title="Core Interests" />
                            <div className="flex flex-wrap gap-2.5">
                                {profileData.interests.map((s, i) => (
                                    <span key={i} className="px-4 py-2 bg-[#F6F2ED] border border-transparent rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Projects Module */}
                    <div className="space-y-6">
                        <ModuleHeader icon={Briefcase} title="Projects" />
                        <div className="grid grid-cols-1 gap-4">
                            {profileData.projects.map((p, i) => (
                                <div key={i} className="p-6 border border-[#E7E2DB] rounded-[2rem] bg-slate-50 group hover:bg-white hover:border-[#F36B7F] transition-all shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-black text-slate-900 uppercase text-[13px] tracking-tight">{p.title}</h4>
                                        {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-blue-500 p-2 bg-white rounded-lg shadow-sm hover:text-blue-700 transition-colors"><ExternalLink size={14}/></a>}
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold leading-relaxed mb-4 uppercase tracking-tight">{p.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {p.technologies.map((tech, idx) => (
                                            <span key={idx} className="text-[9px] font-black text-[#F36B7F] uppercase tracking-widest">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Certifications & Achievements */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <ModuleHeader icon={Award} title="Digital Certificates" />
                            <div className="space-y-3">
                                {profileData.certifications.map((c, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-[#E7E2DB] rounded-2xl">
                                        <div>
                                            <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{c.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{c.issuer} • {c.year}</p>
                                        </div>
                                        <a href={c.certificateUrl} target="_blank" rel="noreferrer" className="text-indigo-600"><ExternalLink size={14}/></a>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <ModuleHeader icon={Trophy} title="System Achievements" />
                            <div className="space-y-3">
                                {profileData.achievements.map((a, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/50">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                                        <p className="text-[11px] font-bold text-slate-700 leading-normal uppercase tracking-tight">{a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Resume & Links */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
                        <a href={profileData.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 p-5 bg-slate-950 text-white rounded-[1.5rem] shadow-xl hover:bg-blue-600 transition-all uppercase font-black text-[10px] tracking-widest">
                            <FileText size={18} /> Resume
                        </a>
                        <SocialLink icon={Linkedin} label="LinkedIn" url={profileData.linkedInUrl} />
                        <SocialLink icon={Github} label="GitHub" url={profileData.githubUrl} />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- SHARED MODULAR SUB-COMPONENTS --- */

const StatPill = ({ label, count, color }) => {
    const colors = { blue: "text-blue-600", emerald: "text-emerald-600", indigo: "text-indigo-600" };
    return (
        <div className="px-6 py-1 text-center border-r last:border-0 border-slate-100 min-w-[100px]">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">{label}</p>
            <p className={`text-lg font-black ${colors[color]}`}>{count}</p>
        </div>
    );
};

const ModuleHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 border-l-4 border-[#F36B7F] pl-4 py-1">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Icon size={18} /></div>
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{title}</h3>
    </div>
);

const DataBox = ({ label, value, highlight }) => (
    <div className="space-y-1.5">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
        <p className={`text-[13px] font-bold ${highlight ? 'text-[#F36B7F]' : 'text-slate-800'}`}>{value || '—'}</p>
    </div>
);

const SocialLink = ({ icon: Icon, label, url }) => (
    <a href={url} target="_blank" rel="noreferrer" className={`flex items-center justify-center gap-3 p-5 bg-white border border-[#E7E2DB] rounded-[1.5rem] shadow-sm transition-all ${url ? 'hover:bg-[#F6F2ED] hover:border-[#F36B7F]' : 'opacity-20 pointer-events-none'}`}>
        <Icon size={18} className="text-slate-400" />
        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{label}</span>
    </a>
);

export default Students;