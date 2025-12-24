import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, User, Mail, Phone, Globe, 
  MapPin, Save, Loader2, ShieldCheck, 
  Info, Linkedin, X
} from 'lucide-react';
import api from '../../api/axiosConfig.js';
import { AuthContext } from '../../context/AuthContext';

const StartupProfile = () => {
  // 1. Get auth loading state and user from context
  const { user, loading: authLoading } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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

  // 2. Optimized Effect: Runs only after AuthContext is ready
  useEffect(() => {
    const init = async () => {
      // Wait until AuthContext finishes checking the token
      if (!authLoading) {
        const userId = user?._id || user?.id; // Check both naming conventions
        
        if (userId) {
          console.log("Fetching profile for UID:", userId);
          await fetchProfile(userId);
        } else {
          console.warn("No User ID found in context");
          setLoading(false); // Stop loading even if no user is found
        }
      }
    };

    init();
  }, [user, authLoading]);

  const fetchProfile = async (uid) => {
    try {
      const res = await api.get(`/startup/profile/get-profile/${uid}`);
      if (res.data) setProfile(res.data);
    } catch (err) {
      console.log("Profile not found. Startup can create a new one.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const userId = user?._id || user?.id;
    if (!userId) return alert("Session expired. Please login again.");

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post(`/startup/profile/upsert-profile/${userId}`, profile);
      setProfile(res.data.profile);
      setMessage({ type: 'success', text: 'Corporate profile updated successfully.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Update failed. Check your network.' });
    } finally {
      setSaving(false);
    }
  };

  // 3. Professional Loading State
  if (loading || authLoading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Secure Profile</p>
    </div>
  );

  return (
    <div className="w-full max-w-[1500px] mx-auto pb-20 px-6 font-sans">
      
      {/* --- HEADER --- */}
      <div className="mb-12 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white border border-slate-200 rounded-[1.5rem] flex items-center justify-center shadow-sm overflow-hidden p-3 shrink-0">
             {profile.logoUrl ? (
               <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain" />
             ) : (
               <Building2 className="text-slate-200" size={36} />
             )}
          </div>
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.25em] mb-1.5">
               <ShieldCheck size={14} /> Verified Partner
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {profile.companyName || "Organization Profile"}
            </h1>
            <p className="text-slate-400 text-sm font-medium">Manage your public startup identity and contact endpoints.</p>
          </div>
        </div>

        <AnimatePresence>
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className={`px-5 py-3 rounded-2xl border text-[11px] font-bold flex items-center gap-3 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        <div className="xl:col-span-8 space-y-8">
          <FormSection title="Base Parameters" icon={Info}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label="Registered Name" value={profile.companyName} onChange={(v) => setProfile({...profile, companyName: v})} required />
              <InputField label="Founder Name" value={profile.founderName} onChange={(v) => setProfile({...profile, founderName: v})} />
              <InputField label="Year Founded" value={profile.yearFounded} onChange={(v) => setProfile({...profile, yearFounded: v})} type="number" />
              <InputField label="Logo URL" value={profile.logoUrl} onChange={(v) => setProfile({...profile, logoUrl: v})} />
            </div>
          </FormSection>

          <FormSection title="Vision & Operations" icon={Building2}>
             <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Company Description</label>
                <textarea 
                  value={profile.description}
                  onChange={(e) => setProfile({...profile, description: e.target.value})}
                  className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-medium text-slate-700 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all min-h-[180px] leading-relaxed"
                  placeholder="Summarize your mission..."
                />
             </div>
          </FormSection>

          <FormSection title="Digital Footprint" icon={Globe}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label="Website" icon={Globe} value={profile.website} onChange={(v) => setProfile({...profile, website: v})} />
              <InputField label="LinkedIn" icon={Linkedin} value={profile.linkedInUrl} onChange={(v) => setProfile({...profile, linkedInUrl: v})} />
              <InputField label="Primary Office" icon={MapPin} value={profile.location} onChange={(v) => setProfile({...profile, location: v})} />
            </div>
          </FormSection>
        </div>

        <div className="xl:col-span-4 sticky top-28 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Direct Contact</h3>
            <div className="space-y-8">
               <InputField label="Business Email" icon={Mail} value={profile.companyEmail} onChange={(v) => setProfile({...profile, companyEmail: v})} />
               <InputField label="Phone Number" icon={Phone} value={profile.phone} onChange={(v) => setProfile({...profile, phone: v})} />
            </div>
          </div>

          <button 
            type="submit" disabled={saving}
            className="w-full py-4.5 bg-slate-900 hover:bg-blue-600 text-white rounded-[1.5rem] font-bold text-sm transition-all flex justify-center items-center gap-3 shadow-lg active:scale-[0.98]"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>{saving ? "Processing..." : "Commit Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

/* --- SHARED COMPONENTS --- */
const FormSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm transition-all hover:border-slate-300">
    <div className="flex items-center gap-4 mb-10">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm">
        <Icon size={22} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">{title}</h3>
    </div>
    {children}
  </div>
);

const InputField = ({ label, icon: Icon, type = "text", ...props }) => (
  <div className="space-y-2 group">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">{label}</label>
    <div className="relative">
      {Icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors"><Icon size={16} /></div>}
      <input 
        type={type}
        className={`w-full ${Icon ? 'pl-14' : 'px-6'} py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all shadow-sm`}
        {...props}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  </div>
);

export default StartupProfile;