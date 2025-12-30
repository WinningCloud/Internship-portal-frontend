import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
//StatBox is not defined

import { 
  Search, User, Loader2, X, GraduationCap, 
  BookOpen, Award, Github, Linkedin, Globe, 
  ExternalLink, FileText, Phone, Mail, 
  Trophy, Layers, Code, Briefcase, Hash, Calendar,  Sparkles,
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
    <div className="space-y-6 bg-white p-8 min-h-screen font-sans text-gray-900">
      
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={() => setIsModalOpen(false)} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ scale: 0.98, opacity: 0, y: 10 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.98, opacity: 0, y: 10 }} 
        className="relative bg-white w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-slate-200 rounded-xl shadow-2xl"
      >
        {modalLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-50/50">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synchronizing Records...</p>
          </div>
        ) : !profileData ? (
          /* --- EMPTY STATE --- */
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50">
            <div className="w-20 h-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 mb-6 shadow-sm">
              <UserX size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Profile Incomplete</h3>
            <p className="text-xs text-slate-500 mt-2 font-bold max-w-xs leading-relaxed uppercase">
              This candidate has not yet finalized their professional documentation within the CIIC ecosystem.
            </p>
            <button onClick={() => setIsModalOpen(false)} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Dismiss</button>
          </div>
        ) : (
          /* --- PROFESSIONAL DOSSIER VIEW --- */
          <>
            {/* Header: Sharp & Tabular */}
            <div className="px-8 py-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-2xl shadow-lg uppercase">
                  {profileData.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{profileData.fullName}</h2>
                    {/* <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded text-[9px] font-black uppercase tracking-widest">Active Candidate</span> */}
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reg: {profileData.registerNumber}</p>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profileData.course}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><X size={20} /></button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#FBFBFE]">
              <div className="p-8 space-y-8">
                
                {/* 1. Academic & Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <StatBox label="Department" value={profileData.department} icon={GraduationCap} />
                  <StatBox label="Academic Year" value={`${profileData.yearOfStudy} Year`} icon={Calendar} />
                  <StatBox label="Cumulative GPA" value={profileData.cgpa} icon={Sparkles} highlight />
                  <StatBox label="Completion" value={`${profileData.profileCompletion}%`} icon={ShieldCheck} />
                </div>

                {/* 2. Technical Stack & Interests */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 space-y-4">
                    <SectionHeading icon={Code} title="Technical Stack" />
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((s, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-5 space-y-4">
                    <SectionHeading icon={Hash} title="Core Interests" />
                    <div className="flex flex-wrap gap-2">
                      {profileData.interests.map((s, i) => (
                        <span key={i} className="px-3 py-1.5 bg-indigo-50/50 border border-indigo-100/50 rounded text-[10px] font-bold uppercase tracking-widest text-indigo-600">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Project Portfolio */}
                <div className="space-y-4">
                  <SectionHeading icon={Briefcase} title="Project Portfolio" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.projects.map((p, i) => (
                      <div key={i} className="p-6 bg-white border border-slate-200 rounded-xl group transition-all hover:border-indigo-600 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">{p.title}</h4>
                          {p.link && <a href={p.link} target="_blank" className="text-slate-400 hover:text-indigo-600"><ExternalLink size={14}/></a>}
                        </div>
                        <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-4 line-clamp-2 uppercase tracking-tight">{p.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {p.technologies.map((tech, idx) => (
                            <span key={idx} className="text-[8px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">{tech}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Credentials & Achievements */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <SectionHeading icon={Award} title="Certifications" />
                    <div className="space-y-2">
                      {profileData.certifications.length > 0 ? profileData.certifications.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg">
                          <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{c.name}</p>
                          <ExternalLink size={12} className="text-slate-300" />
                        </div>
                      )) : <p className="text-[10px] text-slate-400 font-bold uppercase italic">No records found</p>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <SectionHeading icon={Trophy} title="Achievements" />
                    <div className="space-y-2">
                      {profileData.achievements.map((a, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-lg">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight leading-tight">{a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions: Sticky & Solid */}
            <div className="px-8 py-6 bg-white border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
              <a href={profileData.resumeUrl} target="_blank" className="flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">
                <FileText size={16} /> Access Resume
              </a>
              <SocialBtn icon={Linkedin} label="LinkedIn" url={profileData.linkedInUrl} color="hover:text-blue-600" />
              <SocialBtn icon={Github} label="GitHub" url={profileData.githubUrl} color="hover:text-slate-900" />
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

const StatBox = ({ label, value, icon: Icon, highlight }) => (
  <div className="bg-white border border-slate-200 p-5 rounded-lg flex flex-col items-center text-center group hover:border-indigo-600 transition-colors">
    <Icon size={18} className={`mb-3 ${highlight ? 'text-indigo-600' : 'text-slate-300'}`} />
    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
    <p className={`text-xs font-black uppercase tracking-tight ${highlight ? 'text-indigo-600' : 'text-slate-900'}`}>{value || 'N/A'}</p>
  </div>
);

const SectionHeading = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-2">
    <Icon size={16} className="text-slate-400" />
    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{title}</h3>
    <div className="h-px flex-1 bg-slate-100 ml-2" />
  </div>
);

const SocialBtn = ({ icon: Icon, label, url, color }) => (
  <a href={url} target="_blank" className={`flex items-center justify-center gap-2 py-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 ${color} transition-all font-black text-[10px] uppercase tracking-widest`}>
    <Icon size={16} /> {label}
  </a>
);

export default Students;