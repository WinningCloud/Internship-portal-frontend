import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Rocket, Briefcase, MapPin, Calendar, 
  Banknote, Plus, X, Loader2, Info, 
  ArrowLeft, CheckCircle, ListChecks, Sparkles
} from "lucide-react";
import api from "../../api/axiosConfig.js";
import { useDomains } from "../../context/DomainContext.jsx";

const CreateInternship = () => {
  const navigate = useNavigate();
  const { domains } = useDomains(); // Dynamic domains from context

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

  // Helpers for adding/removing array items (Skills & Benefits)
  const [skillInput, setSkillInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  const handleAddArrayItem = (field, value, setter) => {
    if (!value.trim()) return;
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
      alert("Internship created successfully! Pending admin approval.");
      navigate("/startup/internships");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create internship");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-4 md:px-8">
      {/* --- HEADER --- */}
      <div className="mb-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-all mb-4"
        >
          <ArrowLeft size={14} /> Cancel & Exit
        </button>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase flex items-center gap-3">
          Create Opportunity <Sparkles className="text-blue-600" size={32} />
        </h1>
        <p className="text-slate-500 font-medium">Design a role that attracts the best talent from Crescent.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        
        {/* --- FORM SECTION --- */}
        <form onSubmit={handleSubmit} className="xl:col-span-8 space-y-8">
          
          {/* Section 1: Core Details */}
          <FormCard title="General Information" icon={Info}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Internship Title" 
                placeholder="e.g. Full Stack Developer Intern" 
                required 
                value={formData.title}
                onChange={(v) => setFormData({...formData, title: v})}
              />
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Domain</label>
                <select 
                  required
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer"
                  value={formData.domain}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                >
                  <option value="">Select Domain</option>
                  {domains.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internship Type</label>
                <select 
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer"
                  value={formData.internshipType}
                  onChange={(e) => setFormData({...formData, internshipType: e.target.value})}
                >
                  <option value="ONSITE">On-site</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
              <InputField 
                label="Office Location" 
                placeholder="e.g. Chennai, India" 
                value={formData.location}
                onChange={(v) => setFormData({...formData, location: v})}
              />
            </div>
          </FormCard>

          {/* Section 2: Logistics */}
          <FormCard title="Timeline & Logistics" icon={Calendar}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Duration" 
                placeholder="e.g. 6 Months" 
                value={formData.duration}
                onChange={(v) => setFormData({...formData, duration: v})}
              />
              <InputField 
                label="Positions Available" 
                type="number"
                value={formData.positionsAvailable}
                onChange={(v) => setFormData({...formData, positionsAvailable: v})}
              />
              <InputField 
                label="Start Date" 
                type="date"
                value={formData.startingDate}
                onChange={(v) => setFormData({...formData, startingDate: v})}
              />
              <InputField 
                label="Application Deadline" 
                type="date"
                value={formData.applicationDeadline}
                onChange={(v) => setFormData({...formData, applicationDeadline: v})}
              />
              <InputField 
                label="Monthly Stipend (₹)" 
                type="number"
                placeholder="0 for Unpaid"
                value={formData.stipend}
                onChange={(v) => setFormData({...formData, stipend: v})}
              />
            </div>
          </FormCard>

          {/* Section 3: Detailed Description */}
          <FormCard title="Role Content" icon={ListChecks}>
            <div className="space-y-6">
              <TextArea 
                label="Job Description" 
                placeholder="Describe daily tasks and goals..."
                value={formData.description}
                onChange={(v) => setFormData({...formData, description: v})}
              />
              <TextArea 
                label="Eligibility Criteria" 
                placeholder="Minimum CGPA, specific year of study, etc."
                value={formData.eligibility}
                onChange={(v) => setFormData({...formData, eligibility: v})}
              />
            </div>
          </FormCard>

          {/* Section 4: Skills & Perks */}
          <FormCard title="Skills & Benefits" icon={CheckCircle}>
            <div className="space-y-6">
              {/* Skills Tag Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Required Skills</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none"
                    placeholder="e.g. React.js (Press Enter)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddArrayItem('skillsRequired', skillInput, setSkillInput))}
                  />
                  <button type="button" onClick={() => handleAddArrayItem('skillsRequired', skillInput, setSkillInput)} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all"><Plus /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skillsRequired.map((s, i) => (
                    <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-xs font-bold">
                      {s} <X size={14} className="cursor-pointer" onClick={() => handleRemoveArrayItem('skillsRequired', i)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits Tag Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Perks & Benefits</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none"
                    placeholder="e.g. Certificate, Flex Hours"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddArrayItem('benefits', benefitInput, setBenefitInput))}
                  />
                  <button type="button" onClick={() => handleAddArrayItem('benefits', benefitInput, setBenefitInput)} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all"><Plus /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map((b, i) => (
                    <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-bold">
                      {b} <X size={14} className="cursor-pointer" onClick={() => handleRemoveArrayItem('benefits', i)} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FormCard>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-blue-200 transition-all flex justify-center items-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Rocket size={20} />}
            {loading ? "Broadcasting..." : "Publish Internship"}
          </button>

        </form>

        {/* --- PREVIEW SIDEBAR --- */}
        <div className="xl:col-span-4 sticky top-24">
          <div className="bg-[#020617] rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 p-10 opacity-10">
                <Rocket size={120} className="rotate-12" />
            </div>
            
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-10">Live Draft Preview</h3>
            
            <div className="space-y-6 relative z-10">
               <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Position</p>
                  <p className="text-2xl font-black italic uppercase leading-none">{formData.title || "Untitled Role"}</p>
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Domain</p>
                    <p className="text-sm font-bold text-slate-200">{formData.domain || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Stipend</p>
                    <p className="text-sm font-black text-emerald-400 italic">₹{formData.stipend}/mo</p>
                  </div>
               </div>

               <div className="pt-6 border-t border-white/10 space-y-4">
                  <PreviewItem icon={MapPin} text={formData.location || "Remote / On-site"} />
                  <PreviewItem icon={Calendar} text={formData.duration || "Duration TBD"} />
                  <PreviewItem icon={Briefcase} text={formData.internshipType} />
               </div>

               <div className="bg-white/5 p-5 rounded-2xl border border-white/5 mt-4">
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">Target Skills</p>
                 <div className="flex flex-wrap gap-2">
                    {formData.skillsRequired.length > 0 ? formData.skillsRequired.slice(0, 3).map((s, i) => (
                      <span key={i} className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded-md">{s}</span>
                    )) : <span className="text-[10px] text-slate-600 italic">No skills added</span>}
                 </div>
               </div>
            </div>
          </div>
          
          <div className="mt-6 p-6 rounded-[2rem] bg-amber-50 border border-amber-100 flex items-start gap-4">
             <Info className="text-amber-600 shrink-0" size={20} />
             <p className="text-xs text-amber-800 font-medium leading-relaxed">
               Your internship will be reviewed by **CIIC Admin** before going live. Ensure the description is clear to avoid rejection.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

/* --- REUSABLE COMPONENTS --- */

const FormCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase italic">{title}</h3>
    </div>
    {children}
  </div>
);

const InputField = ({ label, type = "text", ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type={type}
      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
      {...props}
      onChange={(e) => props.onChange(e.target.value)}
    />
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <textarea 
      rows="4"
      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
      {...props}
      onChange={(e) => props.onChange(e.target.value)}
    />
  </div>
);

const PreviewItem = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3">
    <Icon size={16} className="text-blue-500" />
    <span className="text-xs font-bold text-slate-400">{text}</span>
  </div>
);

export default CreateInternship;