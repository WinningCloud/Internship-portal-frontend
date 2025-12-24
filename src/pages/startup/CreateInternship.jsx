import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, Briefcase, MapPin, Calendar, 
  Banknote, Plus, X, Loader2, Info, 
  ArrowLeft, CheckCircle, ListChecks, Sparkles,
  Globe, Users, Target, ShieldCheck, Zap,
  ChevronRight // 👈 FIXED: Added missing import
} from "lucide-react";
import api from "../../api/axiosConfig.js";
import { useDomains } from "../../context/DomainContext.jsx";

const CreateInternship = () => {
  const navigate = useNavigate();
  const { domains } = useDomains();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    internshipType: "ONSITE",
    location: "",
    duration: "",
    positionsAvailable: 1,
    startingDate: "",
    applicationDeadline: "",
    stipend: 0,
    description: "",
    eligibility: "",
    skillsRequired: [],
    benefits: []
  });

  const [skillInput, setSkillInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  const handleAddArrayItem = (field, value, setter) => {
    if (!value.trim()) return;
    if (formData[field].includes(value.trim())) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setter("");
  };

  const handleRemoveArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/startup/create-internship", formData);
      alert("Post submitted! The CIIC Admin will review and publish it shortly.");
      navigate("/startup/internships");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to broadcast internship");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-20 px-6 font-sans bg-[#F8FAFC]">
      
      {/* --- 1. HEADER SECTION --- */}
      <div className="mb-12 pt-8">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all text-[10px] font-black tracking-[0.2em] uppercase mb-6"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Discard & Return
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                <ShieldCheck size={14} /> Official Recruitment Console
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tighter italic uppercase">
              Publish <span className="text-blue-600">Opportunity</span>
            </h1>
          </div>
          <div className="bg-blue-50 border border-blue-100 px-6 py-3 rounded-2xl hidden md:block">
             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest text-center">Talent Reach</p>
             <p className="text-sm font-bold text-blue-700">6,000+ Verified Students</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* --- 2. MAIN FORM SECTION --- */}
        <form onSubmit={handleSubmit} className="xl:col-span-8 space-y-8">
          
          <FormSection title="Base Parameters" icon={Info} active>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField 
                label="Internship Title" 
                placeholder="e.g. Lead UI/UX Designer" 
                required 
                value={formData.title}
                onChange={(v) => setFormData({...formData, title: v})}
              />
              <div className="space-y-2 group">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">Primary Domain</label>
                <div className="relative">
                  <select 
                    required
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all appearance-none cursor-pointer"
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  >
                    <option value="">Select Domain</option>
                    {domains.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                  </select>
                  <ChevronRight size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 rotate-90 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Work Setup</label>
                <div className="relative">
                  <select 
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all appearance-none cursor-pointer"
                    value={formData.internshipType}
                    onChange={(e) => setFormData({...formData, internshipType: e.target.value})}
                  >
                    <option value="ONSITE">On-site (Office)</option>
                    <option value="REMOTE">Remote (Home)</option>
                    <option value="HYBRID">Hybrid (Mix)</option>
                  </select>
                  <ChevronRight size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 rotate-90 pointer-events-none" />
                </div>
              </div>
              <InputField 
                label="Specific Location" 
                placeholder="e.g. CIIC Campus, Chennai" 
                value={formData.location}
                onChange={(v) => setFormData({...formData, location: v})}
              />
            </div>
          </FormSection>

          <FormSection title="Logistics & Value" icon={Banknote}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label="Internship Duration" placeholder="e.g. 4-6 Months" value={formData.duration} onChange={(v) => setFormData({...formData, duration: v})} />
              <InputField label="Opening Slots" type="number" value={formData.positionsAvailable} onChange={(v) => setFormData({...formData, positionsAvailable: v})} />
              <InputField label="Expected Start" type="date" value={formData.startingDate} onChange={(v) => setFormData({...formData, startingDate: v})} />
              <InputField label="Closing Deadline" type="date" value={formData.applicationDeadline} onChange={(v) => setFormData({...formData, applicationDeadline: v})} />
              <InputField label="Monthly Stipend (₹)" type="number" placeholder="Enter 0 if unpaid" value={formData.stipend} onChange={(v) => setFormData({...formData, stipend: v})} />
            </div>
          </FormSection>

          <FormSection title="Role Narrative" icon={ListChecks}>
            <div className="space-y-8">
              <TextArea label="What will they work on?" placeholder="Detail the key projects and day-to-day tasks..." value={formData.description} onChange={(v) => setFormData({...formData, description: v})} />
              <TextArea label="Who are you looking for?" placeholder="Describe the ideal academic background or mindset..." value={formData.eligibility} onChange={(v) => setFormData({...formData, eligibility: v})} />
            </div>
          </FormSection>

          <FormSection title="Skills & Advantages" icon={Zap}>
            <div className="space-y-8">
              <TagInput 
                label="Technical Requirements"
                placeholder="Type skill and press enter..."
                value={skillInput}
                items={formData.skillsRequired}
                onChange={setSkillInput}
                onAdd={() => handleAddArrayItem('skillsRequired', skillInput, setSkillInput)}
                onRemove={(i) => handleRemoveArrayItem('skillsRequired', i)}
                color="blue"
              />
              <TagInput 
                label="Learning Perks"
                placeholder="e.g. Industry Certificate..."
                value={benefitInput}
                items={formData.benefits}
                onChange={setBenefitInput}
                onAdd={() => handleAddArrayItem('benefits', benefitInput, setBenefitInput)}
                onRemove={(i) => handleRemoveArrayItem('benefits', i)}
                color="indigo"
              />
            </div>
          </FormSection>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 hover:bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex justify-center items-center gap-3 disabled:opacity-70 shadow-xl active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Rocket size={20} />}
            {loading ? "Verifying Draft..." : "Broadcast Internship"}
          </button>

        </form>

        {/* --- 3. DRAFT PREVIEW SIDEBAR --- */}
        <div className="xl:col-span-4 sticky top-28 space-y-6">
          <div className="bg-white rounded-[2.5rem] border-2 border-blue-100 p-8 shadow-[0_20px_50px_rgba(59,130,246,0.08)] overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                <Rocket size={180} className="text-blue-600" />
            </div>
            
            {/* FIXED: Changed <p> to <div> to avoid hydration error */}
            <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                   <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,1)]" />
                   Real-time Preview
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">Draft</div>
            </div>
            
            <div className="space-y-8 relative z-10">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight uppercase italic break-words">{formData.title || "Position Title"}</h3>
                  <div className="mt-3 flex items-center gap-2">
                     <span className="px-2 py-1 bg-blue-600 text-white text-[9px] font-black rounded uppercase tracking-widest">{formData.domain || "Portal"}</span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CIIC Partner</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stipend</p>
                    <p className="text-sm font-black text-blue-600 italic">
                        {formData.stipend > 0 ? `₹${formData.stipend}/mo` : "No Stipend"}
                    </p>
                  </div>
                  <div className="space-y-1 text-right border-l border-slate-100 pl-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Positions</p>
                    <p className="text-sm font-black text-slate-800 italic">{formData.positionsAvailable} Slots</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <PreviewDetail icon={MapPin} label="Location" text={formData.location || "Office / Remote"} />
                  <PreviewDetail icon={Calendar} label="Duration" text={formData.duration || "Commitment TBD"} />
                  <PreviewDetail icon={Briefcase} label="Structure" text={formData.internshipType} />
               </div>

               <div className="pt-2">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Target Skillset</p>
                 <div className="flex flex-wrap gap-2">
                    {formData.skillsRequired.length > 0 ? formData.skillsRequired.slice(0, 4).map((s, i) => (
                      <span key={i} className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl border border-blue-100">{s}</span>
                    )) : <p className="text-[10px] text-slate-300 font-medium italic tracking-wide">Enter skills to visualize...</p>}
                 </div>
               </div>
            </div>
          </div>
          
          <div className="p-6 rounded-[2rem] bg-indigo-900 text-white shadow-xl relative overflow-hidden group">
             <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
             <div className="flex gap-4 relative z-10">
                <Info className="text-indigo-300 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-1">Deployment Notice</p>
                  <p className="text-[11px] font-medium leading-relaxed opacity-80">
                    This post will be sent to the **CIIC Verification Team**. Once approved, it will be visible to all students instantly.
                  </p>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* --- REUSABLE UI SUB-COMPONENTS --- */

