import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Rocket, GraduationCap, ShieldCheck, Database, 
  ArrowRight, CheckCircle2, Globe, Zap, Users 
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* --- 1. PRO NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-rose-600 p-2 rounded-lg">
              <Rocket className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter">CIIC<span className="text-rose-600">PORTAL</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-rose-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-rose-600 transition">How it Works</a>
            <button 
              onClick={() => document.getElementById('gateways').scrollIntoView({ behavior: 'smooth' })}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-rose-600 transition shadow-lg shadow-rose-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-50 via-transparent to-transparent -z-10 opacity-70" />
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <span className="px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest border border-rose-100">
              Official Incubation Portal
            </span>
            <h1 className="mt-8 text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
              Bridge the Gap <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-fuchsia-500 to-indigo-600">
                To Your Future.
              </span>
            </h1>
            <p className="mt-8 text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              The centralized ecosystem for Crescent Innovation & Incubation Council. 
              Connecting ambitious students with high-growth startups for real-world impact.
            </p>
            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/login/student')}
                className="group bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
              >
                Apply as Student <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/login/startup')}
                className="group bg-white text-slate-900 border-2 border-slate-100 px-8 py-4 rounded-2xl font-bold flex items-center hover:border-rose-300 transition-all"
              >
                Hire Talent <Rocket className="ml-2 w-5 h-5 text-rose-500" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 3. STATS SECTION --- */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Active Startups", val: "120+" },
            { label: "Internships Posted", val: "500+" },
            { label: "Students Hired", val: "1.2k" },
            { label: "Success Rate", val: "94%" },
          ].map((s, i) => (
            <motion.div key={i} {...fadeIn}>
              <h2 className="text-4xl md:text-5xl font-black text-rose-500">{s.val}</h2>
              <p className="text-slate-400 text-sm mt-2 font-medium uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 4. THE GATEWAYS (Core Redirection Cards) --- */}
      <section id="gateways" className="py-32 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black tracking-tight">Access Your Portal</h2>
            <p className="text-slate-500 mt-4">Select your role to enter the specific dashboard area.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GatewayCard 
              icon={GraduationCap} 
              title="Students" 
              desc="Build profile, apply for roles and get certified." 
              path="/login/student" 
              color="bg-blue-600"
            />
            <GatewayCard 
              icon={Rocket} 
              title="Startups" 
              desc="Post roles, manage applicants and issue certificates." 
              path="/login/startup" 
              color="bg-rose-600"
            />
            <GatewayCard 
              icon={ShieldCheck} 
              title="CIIC Admin" 
              desc="System oversight, startup approvals and audit logs." 
              path="/login/admin" 
              color="bg-slate-800"
            />
            <GatewayCard 
              icon={Database} 
              title="Student Admin" 
              desc="Analyze data, generate reports and verify records." 
              path="/login/admin" 
              color="bg-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* --- 5. INFO CARDS SECTION --- */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <InfoCard 
            icon={Zap} 
            title="Fast Tracking" 
            desc="Startups can hire in as little as 48 hours with our optimized screening tools." 
          />
          <InfoCard 
            icon={Users} 
            title="Verified Network" 
            desc="Every startup is CIIC-incubated, ensuring quality and reliable internship experiences." 
          />
          <InfoCard 
            icon={Globe} 
            title="Digital Records" 
            desc="Automated certificate generation and Cloudinary-stored resumes for easy access." 
          />
        </div>
      </section>

      {/* --- 6. FOOTER --- */}
      <footer className="bg-white border-t border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-8">
          <div className="flex items-center space-x-2 opacity-50 grayscale hover:grayscale-0 transition cursor-default">
            <Rocket className="w-5 h-5" />
            <span className="font-bold tracking-tighter">CIIC PORTAL</span>
          </div>
          <p className="text-slate-400 text-sm">© 2025 Crescent Innovation & Incubation Council. Built for Excellence.</p>
          <div className="flex space-x-6 text-slate-400 text-sm font-medium">
            <a href="#" className="hover:text-rose-600">Privacy</a>
            <a href="#" className="hover:text-rose-600">Terms</a>
            <a href="#" className="hover:text-rose-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const GatewayCard = ({ icon: Icon, title, desc, path, color }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      onClick={() => navigate(path)}
      className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 cursor-pointer group"
    >
      <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
        <Icon className="text-white w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-6">{desc}</p>
      <div className="flex items-center text-sm font-bold group-hover:gap-2 transition-all">
        Enter <ArrowRight className="ml-1 w-4 h-4" />
      </div>
    </motion.div>
  );
};

const InfoCard = ({ icon: Icon, title, desc }) => (
  <div className="p-10 rounded-3xl bg-slate-50 border border-slate-100">
    <Icon className="w-10 h-10 text-rose-600 mb-6" />
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;