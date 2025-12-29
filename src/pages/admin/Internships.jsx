import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Eye, Trash2, Clock, CheckCircle, XCircle, 
    Loader2, MapPin, Calendar, Banknote, X, Building2, 
    ShieldCheck, Info, Globe, Users, Briefcase, Target, 
    Layers, Zap, FileText
} from 'lucide-react';
import api from '../../api/axiosConfig';

const ManageInternships = () => {
    const [internships, setInternships] = useState([]);
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDomain, setFilterDomain] = useState("ALL");
    const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, OPEN, CLOSED
    const [selectedInternship, setSelectedInternship] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [intRes, domRes] = await Promise.all([
                    api.get('/ciic/getinternships'),
                    api.get('/meta/internship-domains')
                ]);
                setInternships(intRes.data);
                setDomains(domRes.data);
            } catch (err) {
                console.error("Dashboard Sync Error");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // --- RE-IMPLEMENTED FILTERING LOGIC ---
    const filteredInternships = useMemo(() => {
        return internships.filter(item => {
            const nameMatch = (item.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
                              (item.startupId?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase());
            
            const domainMatch = filterDomain === "ALL" || item.domain === filterDomain;
            
            // Status Logic: Deriving from isActive boolean
            let statusMatch = true;
            if (filterStatus === "OPEN") statusMatch = item.isActive === true;
            if (filterStatus === "CLOSED") statusMatch = item.isActive === false;
            
            return nameMatch && domainMatch && statusMatch;
        });
    }, [internships, searchQuery, filterDomain, filterStatus]);

    const handleDelete = async (id) => {
        if (!window.confirm("Permanent Action: Deleting this internship will remove it from all student feeds. Proceed?")) return;
        try {
            await api.delete(`/ciic/startups/deletestartup/${id}`); // Adjust endpoint as per your router
            setInternships(prev => prev.filter(i => i._id !== id));
        } catch (err) {
            alert("Administrative Deletion Failed.");
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#F6F2ED]">
            <Loader2 className="animate-spin text-[#F36B7F]" size={40} />
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in bg-[#F6F2ED] p-8 min-h-screen font-sans text-gray-900">
            
            {/* --- FILTER BAR --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E7E2DB] flex flex-col lg:flex-row gap-6 justify-between items-center">
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    {/* Domain Filter */}
                    <div className="relative group">
                        <select 
                            value={filterDomain}
                            onChange={(e) => setFilterDomain(e.target.value)}
                            className="appearance-none pl-10 pr-10 py-2.5 bg-[#F6F2ED] border border-[#E7E2DB] rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 focus:outline-none focus:border-[#F36B7F] transition-all cursor-pointer"
                        >
                            <option value="ALL">All Domains</option>
                            {domains.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#F36B7F]" />
                    </div>

                    {/* Status Filter Logic */}
                    <div className="relative group">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="appearance-none pl-10 pr-10 py-2.5 bg-[#F6F2ED] border border-[#E7E2DB] rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 focus:outline-none focus:border-[#F36B7F] transition-all cursor-pointer"
                        >
                            <option value="ALL">All Visibility</option>
                            <option value="OPEN">Open / Active</option>
                            <option value="CLOSED">Closed / Inactive</option>
                        </select>
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#F36B7F]" />
                    </div>
                </div>

                {/* Search */}
                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F36B7F]" />
                    <input
                        type="text"
                        placeholder="Search title or startup partner..."
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#E7E2DB] rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-rose-50 focus:border-[#F36B7F] transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* --- GRID VIEW --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {filteredInternships.map((item, index) => (
                        <motion.div
                            layout
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white border border-[#E7E2DB] p-6 rounded-[2.5rem] flex flex-col justify-between h-[450px] shadow-sm hover:shadow-xl transition-all group overflow-hidden"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                                        <Globe size={12} className="text-blue-500" />
                                        <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">
                                            {domains.find(d => d.key === item.domain)?.label || item.domain}
                                        </span>
                                    </div>
                                    <StatusChip active={item.isActive} />
                                </div>

                                <div className="space-y-4 mb-6">
                                    <h3 className="text-lg font-black text-gray-900 leading-tight uppercase tracking-tight group-hover:text-[#F36B7F] transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-[#F6F2ED] flex items-center justify-center text-[#F36B7F] border border-[#E7E2DB] font-bold text-xs uppercase shadow-inner">
                                            {item.startupId?.name?.charAt(0) || 'S'}
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                                            {item.startupId?.name || "Startup Partner"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-[#F6F2ED]">
                                    <CardDetail icon={MapPin} label="Location" value={item.location} />
                                    <CardDetail icon={Clock} label="Duration" value={item.duration} />
                                    <CardDetail icon={Banknote} label="Stipend" value={item.stipend > 0 ? `₹${item.stipend}` : "Unpaid"} />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-6">
                                <button
                                    onClick={() => setSelectedInternship(item)}
                                    className="flex-1 bg-[#F6F2ED] text-gray-700 border border-[#E7E2DB] py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#F36B7F] hover:text-white hover:border-[#F36B7F] transition-all flex items-center justify-center gap-2"
                                >
                                    <Eye size={14} /> Full Record
                                </button>
                                <button 
                                    onClick={() => handleDelete(item._id)}
                                    className="p-3 bg-white border border-[#E7E2DB] text-gray-300 hover:text-red-500 hover:border-red-100 rounded-2xl transition-all shadow-sm active:scale-90"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* --- DOSSIER MODAL --- */}
            <AnimatePresence>
                {selectedInternship && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedInternship(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                            className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-[#E7E2DB]"
                        >
                            {/* Modal Header */}
                            <div className="p-10 border-b border-[#E7E2DB] flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-white border border-[#E7E2DB] rounded-3xl flex items-center justify-center text-[#F36B7F] font-bold text-3xl shadow-sm uppercase shrink-0">
                                        {selectedInternship.title.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-2">{selectedInternship.title}</h2>
                                        <div className="flex items-center gap-3">
                                            <span className="bg-[#F36B7F] text-white text-[9px] font-black px-2.5 py-1 rounded border border-[#F36B7F] uppercase tracking-widest">Portal Record</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none border-l border-slate-200 pl-3">Ref ID: {selectedInternship._id.slice(-8)}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedInternship(null)} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#F36B7F] transition-all active:scale-90 shadow-sm"><X size={24} /></button>
                            </div>

                            {/* Modal Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <DetailBox icon={Building2} label="Startup Partner" value={selectedInternship.startupId?.name} />
                                    <DetailBox icon={Globe} label="Portal Domain" value={domains.find(d => d.key === selectedInternship.domain)?.label} />
                                    <DetailBox icon={Briefcase} label="Internship Type" value={selectedInternship.internshipType} />
                                    <DetailBox icon={Banknote} label="Fixed Remuneration" value={selectedInternship.stipend > 0 ? `₹${selectedInternship.stipend}` : 'Non-Paid'} />
                                    <DetailBox icon={Clock} label="Operational Phase" value={selectedInternship.duration} />
                                    <DetailBox icon={Calendar} label="Deadline Protocol" value={new Date(selectedInternship.applicationDeadline).toLocaleDateString()} />
                                    <DetailBox icon={Users} label="Total Capacity" value={`${selectedInternship.positionsAvailable} Slots`} />
                                    <DetailBox icon={CheckCircle} label="Active Status" value={selectedInternship.isActive ? "Online" : "Offline"} />
                                </div>

                                <div className="space-y-6">
                                    <ModuleHeading icon={Info} title="Role Narrative" color="rose" />
                                    <p className="text-sm text-gray-600 font-bold leading-relaxed bg-[#F6F2ED]/50 p-10 rounded-[2.5rem] border border-[#E7E2DB] shadow-inner text-justify">
                                        {selectedInternship.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <ModuleHeading icon={Zap} title="Technical Stack" color="blue" />
                                        <div className="flex flex-wrap gap-2">
                                            {selectedInternship.skillsRequired?.map((skill, i) => (
                                                <span key={i} className="px-4 py-2 bg-white border border-[#E7E2DB] rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <ModuleHeading icon={Target} title="Eligibility Basis" color="emerald" />
                                        <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wider">{selectedInternship.eligibility || "Standard engineering background preferred."}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-[#E7E2DB] bg-slate-50/50 flex justify-center">
                                <button onClick={() => setSelectedInternship(null)} className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl active:scale-95">Close Dossier</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* --- SHARED COMPONENTS --- */

const StatusChip = ({ active }) => (
    <div className={`px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 
        ${active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
        <div className={`w-1 h-1 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
        {active ? 'Open' : 'Closed'}
    </div>
);

const CardDetail = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3">
        <div className="p-2 bg-[#F6F2ED] rounded-lg border border-[#E7E2DB]"><Icon size={14} className="text-gray-400" /></div>
        <div className="min-w-0">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-[11px] font-black text-gray-700 uppercase truncate leading-none">{value || "General"}</p>
        </div>
    </div>
);

const DetailBox = ({ icon: Icon, label, value }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-300 ml-1 leading-none">
            <Icon size={14} />
            <p className="text-[9px] font-black uppercase tracking-widest leading-none">{label}</p>
        </div>
        <div className="bg-[#F6F2ED]/40 border border-[#E7E2DB] p-5 rounded-2xl shadow-inner leading-none text-center">
            <span className="text-xs font-black text-slate-700 uppercase tracking-tight truncate block leading-none">{value || 'Pending'}</span>
        </div>
    </div>
);

const ModuleHeading = ({ icon: Icon, title, color }) => {
    const colors = { rose: "border-[#F36B7F]", blue: "border-blue-500", emerald: "border-emerald-500" };
    return (
        <div className={`flex items-center gap-3 border-l-4 ${colors[color]} pl-4 py-1`}>
            <Icon size={18} className="text-slate-300" />
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">{title}</h3>
        </div>
    );
};

export default ManageInternships;