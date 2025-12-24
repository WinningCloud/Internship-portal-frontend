import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, User, Mail, Phone, Globe, 
  MapPin, Save, Loader2, ShieldCheck, 
  Info, Linkedin, X, Camera, Upload, 
  Trash2, ExternalLink
} from 'lucide-react';
import api from '../../api/axiosConfig.js';
import { AuthContext } from '../../context/AuthContext';

const StartupProfile = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [profile, setProfile] = useState({
    companyName: '',
    founderName: '',
    companyEmail: '',
    phone: '',
    description: '',
    website: '',
    location: '',
    yearFounded: '',
    logoUrl: '',
    linkedInUrl: ''
  });

// --- 1. DATA FETCHING LOGIC ---
  // --- 1. DATA FETCHING LOGIC ---
  useEffect(() => {
    const initProfile = async () => {
      if (!authLoading) {
        const userId = user?._id || user?.id;
        if (userId) {
          await fetchProfile(userId);
        } else {
          setLoading(false);
        }
      }
    };
    initProfile();
  }, [user, authLoading]);

  const fetchProfile = async (uid) => {
    try {
      const res = await api.get(`/startup/profile/get-profile/${uid}`);
      
      // Handle both { profile: {...} } and direct {...} responses
      const incomingData = res.data.profile || res.data;

      if (incomingData && typeof incomingData === 'object') {
        setProfile(prev => ({
          ...prev,
          ...incomingData,
          // Ensure nulls from DB are converted to empty strings for inputs
          companyName: incomingData.companyName || '',
          founderName: incomingData.founderName || '',
          companyEmail: incomingData.companyEmail || '',
          phone: incomingData.phone || '',
          description: incomingData.description || '',
          website: incomingData.website || '',
          location: incomingData.location || '',
          yearFounded: incomingData.yearFounded || '',
          logoUrl: incomingData.logoUrl || '',
          linkedInUrl: incomingData.linkedInUrl || ''
        }));
        setLogoPreview(incomingData.logoUrl);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const userId = user?._id || user?.id;
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(profile).forEach(key => {
        if (key !== 'logoUrl') formData.append(key, profile[key]);
      });

      // Append logo if new one exists
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const res = await api.post(`/startup/profile/upsert-profile/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfile(res.data.profile);
      setLogoFile(null);
      setMessage({ type: 'success', text: 'Corporate identity synchronized successfully.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Database synchronization failed.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-20 px-6 font-sans">
      
      {/* --- HEADER --- */}
      <div className="mb-10 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
             <ShieldCheck size={14} /> Official Startup Profile
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Console</h1>
        </div>

        <AnimatePresence>
          {message.text && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`px-4 py-2 rounded-xl border text-[11px] font-bold ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: MAIN MODULES --- */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* BRAND IDENTITY MODULE */}
          <FormSection title="Brand Identity" icon={Camera}>
             <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                   <div className="w-24 h-24 bg-white border border-slate-200 rounded-3xl overflow-hidden flex items-center justify-center shadow-sm">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="text-slate-200" size={40} />
                      )}
                   </div>
                   <button 
                     type="button"
                     onClick={() => fileInputRef.current.click()}
                     className="absolute -bottom-2 -right-2 p-2 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all scale-90"
                   >
                     <Upload size={14} />
                   </button>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
                </div>
                <div className="flex-1 space-y-1 text-center md:text-left">
                   <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">Company Logo</p>
                   <p className="text-xs text-slate-500">Square assets (500x500) work best. Transparent PNGs preferred.</p>
                   {logoFile && <p className="text-[10px] text-blue-600 font-black mt-2">New file: {logoFile.name}</p>}
                </div>
             </div>
          </FormSection>

          <FormSection title="Core Registry" icon={Info}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Registered Name" value={profile.companyName} onChange={(v) => setProfile({...profile, companyName: v})} placeholder="e.g. Crescent Tech" required />
              <InputField label="Founding Member" value={profile.founderName} onChange={(v) => setProfile({...profile, founderName: v})} placeholder="Full legal name" />
              <InputField label="Founding Year" value={profile.yearFounded} onChange={(v) => setProfile({...profile, yearFounded: v})} placeholder="YYYY" type="number" />
              <InputField label="Location" value={profile.location} onChange={(v) => setProfile({...profile, location: v})} placeholder="City, State" />
            </div>
          </FormSection>

          <FormSection title="Vision Statement" icon={Building2}>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Startup Description</label>
                <textarea 
                  value={profile.description}
                  onChange={(e) => setProfile({...profile, description: e.target.value})}
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all min-h-[140px] placeholder:text-slate-300"
                  placeholder="Summarize your startup's core operations and culture..."
                />
             </div>
          </FormSection>

        </div>

        {/* --- RIGHT: ACTIONS & CONNECTIVITY --- */}
        <div className="xl:col-span-4 sticky top-28 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">Connectivity</h3>
             <div className="space-y-5">
                <InputField label="Business Website" icon={Globe} value={profile.website} onChange={(v) => setProfile({...profile, website: v})} placeholder="www.example.com" />
                <InputField label="LinkedIn URL" icon={Linkedin} value={profile.linkedInUrl} onChange={(v) => setProfile({...profile, linkedInUrl: v})} placeholder="linkedin.com/company/..." />
                <InputField label="Contact Email" icon={Mail} value={profile.companyEmail} onChange={(v) => setProfile({...profile, companyEmail: v})} placeholder="hr@company.com" />
                <InputField label="Office Phone" icon={Phone} value={profile.phone} onChange={(v) => setProfile({...profile, phone: v})} placeholder="+91 00000 00000" />
             </div>
          </div>

          <div className="p-1 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm">
             <button 
               type="submit" disabled={saving}
               className="w-full py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 shadow-lg active:scale-[0.98] disabled:opacity-50"
             >
               {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
               <span>{saving ? "Updating..." : "Commit Changes"}</span>
             </button>
          </div>

          <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-start gap-4">
             <Info className="text-slate-400 shrink-0" size={18} />
             <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
               Authorized modifications to this profile are instantly visible across your active career postings.
             </p>
          </div>

        </div>
      </form>
    </div>
  );
};

/* --- REUSABLE COMPONENTS --- */

const FormSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm transition-all hover:border-slate-300">
    <div className="flex items-center gap-3 mb-8 px-1">
      <div className="p-2.5 bg-slate-50 rounded-xl text-slate-900 border border-slate-100">
        <Icon size={18} />
      </div>
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">{title}</h3>
    </div>
    {children}
  </div>
);

const InputField = ({ label, icon: Icon, type = "text", ...props }) => (
  <div className="space-y-1.5 group">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={14} />}
      <input 
        type={type}
        className={`w-full ${Icon ? 'pl-10' : 'px-5'} py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300 shadow-sm`}
        {...props}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  </div>
);

export default StartupProfile;