const FormSection = ({ title, icon: Icon, children, active }) => (
  <div className={`bg-white border p-8 md:p-12 rounded-[2.5rem] transition-all duration-500 shadow-sm ${active ? 'border-blue-200' : 'border-slate-200'}`}>
    <div className="flex items-center gap-4 mb-10">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${active ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
        <Icon size={22} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">{title}</h3>
    </div>
    {children}
  </div>
);

const InputField = ({ label, type = "text", ...props }) => (
  <div className="space-y-2 group">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">{label}</label>
    <input 
      type={type}
      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
      {...props}
      onChange={(e) => props.onChange(e.target.value)}
    />
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div className="space-y-2 group">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">{label}</label>
    <textarea 
      rows="4"
      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
      {...props}
      onChange={(e) => props.onChange(e.target.value)}
    />
  </div>
);

const TagInput = ({ label, placeholder, value, items, onChange, onAdd, onRemove, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100"
  };

  return (
    <div className="space-y-4 group">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">{label}</label>
      <div className="flex gap-2">
        <input 
          type="text" 
          className="flex-1 px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-blue-600"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAdd())}
        />
        <button type="button" onClick={onAdd} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-md">
          <Plus size={20} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {items.map((item, i) => (
          <span key={i} className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${colors[color]}`}>
            {item} <X size={14} className="cursor-pointer hover:scale-125 transition-transform" onClick={() => onRemove(i)} />
          </span>
        ))}
      </div>
    </div>
  );
};

const PreviewDetail = ({ icon: Icon, label, text }) => (
  <div className="flex items-center gap-4">
    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
        <Icon size={16} />
    </div>
    <div>
        <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">{label}</p>
        <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{text}</span>
    </div>
  </div>
);

export default CreateInternship;