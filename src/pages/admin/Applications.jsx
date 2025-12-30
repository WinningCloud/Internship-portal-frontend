import React, { useEffect, useState, useMemo } from 'react';
import { Search, Loader2, Building2, User, Inbox } from 'lucide-react';
import api from '../../api/axiosConfig';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [startups, setStartups] = useState([]); // To store startup name mapping
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    const [filters, setFilters] = useState({
        internship: 'All',
        startup: 'All',
        status: 'All'
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            // Fetching both applications and the startup list to resolve IDs to Names
            const [appRes, startupRes] = await Promise.all([
                api.get('/ciic/applications/get-applications'),
                api.get('/ciic/startups/getstartups') // Assuming this endpoint exists based on your structure
            ]);

            setApplications(appRes.data);
            setStartups(startupRes.data);
        } catch (err) {
            console.error("Data synchronization error:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- Helper to get Startup Name from ID ---
    const getStartupName = (id) => {
        const startup = startups.find(s => s._id === id);
        return startup ? startup.name : "Partner Startup";
    };

    // --- Dynamic Filter Options Extraction ---
    const filterOptions = useMemo(() => {
        const internships = [...new Set(applications.map(app => app.internshipId?.title).filter(Boolean))];
        const statuses = [...new Set(applications.map(app => app.status).filter(Boolean))];
        
        // Map the IDs in the application response to names for the filter dropdown
        const uniqueStartupIds = [...new Set(applications.map(app => app.startupId).filter(Boolean))];
        const startupNames = uniqueStartupIds.map(id => getStartupName(id));

        return { internships, startups: startupNames, statuses };
    }, [applications, startups]);

    // --- Filtering Logic ---
    const filteredApps = useMemo(() => {
        return applications.filter(app => {
            const studentName = app.studentId?.fullName || "";
            const roleTitle = app.internshipId?.title || "";
            const currentStartupName = getStartupName(app.startupId);
            
            const matchesSearch = studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 roleTitle.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesInternship = filters.internship === 'All' || app.internshipId?.title === filters.internship;
            const matchesStartup = filters.startup === 'All' || currentStartupName === filters.startup;
            const matchesStatus = filters.status === 'All' || app.status === filters.status;

            return matchesSearch && matchesInternship && matchesStartup && matchesStatus;
        });
    }, [applications, searchQuery, filters, startups]);

    const getStatusColor = (status) => {
        const s = status?.toUpperCase();
        switch (s) {
            case 'APPLIED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'SHORTLISTED': return 'bg-[#FADADD] text-[#F36B7F] border-[#F36B7F]/30';
            case 'SELECTED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'COMPLETED': return 'bg-slate-900 text-white border-slate-900';
            case 'REJECTED': return 'bg-[#E7E2DB] text-gray-700 border-[#E7E2DB]';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#F6F2ED]">
            <Loader2 className="animate-spin text-[#F36B7F]" size={40} />
        </div>
    );

    return (
        <div className="space-y-6 bg-white p-8 font-sans text-gray-900">
            
            {/* --- FILTER COMMAND BAR --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E7E2DB]">
                <div className="flex flex-wrap gap-5 items-end">
                    
                    {/* Search Field */}
                    <div className="flex-1 min-w-[280px] group">
                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest ml-1 leading-none group-focus-within:text-[#F36B7F]">
                            Identity Search
                        </label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#F36B7F] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search candidate or position..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-[#F6F2ED]/50 border border-[#E7E2DB] rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-rose-50 focus:border-[#F36B7F] transition-all"
                            />
                        </div>
                    </div>

                    <FilterSelect 
                        label="Internship" 
                        options={filterOptions.internships} 
                        value={filters.internship} 
                        onChange={(v) => setFilters({...filters, internship: v})} 
                    />
                    <FilterSelect 
                        label="Startup" 
                        options={filterOptions.startups} 
                        value={filters.startup} 
                        onChange={(v) => setFilters({...filters, startup: v})} 
                    />
                    <FilterSelect 
                        label="Status" 
                        options={filterOptions.statuses} 
                        value={filters.status} 
                        onChange={(v) => setFilters({...filters, status: v})} 
                    />
                </div>
            </div>

            {/* --- DATA TABLE --- */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-[#E7E2DB] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-[#E7E2DB]">
                                <th className="px-8 py-5">Candidate Information</th>
                                <th className="px-6 py-5">Internship Module</th>
                                <th className="px-6 py-5">Partner Startup</th>
                                <th className="px-6 py-5 text-center">Submission Date</th>
                                <th className="px-8 py-5 text-right">Gate Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#E7E2DB]">
                            {filteredApps.map((app) => (
                                <tr key={app._id} className="hover:bg-[#FADADD]/10 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center font-black text-[#F36B7F] uppercase shadow-inner group-hover:bg-white">
                                                {app.studentId?.fullName?.charAt(0) || <User size={16}/>}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm tracking-tight uppercase leading-none">{app.studentId?.fullName}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">Reg: {app.studentId?.registerNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-bold text-gray-700 text-sm uppercase tracking-tight">
                                        {app.internshipId?.title}
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2">
                                            <Building2 size={14} className="text-[#F36B7F]" />
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">
                                                {getStartupName(app.startupId)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                        {new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`inline-block px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor(app.status)} shadow-sm`}>
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredApps.length === 0 && (
                    <div className="py-32 flex flex-col items-center justify-center text-center">
                        <Inbox size={48} className="text-slate-200 mb-4" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No matching logs found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const FilterSelect = ({ label, options, value, onChange }) => (
    <div className="w-44 group">
        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest ml-1 leading-none group-focus-within:text-[#F36B7F]">{label}</label>
        <select 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#F6F2ED]/50 border border-[#E7E2DB] rounded-xl text-[11px] font-bold text-gray-600 outline-none focus:border-[#F36B7F] cursor-pointer transition-all uppercase tracking-tight"
        >
            <option value="All">All {label}s</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default Applications;