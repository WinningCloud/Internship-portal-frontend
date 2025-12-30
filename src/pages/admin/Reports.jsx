import React, { useState, useEffect } from 'react';
import { Calendar, Download, FileSpreadsheet, Loader2, ChevronRight } from 'lucide-react';
import api from '../../api/axiosConfig';

const Reports = () => {
    // 1. States for Filters
    const [config, setConfig] = useState({
        fromDate: '',
        toDate: '',
        startup: 'All',
        department: 'All',
        reportType: 'summary'
    });

    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // 2. Load Startups for Dropdown
    useEffect(() => {
        const fetchStartups = async () => {
            try {
                const res = await api.get('/ciic/startups/getstartups');
                setStartups(res.data);
            } catch (err) {
                console.error("Failed to load startup index");
            }
        };
        fetchStartups();
    }, []);

    // 3. Logic to convert JSON to CSV and Trigger Download
    const generateReport = async (format) => {
        setIsDownloading(true);
        try {
            const res = await api.get('/ciic/applications/get-applications');
            let data = res.data;

            // Apply Filters
            if (config.startup !== 'All') {
                data = data.filter(app => app.startupId === config.startup);
            }
            if (config.department !== 'All') {
                data = data.filter(app => app.studentId?.department === config.department);
            }
            if (config.fromDate) {
                data = data.filter(app => new Date(app.createdAt) >= new Date(config.fromDate));
            }
            if (config.toDate) {
                data = data.filter(app => new Date(app.createdAt) <= new Date(config.toDate));
            }

            // Prepare CSV Content
            const headers = ["Application_ID", "Student_Name", "Reg_Number", "Department", "Startup", "Internship_Role", "Status", "Applied_Date"];
            
            const rows = data.map(app => [
                app._id,
                app.studentId?.fullName || "N/A",
                app.studentId?.registerNumber || "N/A",
                app.studentId?.department || "N/A",
                startups.find(s => s._id === app.startupId)?.name || "N/A",
                app.internshipId?.title || "N/A",
                app.status,
                new Date(app.createdAt).toLocaleDateString()
            ]);

            const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
            
            // Trigger Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `CIIC_Report_${new Date().getTime()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            alert("Report generation failed. System synchronization error.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in bg-white p-10 lg:p-20 min-h-screen">
            <div className="bg-white p-10 lg:p-20 rounded-3xl shadow-sm border border-[#F36B7F] max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-2">
                    {/* <div className="w-2 h-2 rounded-full bg-[#F36B7F] animate-pulse" /> */}
                    <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tighter">
                        Generate Reports
                    </h2>
                </div>

                <p className="text-gray-400 text-s font-bold   mb-8 border-b border-[#E7E2DB] pb-6">
                    Configure parameters to export ecosystem data logs
                </p>

                <div className="space-y-8">
                    {/* Date Range Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Archive Start Date</label>
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#F36B7F] transition-colors" />
                                <input
                                    type="date"
                                    value={config.fromDate}
                                    onChange={(e) => setConfig({...config, fromDate: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 bg-[#F6F2ED]/50 border border-[#E7E2DB] rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-[#F36B7F] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Archive End Date</label>
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#F36B7F] transition-colors" />
                                <input
                                    type="date"
                                    value={config.toDate}
                                    onChange={(e) => setConfig({...config, toDate: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 bg-[#F6F2ED]/50 border border-[#E7E2DB] rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-[#F36B7F] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Corporate Partner</label>
                            <select
                                value={config.startup}
                                onChange={(e) => setConfig({...config, startup: e.target.value})}
                                className="w-full px-4 py-3.5 bg-[#F6F2ED]/50 border border-[#E7E2DB] rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-600 outline-none focus:border-[#F36B7F] cursor-pointer appearance-none"
                            >
                                <option value="All">All Registered Startups</option>
                                {startups.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Academic Department</label>
                            <select
                                value={config.department}
                                onChange={(e) => setConfig({...config, department: e.target.value})}
                                className="w-full px-4 py-3.5 bg-[#F6F2ED]/50 border border-[#E7E2DB] rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-600 outline-none focus:border-[#F36B7F] cursor-pointer appearance-none"
                            >
                                <option value="All">All Departments</option>
                                {["CSE", "IT", "ECE", "EEE", "MECHANICAL", "CIVIL", "BCA"].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Report Granularity */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Data Granularity</label>
                        <div className="flex gap-8">
                            {['summary', 'detailed'].map(type => (
                                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="reportType"
                                        checked={config.reportType === type}
                                        onChange={() => setConfig({...config, reportType: type})}
                                        className="w-4 h-4 text-[#F36B7F] accent-[#F36B7F]"
                                    />
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover:text-[#F36B7F] transition-colors">
                                        {type} Report
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                        <button
                            disabled={isDownloading}
                            onClick={() => generateReport('csv')}
                            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-[#F36B7F] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-rose-100 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isDownloading ? <Loader2 className="animate-spin" /> : <Download className="w-4 h-4" />}
                            Execute CSV Export
                        </button>

                        <button
                            disabled={isDownloading}
                            onClick={() => generateReport('excel')}
                            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#F36B7F] transition-all active:scale-95 disabled:opacity-50"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Generate Data Sheet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;