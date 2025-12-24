import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  UserCircle, 
  LogOut, 
  Sparkles 
} from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const StartupSidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/startup/dashboard', icon: LayoutDashboard },
    { name: 'My Internships', path: '/startup/internships', icon: Briefcase },
    { name: 'Post Internship', path: '/startup/internships/create', icon: PlusCircle },
    { name: 'Company Profile', path: '/startup/profile', icon: UserCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen w-72 bg-[#020617] text-slate-300 flex flex-col fixed left-0 top-0 border-r border-slate-800/60 shadow-[4px_0_24px_rgba(0,0,0,0.3)] z-50">
      
      {/* 1. Brand Logo Section - Azure Gradient */}
      <div className="p-8 mb-4">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/startup/dashboard')}>
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-400 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-all duration-500">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-none uppercase">CIIC</h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-blue-400 font-bold mt-1.5">Executive Suite</p>
          </div>
        </div>
      </div>

      {/* 2. Navigation Menu */}
      <div className="flex-1 px-4 overflow-y-auto custom-scrollbar">
        <p className="px-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Management Console</p>
        
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-500 ${
                  isActive 
                  ? 'bg-blue-600/10 text-blue-50' 
                  : 'hover:bg-slate-800/40 hover:text-blue-100'
                }`}
              >
                {/* Active Indicator Neon Pill */}
                {isActive && (
                  <div className="absolute left-0 w-1.5 h-8 bg-blue-500 rounded-r-full shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
                )}

                <div className="flex items-center space-x-4">
                  <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:translate-x-1'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'}`} />
                  </div>
                  <span className={`text-sm font-semibold tracking-wide transition-colors ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                    {item.name}
                  </span>
                </div>

                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,1)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. Luxury User Section */}
      <div className="p-6 mt-auto">
        <div className="relative group p-4 rounded-3xl bg-slate-900/50 border border-slate-800/50 mb-4 overflow-hidden shadow-inner">
            {/* Background decorative glow */}
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
            
            <div className="flex items-center space-x-3 relative z-10">
                <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center shadow-lg">
                        <UserCircle className="w-7 h-7 text-blue-400" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#020617] rounded-full shadow-lg" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-100 truncate italic">Startup Admin</p>
                    <p className="text-[10px] text-blue-400/80 truncate font-black tracking-widest uppercase mt-0.5">Verified</p>
                </div>
            </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full group flex items-center justify-center space-x-3 p-4 rounded-2xl text-blue-50 font-black text-[11px] uppercase tracking-widest bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-900/20 transition-all duration-300 active:scale-95 border border-blue-400/20"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Secure Sign Out</span>
        </button>

        <div className="flex items-center justify-center space-x-2 mt-6 opacity-20">
            <div className="h-[1px] w-8 bg-blue-500" />
            <span className="text-[9px] font-black tracking-tighter text-blue-300 uppercase">Est. 2025</span>
            <div className="h-[1px] w-8 bg-blue-500" />
        </div>
      </div>
    </div>
  );
};

export default StartupSidebar;