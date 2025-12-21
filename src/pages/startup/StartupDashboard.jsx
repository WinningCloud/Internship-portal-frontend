import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

const StartupDashboard = () => {
  const [stats, setStats] = useState({ totalInternships: 0, totalApplications: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/startup/internships');
        // Simple logic to count total applications across all internships
        const appsCount = res.data.reduce((acc, curr) => acc + curr.applicationsCount, 0);
        setStats({ totalInternships: res.data.length, totalApplications: appsCount });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Active Internships</p>
          <h2 className="text-4xl font-bold text-indigo-600">{stats.totalInternships}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Total Applications Received</p>
          <h2 className="text-4xl font-bold text-emerald-600">{stats.totalApplications}</h2>
        </div>
      </div>
    </div>
  );
};

export default StartupDashboard;