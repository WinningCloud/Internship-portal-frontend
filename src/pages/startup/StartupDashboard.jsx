import React from 'react';
import { Users, Briefcase, Clock, CheckCircle, Plus, Search, ArrowRight } from 'lucide-react';

const StartupDashboard = () => {
  return (
    <div className="space-y-8">
      {/* 1. HERO SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm">Welcome back, Farhan Tech Solutions.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Post New Internship
        </button>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Applicants" value="128" icon={Users} color="text-blue-600" />
        <StatCard label="Pending Review" value="14" icon={Clock} color="text-amber-500" />
        <StatCard label="Live Roles" value="04" icon={Briefcase} color="text-indigo-600" />
        <StatCard label="Total Hired" value="09" icon={CheckCircle} color="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. RECENT APPLICANTS (Main Column) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent Applicants</h3>
            <button className="text-blue-600 text-xs font-bold hover:underline">View All Pipeline</button>
          </div>
          <div className="divide-y divide-slate-50">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">S</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Salman Farish</p>
                    <p className="text-xs text-slate-500 font-medium">Applied for: Full Stack Developer</p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. ACTIVE POSTINGS (Sidebar Column) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 text-sm">Postings Health</h3>
            <div className="space-y-4">
              <HealthItem label="UI/UX Designer" status="Healthy" count="42" />
              <HealthItem label="React Developer" status="Urgent" count="08" />
              <HealthItem label="SEO Intern" status="Healthy" count="12" />
            </div>
          </div>
          
          {/* CIIC Notice */}
          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="font-bold mb-2 italic">CIIC Update</h3>
                <p className="text-xs text-blue-100 leading-relaxed">
                  The winter internship fair starts on Jan 15th. Make sure your profile is updated to get maximum visibility.
                </p>
             </div>
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Sub-components
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
      <p className="text-xs font-bold text-slate-800">{label}</p>
      <p className={`text-[10px] font-bold ${status === 'Urgent' ? 'text-amber-500' : 'text-emerald-500'}`}>{status}</p>
    </div>
    <span className="text-xs font-black text-slate-400">{count} Apps</span>
  </div>
);

export default StartupDashboard;