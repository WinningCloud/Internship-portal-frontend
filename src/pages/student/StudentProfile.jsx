import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Book, Phone, Globe, Award, Plus, Trash2, Save, Loader2, 
  Github, Linkedin, ExternalLink, FileText, Briefcase, 
  GraduationCap, Upload, X, Star, Zap, Code
} from 'lucide-react';
import api from '../../api/axiosConfig';

const StudentProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('academic');
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Initial State matching your Schema exactly
  const [profile, setProfile] = useState({
    fullName: '', registerNumber: '', department: '', course: '',
    yearOfStudy: 1, cgpa: '', phone: '',
    skills: [], interests: [], achievements: [],
    projects: [], certifications: [],
    githubUrl: '', linkedInUrl: '', portfolioUrl: null,
    resumeUrl: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/student/profile/get-my-profile');
        if (res.data) setProfile(res.data);
      } catch (err) {
        console.error("Profile not found or error fetching", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- Dynamic Completion Logic ---
  const calculateProgress = () => {
    const fields = [
      profile.fullName, profile.registerNumber, profile.department, 
      profile.course, profile.phone, profile.githubUrl, profile.resumeUrl
    ];
    let score = fields.filter(f => f && f !== '').length;
    if (profile.skills.length > 0) score++;
    if (profile.projects.length > 0) score++;
    if (profile.certifications.length > 0) score++;
    if (profile.cgpa > 0) score++;
    if (profile.achievements.length > 0) score++;

    return Math.round((score / 12) * 100);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const formData = new FormData();
      
      // Append standard fields
      const simpleFields = ['fullName', 'registerNumber', 'department', 'course', 'yearOfStudy', 'cgpa', 'phone', 'githubUrl', 'linkedInUrl', 'portfolioUrl'];
      simpleFields.forEach(key => formData.append(key, profile[key] || ''));

      // Append arrays as JSON strings (Backend needs to JSON.parse these)
      formData.append('skills', JSON.stringify(profile.skills));
      formData.append('interests', JSON.stringify(profile.interests));
      formData.append('achievements', JSON.stringify(profile.achievements));
      formData.append('projects', JSON.stringify(profile.projects));
      formData.append('certifications', JSON.stringify(profile.certifications));

      if (resumeFile) formData.append('resume', resumeFile);

      const res = await api.post('/student/profile/upsert-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfile(res.data.profile);
      setResumeFile(null);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save changes' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      
      {/* 1. COMPACT HEADER */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-indigo-100 shadow-xl">
            <User size={28} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">{profile.fullName || "Your Name"}</h1>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{profile.department || "No Department Set"}</p>
          </div>
        </div>

        <div className="w-full md:w-72 bg-white border border-slate-200 rounded-3xl p-4 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Completion</span>
            <span className="text-xs font-black text-indigo-600">{calculateProgress()}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${calculateProgress()}%` }} className="h-full bg-indigo-600" />
          </div>
        </div>
      </div>

      {/* 2. TAB NAV */}
      <div className="flex space-x-1 mb-6 bg-slate-200/50 p-1 rounded-xl w-fit">
        {['academic', 'info', 'projects', 'extras'].map((t) => (
          <button
            key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 3. MAIN FORM CONTENT */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm min-h-[400px]"
            >
              {/* ACADEMIC */}
              {activeTab === 'academic' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Full Name" value={profile.fullName} onChange={(v) => setProfile({...profile, fullName: v})} />
                  <InputField label="Register Number" value={profile.registerNumber} onChange={(v) => setProfile({...profile, registerNumber: v})} />
                  <InputField label="Department" value={profile.department} onChange={(v) => setProfile({...profile, department: v})} />
                  <InputField label="Course" value={profile.course} onChange={(v) => setProfile({...profile, course: v})} />
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 ml-1">Year of Study</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
                      value={profile.yearOfStudy} onChange={(e) => setProfile({...profile, yearOfStudy: e.target.value})}>
                      {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                  </div>
                  <InputField label="CGPA (0-10)" type="number" value={profile.cgpa} onChange={(v) => setProfile({...profile, cgpa: v})} />
                </div>
              )}

              {/* INFO (Phone & Socials) */}
              {activeTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Phone Number" icon={Phone} value={profile.phone} onChange={(v) => setProfile({...profile, phone: v})} />
                  <InputField label="GitHub URL" icon={Github} value={profile.githubUrl} onChange={(v) => setProfile({...profile, githubUrl: v})} />
                  <InputField label="LinkedIn URL" icon={Linkedin} value={profile.linkedInUrl} onChange={(v) => setProfile({...profile, linkedInUrl: v})} />
                  <InputField label="Portfolio URL" icon={Globe} value={profile.portfolioUrl} onChange={(v) => setProfile({...profile, portfolioUrl: v})} />
                </div>
              )}

              {/* PROJECTS & CERTS */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center"><h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Projects</h3>
                    <button onClick={() => setProfile({...profile, projects: [...profile.projects, {title: '', description: '', link: ''}]})} className="text-indigo-600"><Plus size={18} /></button></div>
                    {profile.projects.map((p, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative">
                        <button onClick={() => setProfile({...profile, projects: profile.projects.filter((_, idx) => idx !== i)})} className="absolute top-4 right-4 text-slate-300"><Trash2 size={14} /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <InputField label="Title" value={p.title} onChange={(v) => { let t = [...profile.projects]; t[i].title = v; setProfile({...profile, projects: t}); }} />
                          <InputField label="Link" value={p.link} onChange={(v) => { let t = [...profile.projects]; t[i].link = v; setProfile({...profile, projects: t}); }} />
                          <div className="md:col-span-2"><TextArea label="Description" value={p.description} onChange={(v) => { let t = [...profile.projects]; t[i].description = v; setProfile({...profile, projects: t}); }} /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EXTRAS (Skills/Interests/Achievements) */}
              {activeTab === 'extras' && (
                <div className="space-y-4">
                  <TextArea label="Skills (Comma separated)" value={profile.skills.join(', ')} onChange={(v) => setProfile({...profile, skills: v.split(',').map(s => s.trim())})} />
                  <TextArea label="Interests" value={profile.interests.join(', ')} onChange={(v) => setProfile({...profile, interests: v.split(',').map(s => s.trim())})} />
                  <TextArea label="Achievements" value={profile.achievements.join(', ')} onChange={(v) => setProfile({...profile, achievements: v.split(',').map(s => s.trim())})} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 4. SIDEBAR (Resume & Action) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Resume Document</h3>
            <label className="block border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-indigo-400 transition-all group">
              <input type="file" className="hidden" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
              <Upload className="mx-auto text-slate-300 group-hover:text-indigo-500 mb-2" size={24} />
              <p className="text-[11px] font-bold text-slate-600">Upload PDF</p>
            </label>
            {(resumeFile || profile.resumeUrl) && (
              <div className="mt-4 flex items-center justify-between p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText size={14} className="text-indigo-600" />
                  <span className="text-[10px] font-bold text-indigo-700 truncate">{resumeFile ? resumeFile.name : "Resume_Final.pdf"}</span>
                </div>
                {profile.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:scale-110 transition"><ExternalLink size={14} /></a>}
              </div>
            )}
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex justify-center items-center gap-2 hover:bg-indigo-600 shadow-xl transition-all disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Syncing..." : "Update Profile"}
          </button>
          
          {message.text && (
            <div className={`p-3 rounded-xl text-center text-[11px] font-bold border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- REUSABLE COMPACT COMPONENTS ---
const InputField = ({ label, value, onChange, type="text", icon: Icon }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">{label}</label>
    <div className="relative">
      {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />}
      <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)}
        className={`w-full ${Icon ? 'pl-9' : 'px-4'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 transition-all outline-none`}
        placeholder={label} />
    </div>
  </div>
);

const TextArea = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">{label}</label>
    <textarea value={value || ''} onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 h-20 outline-none transition-all" />
  </div>
);

export default StudentProfile;