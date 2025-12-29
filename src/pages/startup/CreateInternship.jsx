import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, Briefcase, MapPin, Calendar, 
  Banknote, Plus, X, Loader2, Info, 
  ArrowLeft, CheckCircle, ListChecks, Sparkles,
  Globe, Users, Target, ShieldCheck, Zap,
  ChevronRight, Save, Send
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

  });

  const [skillInput, setSkillInput] = useState("");

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
      alert("Opportunity broadcasted! Awaiting admin verification.");
      navigate("/startup/internships");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Transmission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col font-sans bg-[#F8FAFC]">
      
      {/* --- TOP COMPACT HEADER --- */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            {/* <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-0.5">
               <ShieldCheck size={12} /> Recruitment Module
            </div> */}
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create New Internship Opportunity</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
          >
            Discard
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
            Publish Role
          </button>
        </div>
      </div>

      {/* --- MAIN WORKSTATION GRID --- */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 xl:grid-cols-12">
        
        {/* LEFT: MODULAR FORM AREA (Scrollable) */}
        <div className="xl:col-span-8 overflow-y-auto p-8 custom-scrollbar">
          <form className="max-w-4xl mx-auto space-y-6 pb-10">
            
            <FormModule title="Core Parameters" icon={Info}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Internship Title" placeholder="e.g. Senior UI Engineer" required value={formData.title} onChange={(v) => setFormData({...formData, title: v})} />
                <SelectField 
                  label="Business Domain" 
                  value={formData.domain} 
                  onChange={(v) => setFormData({...formData, domain: v})}
                  options={domains.map(d => ({ value: d.key, label: d.label }))}
                  placeholder="Select Field"
                />
                <SelectField 
                  label="Work Arrangement" 
                  value={formData.internshipType} 
                  onChange={(v) => setFormData({...formData, internshipType: v})}
                  options={[
                    { value: 'ONSITE', label: 'On-site' },
                    { value: 'REMOTE', label: 'Remote' },
                    { value: 'HYBRID', label: 'Hybrid' }
                  ]}
                />
                <InputField label="Location" placeholder="Office address or City" value={formData.location} onChange={(v) => setFormData({...formData, location: v})} />
              </div>
            </FormModule>

            <FormModule title="Logistics & Budget" icon={Calendar}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField label="Duration" placeholder="e.g. 3 Months" value={formData.duration} onChange={(v) => setFormData({...formData, duration: v})} />
                <InputField label="Total Slots" type="number" value={formData.positionsAvailable} onChange={(v) => setFormData({...formData, positionsAvailable: v})} />
                <InputField label="Monthly Stipend (₹)" type="number" value={formData.stipend} onChange={(v) => setFormData({...formData, stipend: v})} />
                <InputField label="Start Date" type="date" value={formData.startingDate} onChange={(v) => setFormData({...formData, startingDate: v})} />
                <InputField label="Application Deadline" type="date" value={formData.applicationDeadline} onChange={(v) => setFormData({...formData, applicationDeadline: v})} />
              </div>
            </FormModule>

            <FormModule title="Requirements" icon={Target}>
              <div className="space-y-6">
                <TextAreaField label="Role Description" placeholder="Key responsibilities..." value={formData.description} onChange={(v) => setFormData({...formData, description: v})} />
                <TextAreaField label="Candidate Eligibility" placeholder="Background, skills, or CGPA..." value={formData.eligibility} onChange={(v) => setFormData({...formData, eligibility: v})} />
              </div>
            </FormModule>

            <FormModule title="Tagging" icon={Zap}>
              <div className="space-y-6">
                <TagInput 
                  label="Technical Skills" 
                  placeholder="Type and press enter..." 
                  value={skillInput} 
                  items={formData.skillsRequired} 
                  onChange={setSkillInput} 
                  onAdd={() => handleAddArrayItem('skillsRequired', skillInput, setSkillInput)} 
                  onRemove={(i) => handleRemoveArrayItem('skillsRequired', i)}
                  color="blue"
                />
                {/* <TagInput 
                  label="Perks & Benefits" 
                  placeholder="e.g. Mentorship..." 
                  value={benefitInput} 
                  items={formData.benefits} 
                  onChange={setBenefitInput} 
                  onAdd={() => handleAddArrayItem('benefits', benefitInput, setBenefitInput)} 
                  onRemove={(i) => handleRemoveArrayItem('benefits', i)}
                  color="slate"
                /> */}
              </div>
            </FormModule>
          </form>
        </div>

        {/* RIGHT: STICKY PREVIEW DRAWER */}
        <div className="xl:col-span-4 bg-white border-l border-slate-200 p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Real-time Draft</h2>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[9px] font-bold uppercase tracking-wider">
               <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" />
               Live
            </div>
          </div>

          <div className="flex-1 space-y-8">
             <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">{formData.title || "Position Title"}</h3>
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100"><Briefcase size={14} className="text-slate-400" /></div>
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{formData.domain || "N/A"}</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100">
                <div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Stipend</p>
                   <p className="text-sm font-bold text-slate-900 uppercase">₹{formData.stipend || 0}/mo</p>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Duration</p>
                   <p className="text-sm font-bold text-slate-900 uppercase">{formData.duration || "N/A"}</p>
                </div>
             </div>

             <div className="space-y-4">
                <PreviewItem icon={MapPin} label="Office" value={formData.location || "Location TBD"} />
                <PreviewItem icon={Users} label="Capacity" value={`${formData.positionsAvailable} Position(s)`} />
                <PreviewItem icon={Globe} label="Workstyle" value={formData.internshipType} />
             </div>

             <div className="space-y-3 pt-4">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                   {formData.skillsRequired.length > 0 ? formData.skillsRequired.slice(0, 5).map((s, i) => (
                     <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 text-[9px] font-bold rounded-md border border-slate-100">{s}</span>
                   )) : <p className="text-[10px] text-slate-300 font-medium">Add skills to visualize...</p>}
                </div>
             </div>
          </div>

          <div className="mt-auto p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-4 shadow-inner">
             <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
             <p className="text-[10px] text-blue-900 font-medium leading-relaxed">
               Submission is final. Role will be visible students once the CIIC Admin completes the verification process.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SHARED MODULAR COMPONENTS --- */

const FormModule = ({ title, icon: Icon, children }) => (
  <div className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-900 border border-slate-100"><Icon size={16} /></div>
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{title}</h3>
    </div>
    {children}
  </div>
);

const InputField = ({ label, type = "text", ...props }) => (
  <div className="space-y-1.5 group">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">{label}</label>
    <input 
      type={type}
      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-slate-300"
      {...props}
      onChange={(e) => props.onChange(e.target.value)}
    />
  </div>
);

const SelectField = ({ label, options, value, onChange, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90 pointer-events-none" />
    </div>
  </div>
);

const TextAreaField = ({ label, ...props }) => (
  <div className="space-y-1.5 group">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">{label}</label>
    <textarea 
      rows="3"
      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-slate-300 shadow-sm"
      {...props}
      onChange={(e) => props.onChange(e.target.value)}
    />
  </div>
);

const TagInput = ({ label, placeholder, value, items, onChange, onAdd, onRemove, color }) => (
  <div className="space-y-3 group">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">{label}</label>
    <div className="flex gap-2">
      <input 
        type="text" 
        className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 outline-none focus:border-blue-600"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAdd())}
      />
      <button type="button" onClick={onAdd} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all active:scale-95"><Plus size={20} /></button>
    </div>
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span key={i} className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold border transition-colors ${color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
          {item} <X size={12} className="cursor-pointer" onClick={() => onRemove(i)} />
        </span>
      ))}
    </div>
  </div>
);

const PreviewItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
        <Icon size={14} />
    </div>
    <div>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">{label}</p>
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight leading-none">{value}</span>
    </div>
  </div>
);

export default CreateInternship;