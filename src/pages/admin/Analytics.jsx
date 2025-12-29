import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const Analytics = () => {
    // Mock Data
    const appsPerStartup = [
        { name: 'TechNova', apps: 45 },
        { name: 'GreenEarth', apps: 120 },
        { name: 'CloudScale', apps: 28 },
        { name: 'FinFuture', apps: 32 },
        { name: 'EduTech', apps: 15 },
    ];

    const deptParticipation = [
        { name: 'CSE', value: 45 },
        { name: 'IT', value: 30 },
        { name: 'ECE', value: 15 },
        { name: 'EEE', value: 10 },
    ];

    const yearWiseParticipation = [
        { year: '1st', students: 10 },
        { year: '2nd', students: 45 },
        { year: '3rd', students: 80 },
        { year: '4th', students: 120 },
    ];

    const selectedVsRejected = [
        { name: 'Jan', Selected: 10, Rejected: 5 },
        { name: 'Feb', Selected: 12, Rejected: 8 },
        { name: 'Mar', Selected: 20, Rejected: 10 },
        { name: 'Apr', Selected: 15, Rejected: 12 },
    ];

    const COLORS = ['#F36B7F', '#E7E2DB', '#FADADD', '#F2B8C6'];

    return (
        <div className="space-y-8 animate-fade-in bg-[#F6F2ED] p-8 min-h-screen">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
                Visual Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Applications per Startup */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E7E2DB]">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                        Applications per Startup
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={appsPerStartup}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E2DB" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar
                                    dataKey="apps"
                                    fill="#F36B7F"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Department Participation */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E7E2DB]">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                        Department Participation
                    </h3>
                    <div className="h-64 flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deptParticipation}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {deptParticipation.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            cornerRadius={5}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Year-wise Participation */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E7E2DB]">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                        Year-wise Participation
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={yearWiseParticipation}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E2DB" />
                                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="students"
                                    stroke="#F36B7F"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#F36B7F' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Selected vs Rejected */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E7E2DB]">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                        Selected vs Rejected
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={selectedVsRejected}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E2DB" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Legend />
                                <Bar
                                    dataKey="Selected"
                                    stackId="a"
                                    fill="#F36B7F"
                                    barSize={40}
                                    radius={[0, 0, 4, 4]}
                                />
                                <Bar
                                    dataKey="Rejected"
                                    stackId="a"
                                    fill="#E7E2DB"
                                    barSize={40}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;
