import React, { useEffect, useState, useContext } from 'react';
import { Users, Briefcase, Clock, CheckCircle, Plus, ArrowRight, Loader2, XCircle, Globe, Zap } from 'lucide-react';
import api from '../../api/axiosConfig.js';
import { AuthContext } from '../../context/AuthContext';
import { useDomains } from '../../context/DomainContext';
import { useNavigate } from 'react-router-dom';

const StartupDashboard = () => {
  const { user } = useContext(AuthContext);
  const { domains } = useDomains();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [globalDomainStats, setGlobalDomainStats] = useState([]); // 👈 State for Top Domains
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    selected: 0,
    completed: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, [domains]); // Re-run if domains context updates

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [alertsRes, appsRes, ciicInternshipsRes] = await Promise.all([
        api.get('/startup/alerts/alerts'),
        api.get('/startup/applications/get-applications'),
        api.get('/ciic/getinternships') // 👈 Fetching all internships globally
      ]);

      const allApps = appsRes.data;
      const allGlobalInternships = ciicInternshipsRes.data;

      // 1. Stats calculation (Startup specific)
      const pendingCount = allApps.filter(a => a.status === 'APPLIED' || a.status === 'PENDING').length;
      const selectedCount = allApps.filter(a => a.status === 'SELECTED' || a.status === 'ACCEPTED').length;
      const completedCount = allApps.filter(a => a.status === 'COMPLETED').length;
      const rejectedCount = allApps.filter(a => a.status === 'REJECTED').length;

      setStats({
        total: allApps.length,
        pending: pendingCount,
        selected: selectedCount,
        completed: completedCount,
        rejected: rejectedCount
      });

      // 2. Logic: Group Global Internships by Domain and find top 4
      const domainCounts = allGlobalInternships.reduce((acc, curr) => {
        const d = curr.domain || 'General';
        acc[d] = (acc[d] || 0) + 1;
        return acc;
      }, {});

      const sortedDomains = Object.entries(domainCounts)
        .sort(([, a], [, b]) => b - a) // Sort descending
        .slice(0, 4) // Top 4
        .map(([key, count]) => ({
          label: domains?.find(d => d.key === key)?.label || key,
          count: count
        }));

      setGlobalDomainStats(sortedDomains);

      // 3. Recent Applicants
      const sortedApps = [...allApps].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentApplicants(sortedApps.slice(0, 5));

      setAlerts(alertsRes.data);

    } catch (err) {
      console.error("Dashboard data error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* 1. HERO SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm">Welcome back, {user?.name || "Startup Admin"}.</p>
        </div>
        <button 
          onClick={() => navigate('/startup/internships/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> Post New Internship
        </button>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard label="Total Applicants" value={stats.total} icon={Users} color="text-blue-600" />
        <StatCard label="Pending Review" value={stats.pending} icon={Clock} color="text-amber-500" />
        <StatCard label="Selected Talent" value={stats.selected} icon={Briefcase} color="text-indigo-600" />
        <StatCard label="Completed Roles" value={stats.completed} icon={CheckCircle} color="text-emerald-600" />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} color="text-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. RECENT APPLICANTS */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent Applicants</h3>
            <button onClick={() => navigate('/startup/internships')} className="text-blue-600 text-xs font-bold hover:underline">View All Pipeline</button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentApplicants.length > 0 ? recentApplicants.map((app) => (
              <div key={app._id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 uppercase">
                    {(app.studentId?.fullName || app.studentId?.name || 'S').charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{app.studentId?.fullName || app.studentId?.name || "Student"}</p>
                    <p className="text-xs text-slate-500 font-medium">Applied for: {app.internshipId?.title || "Role"}</p>
                  </div>
                </div>
                <button onClick={() => navigate(`/startup/internships/${app.internshipId?._id}/applications`)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            )) : (
              <div className="p-10 text-center text-slate-400 text-sm font-medium">No recent applicants found</div>
            )}
          </div>
        </div>

        {/* 4. POSTINGS HEALTH (GLOBAL DOMAIN STATS) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-tight">Domain wise internships</h3>
            <div className="space-y-5">
              {globalDomainStats.length > 0 ? globalDomainStats.map((stat, idx) => (
                <HealthItem 
                  key={idx}
                  label={stat.label} 
                  // status="Trending" // Generic professional status
                  count={stat.count} 
                />
              )) : (
                <p className="text-xs text-slate-400 text-center py-4">Analyzing global trends...</p>
              )}
            </div>
          </div>
          
          {/* CIIC Feed */}
          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden h-fit">
             <div className="relative z-10 space-y-4">
                <h3 className="font-bold mb-2 italic">CIIC Feed</h3>
                {alerts.length > 0 ? alerts.slice(0, 2).map((alert) => (
                  <div key={alert._id} className="border-b border-blue-400/30 pb-3 last:border-0 last:pb-0">
                    <p className="text-xs text-blue-50 font-medium leading-relaxed mb-1">{alert.message}</p>
                    <p className="text-[9px] text-blue-200 font-black uppercase tracking-tighter">
                      {new Date(alert.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                )) : (
                  <p className="text-xs text-blue-100">No active broadcast messages.</p>
                )}
             </div>
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Sub-components (Preserved)
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
    <div className={`${color} mb-3`}><Icon size={20} /></div>
    <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
    <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wider">{label}</p>
  </div>
);

const HealthItem = ({ label, status, count }) => (
  <div className="flex justify-between items-center">
    <div>
      <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">{label}</p>
      <p className="text-[10px] font-bold text-emerald-500 uppercase">{status}</p>
    </div>
    <span className="text-xs font-black text-slate-400">{count} Posts</span>
  </div>
);

export default StartupDashboard;