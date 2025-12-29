import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    Eye,
    Trash2,
    Loader2,
    X,
    Building2,
    Mail,
    Phone,
    Globe,
    MapPin,
    Calendar,
    Linkedin,
    ShieldCheck,
    User,
    ExternalLink,
    Info,
    AlertCircle,
    UserX,
    ClipboardSignature
} from 'lucide-react';
import api from '../../api/axiosConfig';

const ManageStartups = () => {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createFormData, setCreateFormData] = useState({ 
        name: '', email: '', password: '', confirmPassword: '', role: 'STARTUP' 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // View Modal State
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    useEffect(() => {
        fetchStartups();
    }, []);

    const fetchStartups = async () => {
        try {
            const res = await api.get('/ciic/startups/getstartups');
            setStartups(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Fetch failure");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStartup = async (e) => {
        e.preventDefault();
        if (createFormData.password !== createFormData.confirmPassword) {
            return alert("Passwords do not match.");
        }
        setIsSubmitting(true);
        try {
            const { confirmPassword, ...submitData } = createFormData;
            await api.post('/ciic/startups/addstartup', submitData);
            setShowCreateModal(false);
            setCreateFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'STARTUP' });
            fetchStartups();
        } catch (err) {
            alert(err.response?.data?.message || "Creation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewStartup = async (startupId) => {
        setViewLoading(true);
        setShowViewModal(true);
        setViewData(null); // Reset state to ensure clean view
        try {
            const res = await api.get(`/startup/profile/get-profile/${startupId}`);
            // Check if data exists (handling both nested profile key or direct object)
            const profile = res.data.profile || res.data;
            
            // If API returns success but empty values, treat as null
            if (!profile || !profile.companyName) {
                setViewData(null);
            } else {
                setViewData(profile);
            }
        } catch (err) {
            // This catches the 404 when profile is not present in DB
            setViewData(null);
        } finally {
            setViewLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Permanently delete ${name}? Access will be revoked.`)) return;
        try {
            await api.delete(`/ciic/startups/deletestartup/${id}`);
            setStartups(prev => prev.filter(s => s._id !== id));
        } catch (err) {
            alert("Delete error");
        }
    };

    const filteredStartups = useMemo(() => {
        return startups.filter(s => 
            s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [startups, searchQuery]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#F6F2ED]">
            <Loader2 className="w-10 h-10 animate-spin text-[#F36B7F]" />
        </div>
    );

    return (
        <div className="space-y-6 bg-[#F6F2ED] p-8 min-h-screen font-sans">
            
            {/* --- HEADER ACTIONS --- */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#F36B7F]" />
                    <input
                        type="text"
                        placeholder="Search startups..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-[#E7E2DB] rounded-xl focus:ring-4 focus:ring-rose-50 focus:border-[#F36B7F] transition-all outline-none font-bold text-xs"
                    />
                </div>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-8 py-3 bg-[#F36B7F] text-white rounded-xl hover:shadow-xl hover:shadow-rose-200 transition-all font-black text-[10px] uppercase tracking-widest active:scale-95"
                >
                    <Plus size={16} /> Enroll Partner
                </button>
            </div>

            {/* --- DATA TABLE --- */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-[#E7E2DB] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#E7E2DB]">
                                <th className="px-10 py-6">Partner Entity</th>
                                <th className="px-6 py-6">Auth Email</th>
                                <th className="px-6 py-6 text-center">Status</th>
                                <th className="px-6 py-6 text-center">Postings</th>
                                <th className="px-10 py-6 text-right">Console</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#E7E2DB]">
                            {filteredStartups.map((startup) => (
                                <tr key={startup._id} className="hover:bg-[#FADADD]/10 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm shrink-0 group-hover:border-[#F36B7F]">
                                                {startup.logoUrl ? (
                                                    <img src={startup.logoUrl} className="w-full h-full object-contain p-1" alt="logo" />
                                                ) : (
                                                    <span className="font-black text-[#F36B7F] text-lg uppercase">{startup.name?.charAt(0)}</span>
                                                )}
                                            </div>
                                            <p className="font-black text-gray-900 text-[13px] uppercase tracking-tight leading-none">{startup.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-xs font-bold text-gray-500">
                                        {startup.email}
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${startup.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                            {startup.isActive ? 'Active' : 'Offline'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-center text-sm font-black text-gray-800">
                                        {startup.internshipsCount || '0'} 
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button 
                                                onClick={() => handleViewStartup(startup._id)}
                                                className="p-3 rounded-xl bg-white border border-[#E7E2DB] text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(startup._id, startup.name)}
                                                className="p-3 rounded-xl bg-white border border-[#E7E2DB] text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL: CREATE --- */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative p-10 border border-[#E7E2DB]"
                        >
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-10 text-center">New startup credentials</h3>
                            <form onSubmit={handleCreateStartup} className="space-y-4">
                                <FormInput label="Company Name" placeholder="Crescent Tech" required value={createFormData.name} onChange={(v) => setCreateFormData({...createFormData, name: v})} />
                                <FormInput label="Email" type="email" placeholder="ceo@startup.com" required value={createFormData.email} onChange={(v) => setCreateFormData({...createFormData, email: v})} />
                                <FormInput label="Password" type="password" placeholder="••••••••" required value={createFormData.password} onChange={(v) => setCreateFormData({...createFormData, password: v})} />
                                <FormInput label="Confirm Password" type="password" placeholder="••••••••" required value={createFormData.confirmPassword} onChange={(v) => setCreateFormData({...createFormData, confirmPassword: v})} />
                                <div className="flex gap-4 mt-10">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400">Abort</button>
                                    <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-[#F36B7F] text-white rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-rose-200">
                                        {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Authorize'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- MODAL: VIEW (FIXED LOGIC) --- */}
            <AnimatePresence>
                {showViewModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowViewModal(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col h-[85vh] border border-[#E7E2DB]">
                            
                            {viewLoading ? (
                                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="animate-spin text-[#F36B7F]" size={40} />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Syncing Records...</p>
                                </div>
                            ) : !viewData ? (
                                /* --- 💡 NEW LOGIC: DATA NOT FOUND STATE --- */
                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white">
                                    <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-rose-300 mb-8 border border-rose-100 shadow-inner">
                                        <UserX size={48} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Profile Incomplete</h3>
                                    <p className="text-sm text-slate-400 mt-3 font-bold max-w-sm mx-auto leading-relaxed">
                                        This startup partner has successfully enrolled but has not yet finalized their profile details on the portal.
                                    </p>
                                    <div className="mt-10 flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                            <ClipboardSignature size={16} className="text-slate-300" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Verification</span>
                                        </div>
                                        <button onClick={() => setShowViewModal(false)} className="mt-4 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#F36B7F] transition-all">Dismiss</button>
                                    </div>
                                </div>
                            ) : (
                                /* --- ACTUAL PROFILE DATA --- */
                                <>
                                    <div className="px-12 py-12 bg-slate-50 border-b border-[#E7E2DB] flex items-center justify-between shrink-0">
                                        <div className="flex items-center gap-8">
                                            <div className="w-24 h-24 bg-white border border-[#E7E2DB] rounded-3xl flex items-center justify-center p-5 shadow-sm overflow-hidden">
                                                {viewData.logoUrl ? <img src={viewData.logoUrl} className="w-full h-full object-contain" /> : <Building2 className="text-slate-100" size={48} />}
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-3 italic-none">{viewData.companyName}</h2>
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-[#F36B7F] text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.15em] shadow-lg shadow-rose-100">Verified Partner</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none border-l border-slate-200 pl-3">Phase: {viewData.yearFounded || 'Active'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => setShowViewModal(false)} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-300 hover:text-rose-600 transition-all shadow-sm"><X size={24} /></button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-white">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <DetailBox icon={User} label="Founder" value={viewData.founderName} />
                                            <DetailBox icon={Mail} label="Email" value={viewData.companyEmail} />
                                            <DetailBox icon={Phone} label="Contact no." value={viewData.phone} />
                                            <DetailBox icon={MapPin} label="Base Location" value={viewData.location} />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 border-l-4 border-[#F36B7F] pl-4 py-1">
                                                <Info size={16} className="text-slate-300" />
                                                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Partner Overview</h3>
                                            </div>
                                            <p className="text-sm text-slate-600 font-bold leading-relaxed bg-[#F6F2ED]/50 p-10 rounded-[2.5rem] border border-[#E7E2DB] shadow-inner text-justify">{viewData.description}</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                                            <SocialLink icon={Globe} label="Website" url={viewData.website} />
                                            <SocialLink icon={Linkedin} label="LinkedIn" url={viewData.linkedInUrl} />
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

/* --- MINI COMPONENTS --- */

const FormInput = ({ label, onChange, ...props }) => (
    <div className="space-y-2 group">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 leading-none transition-colors group-focus-within:text-[#F36B7F]">{label}</label>
        <input {...props} onChange={(e)=>onChange(e.target.value)}
            className="w-full px-5 py-4 bg-slate-50 border border-[#E7E2DB] rounded-2xl text-xs font-bold text-gray-800 outline-none focus:border-[#F36B7F] focus:ring-4 focus:ring-rose-50 transition-all placeholder:text-slate-200" />
    </div>
);

const DetailBox = ({ icon: Icon, label, value }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-300 ml-1">
            <Icon size={14} />
            <p className="text-[9px] font-black uppercase tracking-widest leading-none">{label}</p>
        </div>
        <div className="bg-[#F6F2ED]/40 border border-[#E7E2DB] p-5 rounded-2xl shadow-inner">
            <span className="text-xs font-black text-slate-700 uppercase tracking-tight truncate block leading-none">{value || 'Pending Setup'}</span>
        </div>
    </div>
);

const SocialLink = ({ icon: Icon, label, url }) => (
    <a href={url} target="_blank" rel="noreferrer" className={`flex items-center justify-between p-6 bg-white border border-[#E7E2DB] rounded-3xl group hover:border-[#F36B7F] transition-all shadow-sm ${!url && 'opacity-20 cursor-not-allowed pointer-events-none'}`}>
        <div className="flex items-center gap-4">
            <Icon size={20} className="text-slate-400 group-hover:text-[#F36B7F] transition-colors" />
            <span className="text-[11px] font-black uppercase text-slate-900 tracking-widest">{label}</span>
        </div>
        <ExternalLink size={16} className="text-slate-200 group-hover:text-[#F36B7F]" />
    </a>
);

export default ManageStartups;