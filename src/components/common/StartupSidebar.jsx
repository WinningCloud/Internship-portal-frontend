import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  UserCircle, 
  LogOut, 
  ChevronRight,
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
    <div className="h-screen w-72 bg-[#1a0f13] text-rose-100/70 flex flex-col fixed left-0 top-0 border-r border-rose-900/30 shadow-[10px_0_30px_rgba(0,0,0,0.3)] z-50">
      
      {/* 1. Brand Logo Section - Magenta Gradient */}
      <div className="p-8 mb-4">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/startup/dashboard')}>
          <div className="bg-gradient-to-tr from-rose-600 to-fuchsia-500 p-2.5 rounded-2xl shadow-lg shadow-rose-500/20 group-hover:rotate-12 transition-all duration-500">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-none">CIIC</h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-rose-400 font-bold mt-1.5">Elevate Startup</p>
          </div>
        </div>
      </div>

      {/* 2. Navigation Menu */}
      <div className="flex-1 px-4 overflow-y-auto custom-scrollbar">
        <p className="px-5 text-[10px] font-bold text-rose-300/30 uppercase tracking-[0.2em] mb-6">Menu Console</p>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-500 ${
                  isActive 
                  ? 'bg-gradient-to-r from-rose-500/20 via-rose-500/5 to-transparent text-rose-50' 
                  : 'hover:bg-rose-500/5 hover:text-rose-200'
                }`}
              >
                {/* Active Neon Line */}
                {isActive && (
                  <div className="absolute left-0 w-1.5 h-8 bg-rose-500 rounded-r-full shadow-[0_0_20px_rgba(244,63,94,0.8)]" />
                )}

                <div className="flex items-center space-x-4">
                  <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:translate-x-1'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-rose-400' : 'text-rose-300/40 group-hover:text-rose-400'}`} />
                  </div>
                  <span className={`text-sm font-medium tracking-wide transition-colors ${isActive ? 'font-bold' : ''}`}>
                    {item.name}
                  </span>
                </div>

                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse shadow-[0_0_10px_rgba(251,113,133,1)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. Luxury User Section */}
      <div className="p-6 mt-auto">
        <div className="relative group p-4 rounded-3xl bg-gradient-to-b from-rose-900/20 to-transparent border border-rose-500/10 mb-4 overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all" />
            
            <div className="flex items-center space-x-3 relative z-10">
                <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500/20 to-fuchsia-500/20 border border-rose-500/30 flex items-center justify-center">
                        <UserCircle className="w-7 h-7 text-rose-400" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#1a0f13] rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-rose-50 truncate italic">Startup Admin</p>
                    <p className="text-[10px] text-rose-400/60 truncate font-medium">Verified Partner</p>
                </div>
            </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full group flex items-center justify-center space-x-3 p-4 rounded-2xl text-rose-100 font-bold text-sm bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-900/20 transition-all duration-300 active:scale-95"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Secure Sign Out</span>
        </button>

        <div className="flex items-center justify-center space-x-2 mt-6 opacity-30">
            <div className="h-px w-8 bg-rose-500" />
            <span className="text-[10px] font-bold tracking-tighter text-rose-300">ESTD 2025</span>
            <div className="h-px w-8 bg-rose-500" />
        </div>
      </div>
    </div>
  );
};

export default StartupSidebar;