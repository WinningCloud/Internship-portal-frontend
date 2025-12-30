import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Loader2, CalendarDays, GraduationCap } from 'lucide-react';
import api from '../../api/axiosConfig';

// Standard Department List for your University
const DEPARTMENTS = [
    "CSE", "IT", "ECE", "EEE", "MECHANICAL", "CIVIL", "AERONAUTICAL", "BCA", "BSC", "ARCHITECTURE"
];

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [appsPerStartup, setAppsPerStartup] = useState([]);
    const [selectedVsRejected, setSelectedVsRejected] = useState([]);
    const [deptParticipation, setDeptParticipation] = useState([]); // Real Dept Data
    const [participationView, setParticipationView] = useState('ACADEMIC');
    const [academicData, setAcademicData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    const COLORS = ['#F36B7F', '#818CF8', '#FADADD', '#34D399', '#FBBF24', '#60A5FA', '#E7E2DB'];

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            const [appRes, startupRes] = await Promise.all([
                api.get('/ciic/applications/get-applications'),
                api.get('/ciic/startups/getstartups')
            ]);

            const applications = appRes.data;
            const startups = startupRes.data;

            // --- 1. Graph: Applications per Startup ---
            const counts = {};
            applications.forEach(app => {
                const sId = app.startupId;
                counts[sId] = (counts[sId] || 0) + 1;
            });
            setAppsPerStartup(startups.map(s => ({
                name: s.name,
                apps: counts[s._id] || 0
            })).filter(item => item.apps > 0).sort((a, b) => b.apps - a.apps));

            // --- 2. Graph: Real Department Participation Logic ---
            const deptMap = {};
            applications.forEach(app => {
                // Normalize the name to uppercase to catch "cse" and "CSE"
                let dept = app.studentId?.department?.toUpperCase() || "UNSPECIFIED";
                
                // If you implement the dropdown, this becomes very clean. 
                // For now, we group them:
                deptMap[dept] = (deptMap[dept] || 0) + 1;
            });

            const processedDeptData = Object.keys(deptMap).map(key => ({
                name: key,
                value: deptMap[key]
            })).sort((a, b) => b.value - a.value);
            
            setDeptParticipation(processedDeptData);

            // --- 3. Graph: Academic & Monthly Participation ---
            const academicMap = { '1st': 0, '2nd': 0, '3rd': 0, '4th': 0 };
            const monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                             .map(m => ({ name: m, students: 0 }));
            const currentYear = new Date().getFullYear();

            applications.forEach(app => {
                const year = app.studentId?.yearOfStudy;
                if (year >= 1 && year <= 4) academicMap[`${year}${year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'}`] += 1;

                const appDate = new Date(app.appliedAt);
                if (appDate.getFullYear() === currentYear) {
                    monthMap[appDate.getMonth()].students += 1;
                }
            });

            setAcademicData(Object.keys(academicMap).map(key => ({ label: `${key} Year`, students: academicMap[key] })));
            setMonthlyData(monthMap);

            // --- 4. Graph: Selected vs Rejected ---
            const statusMap = {};
            applications.forEach(app => {
                const sId = app.startupId;
                if (!statusMap[sId]) statusMap[sId] = { Selected: 0, Rejected: 0 };
                const status = app.status?.toUpperCase();
                if (status === 'REJECTED') statusMap[sId].Rejected += 1;
                else if (status === 'SELECTED' || status === 'COMPLETED') statusMap[sId].Selected += 1;
            });
            setSelectedVsRejected(startups.map(s => ({
                name: s.name,
                Selected: statusMap[s._id]?.Selected || 0,
                Rejected: statusMap[s._id]?.Rejected || 0
            })).filter(item => item.Selected > 0 || item.Rejected > 0));

        } catch (err) {
            console.error("Critical Analytics Failure:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#F6F2ED]">
            <Loader2 className="animate-spin text-[#F36B7F] mb-4" size={40} />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Assembling Visual Intelligence...</p>
        </div>
    );

    return (
        <div className="space-y-8 bg-white p-8 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* G1: Apps per Startup */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E7E2DB]">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Applications per Startup</h3>
                    <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={appsPerStartup}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E2DB" /><XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }} interval={0} /><YAxis tick={{ fontSize: 12, fill: '#6B7280' }} /><Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} /><Bar dataKey="apps" fill="#F36B7F" radius={[4, 4, 0, 0]} barSize={32} /></BarChart></ResponsiveContainer></div>
                </div>

                {/* G2: REAL Department Participation */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E7E2DB]">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Department Distribution</h3>
                    <div className="h-64 flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={deptParticipation} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {deptParticipation.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={5} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                                <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* G3: Academic/Monthly Toggle */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E7E2DB]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{participationView === 'ACADEMIC' ? 'Academic Distribution' : 'Monthly Trend (2025)'}</h3>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button onClick={() => setParticipationView('ACADEMIC')} className={`p-1.5 rounded-md transition-all ${participationView === 'ACADEMIC' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><GraduationCap size={16} /></button>
                            <button onClick={() => setParticipationView('MONTHLY')} className={`p-1.5 rounded-md transition-all ${participationView === 'MONTHLY' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><CalendarDays size={16} /></button>
                        </div>
                    </div>
                    <div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={participationView === 'ACADEMIC' ? academicData : monthlyData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E2DB" /><XAxis dataKey={participationView === 'ACADEMIC' ? 'label' : 'name'} tick={{ fontSize: 12, fill: '#6B7280' }} /><YAxis tick={{ fontSize: 12, fill: '#6B7280' }} /><Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} /><Line type="monotone" dataKey="students" stroke="#F36B7F" strokeWidth={3} dot={{ r: 4, fill: '#F36B7F', strokeWidth: 2, stroke: '#fff' }} /></LineChart></ResponsiveContainer></div>
                </div>

                {/* G4: Selected vs Rejected */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E7E2DB]">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Selected vs Rejected</h3>
                    <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={selectedVsRejected}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E2DB" /><XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }} interval={0} /><YAxis tick={{ fontSize: 12, fill: '#6B7280' }} /><Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} /><Legend /><Bar dataKey="Selected" stackId="a" fill="#F36B7F" barSize={32} radius={[0, 0, 4, 4]} /><Bar dataKey="Rejected" stackId="a" fill="#E7E2DB" barSize={32} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;