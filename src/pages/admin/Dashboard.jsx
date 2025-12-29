import React, { useEffect, useState, useMemo } from 'react';
import {
    Building2,
    Briefcase,
    Users,
    Clock,
    ArrowUpRight,
    Eye,
    Loader2,
    ChevronDown 
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import api from '../../api/axiosConfig';

const Dashboard = () => {
    // Data States
    const [internships, setInternships] = useState([]);
    const [startups, setStartups] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Trend Filtering State
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [intRes, startupRes, studentRes] = await Promise.all([
                    api.get('/ciic/getinternships'),
                    api.get('/ciic/startups/getstartups'),
                    api.get('/ciic/students/students')
                ]);

                setInternships(intRes.data);
                setStartups(startupRes.data);
                setStudents(studentRes.data);
            } catch (err) {
                console.error("Dashboard Data Sync Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    // Logic for KPI Cards with "vs Last Month" comparison
    const kpiData = useMemo(() => {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const calculateChange = (current, totalItems, dateField = 'createdAt') => {
            const previousCount = totalItems.filter(item => new Date(item[dateField]) < startOfThisMonth).length;
            if (previousCount === 0) return current > 0 ? "+100%" : "0%";
            const diff = ((current - previousCount) / previousCount) * 100;
            return (diff >= 0 ? "+" : "") + diff.toFixed(0) + "%";
        };

        const totalStartups = startups.length;
        const startupChange = calculateChange(totalStartups, startups);

        const currentActive = internships.filter(i => i.isActive).length;
        const activeChange = calculateChange(currentActive, internships.filter(i => i.isActive));

        const totalApps = internships.reduce((acc, curr) => acc + (curr.applicationsCount || 0), 0);
        const prevApps = internships
            .filter(i => new Date(i.createdAt) < startOfThisMonth)
            .reduce((acc, curr) => acc + (curr.applicationsCount || 0), 0);
        
        let appsChange = "0%";
        if (prevApps !== 0) {
            const diff = ((totalApps - prevApps) / prevApps) * 100;
            appsChange = (diff >= 0 ? "+" : "") + diff.toFixed(0) + "%";
        } else if (totalApps > 0) appsChange = "+100%";

        const totalStudents = students.length;
        const studentChange = calculateChange(totalStudents, students);

        return [
            { title: 'Total Startups', value: totalStartups.toLocaleString(), change: startupChange, icon: Building2 },
            { title: 'Active Internships', value: currentActive.toString(), change: activeChange, icon: Briefcase },
            { title: 'Total Applications', value: totalApps.toLocaleString(), change: appsChange, icon: Users },
            { title: 'Total Students', value: totalStudents.toLocaleString(), change: studentChange, icon: Users },
        ];
    }, [internships, startups, students]);

    // 💡 RECENT INTERNSHIPS LOGIC (Sorted by latest)
    const recentInternships = useMemo(() => {
        return [...internships]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10); 
    }, [internships]);

    const applicationTrends = useMemo(() => {
        const filtered = internships.filter(item => new Date(item.createdAt).getMonth() === selectedMonth);
        return [
            { name: 'Week 1', apps: Math.floor(filtered.length * 0.2) },
            { name: 'Week 2', apps: Math.floor(filtered.length * 0.5) },
            { name: 'Week 3', apps: Math.floor(filtered.length * 0.8) },
            { name: 'Week 4', apps: filtered.length },
        ];
    }, [internships, selectedMonth]);

    const chartData = useMemo(() => {
        const open = internships.filter(i => i.isActive === true).length;
        const closed = internships.filter(i => i.isActive === false).length;
        return [
            { name: 'Open', value: open },
            { name: 'Closed', value: closed },
        ];
    }, [internships]);

    const COLORS = ['#F36B7F', '#E7E2DB'];

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-[#F6F2ED]">
            <Loader2 className="animate-spin text-[#F36B7F]" size={40} />
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in bg-[#F6F2ED] p-8 min-h-screen font-sans">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E7E2DB] hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{item.title}</p>
                                <h3 className="text-3xl font-bold text-gray-800 mt-2">{item.value}</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-[rgba(243,107,127,0.15)]">
                                <div className="p-2 rounded-lg bg-[#F36B7F]">
                                    <item.icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className={`flex items-center font-medium ${!item.change.startsWith('-') ? 'text-[#F36B7F]' : 'text-red-500'}`}>
                                <ArrowUpRight className={`w-4 h-4 mr-1 ${item.change.startsWith('-') ? 'rotate-90' : ''}`} />
                                {item.change}
                            </span>
                            <span className="text-gray-400 ml-2">vs last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-[#E7E2DB]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Application Trends</h3>
                        <div className="relative">
                            <select 
                                value={selectedMonth} 
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                className="appearance-none bg-gray-50 border border-[#E7E2DB] text-gray-600 text-xs font-bold py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F36B7F]/20 cursor-pointer"
                            >
                                {months.map((m, idx) => (
                                    <option key={m} value={idx}>{m}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={applicationTrends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E2DB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                <Line type="monotone" dataKey="apps" stroke="#F36B7F" strokeWidth={3} dot={{ r: 4, fill: '#F36B7F', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E7E2DB]">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Internship Status</h3>
                    <div className="h-72 w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} cx="50%" cy="50%" innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                                    {chartData.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-gray-800">{internships.length}</span>
                            <span className="text-sm text-gray-500">Total</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#F36B7F]" />
                            <span className="text-sm text-gray-600">Open</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#E7E2DB]" />
                            <span className="text-sm text-gray-600">Closed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RECENT ACTIVITY FEED (MODIFIED) --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E7E2DB] overflow-hidden">
                <div className="p-6 border-b border-[#E7E2DB] flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800 tracking-tight uppercase">Latest Internship Broadcasts</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-[#E7E2DB]">
                                <th className="px-8 py-5">Position Title</th>
                                <th className="px-8 py-5">Startup Partner</th>
                                <th className="px-8 py-5">Industry Domain</th>
                                <th className="px-8 py-5 text-right pr-10">Posted Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E7E2DB]">
    {recentInternships.map((internship) => (
        <tr key={internship._id} className="hover:bg-[#FADADD]/10 transition-colors group">
            {/* 1. Internship Position Title */}
            <td className="px-8 py-5">
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-sm tracking-tight">
                        {internship.title}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        Ref: {internship._id.slice(-6).toUpperCase()}
                    </span>
                </div>
            </td>

            {/* 2. Startup Partner Name (FETCHED FROM NESTED OBJECT) */}
            <td className="px-8 py-5">
                <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-[#F36B7F]" />
                    <span className="text-sm font-bold text-gray-700">
                        {internship.startupId.name || "CIIC Partner"}
                    </span>
                </div>
            </td>

            {/* 3. Industry Domain */}
            <td className="px-8 py-5">
                <span className="px-3 py-1 bg-[#F6F2ED] border border-[#E7E2DB] rounded-lg text-[9px] font-black uppercase text-gray-500 tracking-widest">
                    {internship.domain.replace('_', ' ')}
                </span>
            </td>

            {/* 4. Date of Posting */}
            <td className="px-8 py-5 text-right pr-10">
                <span className="text-xs font-bold text-slate-400">
                    {new Date(internship.createdAt).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                    })}
                </span>
            </td>
        </tr>
    ))}
</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;