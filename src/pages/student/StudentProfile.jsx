import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Book, Phone, Globe, Award, Plus, Trash2, Save, Loader2, 
  Github, Linkedin, ExternalLink, FileText, Briefcase, 
  GraduationCap, Upload, X, Target, Code, Hash, Link as LinkIcon,
  ChevronRight, BadgeCheck
} from 'lucide-react';
import api from '../../api/axiosConfig';

const StudentProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('academic');
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');

  const [profile, setProfile] = useState({
    fullName: '', registerNumber: '', department: '', course: '',
    yearOfStudy: 1, cgpa: '', phone: '',
    skills: [], interests: [], achievements: [],
    projects: [], certifications: [],
    githubUrl: '', linkedInUrl: '', portfolioUrl: '',
    resumeUrl: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/student/profile/get-my-profile');
      if (res.data) setProfile(res.data);
    } catch (err) {
      console.error("Profile records initialization required.");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    const fields = [profile.fullName, profile.registerNumber, profile.department, profile.course, profile.phone, profile.githubUrl, profile.resumeUrl];
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
      const simpleFields = ['fullName', 'registerNumber', 'department', 'course', 'yearOfStudy', 'cgpa', 'phone', 'githubUrl', 'linkedInUrl', 'portfolioUrl'];
      simpleFields.forEach(key => formData.append(key, profile[key] || ''));

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
      setMessage({ type: 'success', text: 'Workstation Data Sync Successful' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Network synchronization error' });
    } finally {
      setSaving(false);
    }
  };

  const addTag = (e, field, value, setter) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      if (!profile[field].includes(value.trim())) {
        setProfile({ ...profile, [field]: [...profile[field], value.trim()] });
      }
      setter('');
    }
  };

  const removeTag = (field, tag) => {
    setProfile({ ...profile, [field]: profile[field].filter(t => t !== tag) });
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  );

  const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil", "Aeronautical", "BCA", "B.Sc", "Architecture"];


  return (
    <div className="h-[calc(100vh-100px)] flex flex-col font-sans max-w-[1600px] mx-auto px-6 overflow-hidden">
      
      {/* --- TOP STATUS HEADER --- */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6 shrink-0">
        <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
              <User size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none uppercase">
                   {profile.fullName || "Incumbent User"}
                </h1>
                <BadgeCheck size={16} className="text-indigo-600" />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{profile.department || "Academic Department Not Set"}</p>
            </div>
          </div>
          
          <div className="hidden xl:flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 gap-1">
            {['academic', 'info', 'projects', 'extras'].map((t) => (
              <button
                key={t} onClick={() => setActiveTab(t)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === t ? 'bg-white text-indigo-600 shadow-md shadow-slate-200 border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-[2rem] p-5 flex flex-col justify-center shadow-sm">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Profile Integrity</span>
            <span className="text-xs font-black text-indigo-600 leading-none">{calculateProgress()}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-50">
            <motion.div 
               initial={{ width: 0 }} 
               animate={{ width: `${calculateProgress()}%` }} 
               className="h-full bg-indigo-600" 
            />
          </div>
        </div>
      </div>

      {/* --- CONTENT WORKSTATION --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden pb-6 min-h-0">
        
        {/* --- MAIN MODULE VIEW (Internal Scroll) --- */}
        <div className="lg:col-span-8 flex flex-col min-h-0 overflow-hidden bg-white border border-slate-200 rounded-[2.5rem] shadow-sm relative">
           {/* Section Banner Indicator */}
           <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-20" />

           <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  
                  {activeTab === 'academic' && (
  <div className="space-y-10">
    <SectionHeader icon={GraduationCap} title="University Credentials" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* 1. Official Full Name */}
      <InputField 
        label="Official Full Name" 
        value={profile.fullName} 
        onChange={(v) => setProfile({...profile, fullName: v})} 
        placeholder="Full legal name" 
      />

      {/* 2. Roll / Registration Number */}
      <InputField 
        label="Roll / Registration Number" 
        value={profile.registerNumber} 
        onChange={(v) => setProfile({...profile, registerNumber: v})} 
        placeholder="University identifier" 
      />

      {/* 3. Field of Study (UPDATED TO DROPDOWN FOR ANALYTICS) */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 leading-none">
          Field of Study / Department
        </label>
        <div className="relative group">
          <select 
            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all appearance-none cursor-pointer"
            value={profile.department} 
            onChange={(e) => setProfile({...profile, department: e.target.value})}
          >
            <option value="">Select Department</option>
            {["CSE", "IT", "ECE", "EEE", "MECHANICAL", "CIVIL", "AERONAUTICAL", "BCA", "BSC", "ARCHITECTURE", "OTHER"].map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 rotate-90 pointer-events-none" size={18} />
        </div>
      </div>

      {/* 4. Current Degree/Course */}
      <InputField 
        label="Current Degree/Course" 
        value={profile.course} 
        onChange={(v) => setProfile({...profile, course: v})} 
        placeholder="e.g. B.Tech Cyber Security" 
      />
      
      {/* 5. Phase of Study */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 leading-none">
          Phase of Study
        </label>
        <div className="relative group">
          <select 
            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all appearance-none cursor-pointer"
            value={profile.yearOfStudy} 
            onChange={(e) => setProfile({...profile, yearOfStudy: Number(e.target.value)})}
          >
            {[1, 2, 3, 4].map(y => (
              <option key={y} value={y}>Undergraduate Year {y}</option>
            ))}
          </select>
          <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 rotate-90 pointer-events-none" size={18} />
        </div>
      </div>

      {/* 6. Cumulative CGPA */}
      <InputField 
        label="Cumulative CGPA" 
        type="number" 
        value={profile.cgpa} 
        onChange={(v) => setProfile({...profile, cgpa: v})} 
        placeholder="e.g. 9.1" 
      />

    </div>
  </div>
)}

                  {activeTab === 'info' && (
                    <div className="space-y-10">
                      <SectionHeader icon={Phone} title="Network & Reach" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputField label="Primary Contact Number" icon={Phone} value={profile.phone} onChange={(v) => setProfile({...profile, phone: v})} placeholder="+91 XXXX..." />
                        <InputField label="Github Registry" icon={Github} value={profile.githubUrl} onChange={(v) => setProfile({...profile, githubUrl: v})} placeholder="github.com/yourhandle" />
                        <InputField label="LinkedIn Identity" icon={Linkedin} value={profile.linkedInUrl} onChange={(v) => setProfile({...profile, linkedInUrl: v})} placeholder="linkedin.com/in/user" />
                        <InputField label="External Portfolio" icon={Globe} value={profile.portfolioUrl} onChange={(v) => setProfile({...profile, portfolioUrl: v})} placeholder="www.yourdomain.com" />
                      </div>
                    </div>
                  )}

                  {activeTab === 'projects' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <SectionHeader icon={Briefcase} title="Research & Implementation" />
                        <button onClick={() => setProfile({...profile, projects: [{title: '', description: '', link: ''}, ...profile.projects]})} 
                          className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-md active:scale-95">
                          <Plus size={14}/> Create Project Case
                        </button>
                      </div>
                      
                      {profile.projects.map((p, i) => (
                        <motion.div layout key={i} className="p-6 bg-[#FBFBFE] border border-slate-100 rounded-3xl relative shadow-sm border-l-4 border-l-slate-200">
                          <button onClick={() => setProfile({...profile, projects: profile.projects.filter((_, idx) => idx !== i)})} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors">
                             <Trash2 size={16} />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                            <InputField label="Subject / Project Title" value={p.title} onChange={(v) => { let t = [...profile.projects]; t[i].title = v; setProfile({...profile, projects: t}); }} placeholder="e.g. CIIC Portal Dev" />
                            <InputField label="Source / Build Link" icon={LinkIcon} value={p.link} onChange={(v) => { let t = [...profile.projects]; t[i].link = v; setProfile({...profile, projects: t}); }} placeholder="e.g. GitHub or Vercel link" />
                            <div className="md:col-span-2">
                               <TextAreaField label="Conceptual Overview" value={p.description} onChange={(v) => { let t = [...profile.projects]; t[i].description = v; setProfile({...profile, projects: t}); }} placeholder="Describe technologies and outcomes..." />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'extras' && (
                    <div className="space-y-12">
                      <TagModule icon={Code} label="Technical Proficiencies" value={skillInput} setter={setSkillInput} items={profile.skills} field="skills" addTag={addTag} removeTag={removeTag} color="indigo" />
                      <TagModule icon={Hash} label="Core Interests" value={interestInput} setter={setInterestInput} items={profile.interests} field="interests" addTag={addTag} removeTag={removeTag} color="slate" />
                      <TagModule icon={Award} label="Formal Achievements" value={achievementInput} setter={setAchievementInput} items={profile.achievements} field="achievements" addTag={addTag} removeTag={removeTag} color="indigo" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
           </div>
        </div>

        {/* --- RIGHT: ACTIONS & DOCUMENTS --- */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex-1 flex flex-col overflow-hidden">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 leading-none px-1">Portfolio Documentation</h3>
            
            <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-1">
               <label className="block border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center cursor-pointer hover:bg-[#FBFBFE] hover:border-indigo-400 transition-all group">
                 <input type="file" className="hidden" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
                 <Upload className="mx-auto text-slate-300 group-hover:text-indigo-600 mb-4 transition-colors" size={36} />
                 <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Select CV/Resume</p>
                 <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tight">Format: PDF (Strictly)</p>
               </label>

               {(resumeFile || profile.resumeUrl) && (
                 <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
                   <div className="flex items-center gap-3 overflow-hidden min-w-0">
                     <FileText size={20} className="text-indigo-600 shrink-0" />
                     <span className="text-xs font-bold text-slate-700 truncate tracking-tight uppercase">
                       {resumeFile ? resumeFile.name : "Encrypted_CV_V2.pdf"}
                     </span>
                   </div>
                   {profile.resumeUrl && (
                      <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="p-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                        <ExternalLink size={16} />
                      </a>
                   )}
                 </motion.div>
               )}

               <div className="mt-4 p-6 bg-[#020617] rounded-[2rem] text-white shadow-xl border border-white/5 relative overflow-hidden">
                  <div className="relative z-10">
                     <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.25em] mb-4">Official Verification</p>
                     <p className="text-[11px] leading-relaxed opacity-70 font-medium">Your portfolio artifacts are encrypted and verified via the **CIIC Council Standards**.</p>
                  </div>
                  <Target size={120} className="absolute -right-12 -bottom-12 opacity-5 text-indigo-500" />
               </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
               <button onClick={handleSave} disabled={saving} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.25em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 transition-all">
                 {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                 {saving ? "Transmitting..." : "Update Portoflio"}
               </button>
               <AnimatePresence>
                 {message.text && (
                   <motion.p initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} className={`text-center mt-6 text-[10px] font-bold uppercase tracking-widest ${message.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {message.text}
                   </motion.p>
                 )}
               </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SHARED UI MODULES --- */

const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white border border-slate-800 shadow-sm shadow-slate-100 shrink-0">
            <Icon size={18} />
        </div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">{title}</h3>
    </div>
);

const TagModule = ({ icon: Icon, label, value, setter, items, field, addTag, removeTag, color }) => (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
           <div className={`p-2 rounded-lg ${color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}><Icon size={18} /></div>
           <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{label}</p>
        </div>
        
        <input 
            type="text" value={value} onChange={(e) => setter(e.target.value)} onKeyDown={(e) => addTag(e, field, value, setter)}
            placeholder={`Enter ${label.toLowerCase()} and hit Enter key...`}
            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.25rem] text-sm font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-300"
        />

        <div className="flex flex-wrap gap-2 px-1">
            {items.map((item, i) => (
                <motion.span initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} key={i} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:border-indigo-200 group">
                    {item}
                    <X size={12} className="cursor-pointer text-slate-300 hover:text-rose-500" onClick={() => removeTag(field, item)} />
                </motion.span>
            ))}
        </div>
    </div>
);

const InputField = ({ label, value, onChange, type="text", icon: Icon, ...props }) => (
  <div className="space-y-2 group">
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-indigo-600">{label}</label>
    <div className="relative">
      {Icon && <Icon size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" />}
      <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)}
        className={`w-full ${Icon ? 'pl-12' : 'px-5'} py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-200 shadow-sm`}
        {...props} />
    </div>
  </div>
);

const TextAreaField = ({ label, value, onChange, ...props }) => (
  <div className="space-y-2 group">
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 leading-none transition-colors group-focus-within:text-indigo-600">{label}</label>
    <textarea value={value || ''} onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-3xl text-sm font-bold text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 h-32 outline-none transition-all placeholder:text-slate-200 shadow-sm resize-none overflow-y-auto custom-scrollbar" 
      {...props} />
  </div>
);

export default StudentProfile;