import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import cresLogo from '../../assets/cres.png'
import { 
  Rocket, GraduationCap, Building2, ShieldCheck, 
  ArrowRight, Globe, Zap, Users, TrendingUp,
  Target, Award, BadgeCheck, Star, ArrowUpRight, 
  Linkedin, Facebook, Instagram, Twitter
} from 'lucide-react';

const FADE_UP = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      
      {/* --- 1. COMMAND CENTER NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex items-center px-4 md:px-8">
        <div className="w-full max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-10">
           <div className="flex items-center gap-3">
  {/* The Logo Box - Styled as a sharp, modular component */}
  <div className="w-11 h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm overflow-hidden p-1.0 group-hover:border-blue-600 transition-colors duration-300">
    <img 
      src={cresLogo} 
      alt="CIIC Logo" 
      className="w-full h-full object-contain" 
    />
  </div>

  {/* Brand Typography */}
  <div className="flex flex-col leading-none">
    <span className="text-xl font-black tracking-tighter uppercase text-slate-900">
      CIIC <span className="text-blue-600">Portal</span>
    </span>
    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
      Internship Portal
    </span>
  </div>
</div>
            
            <div className="hidden xl:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
              <a href="#stats" className="hover:text-blue-600 transition-all">Impact</a>
              <a href="#pathways" className="hover:text-blue-600 transition-all">Destinations</a>
              <a href="#milestones" className="hover:text-blue-600 transition-all">Roadmap</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={() => navigate('/login/admin')}
              className="hidden lg:flex px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
             >
               Admin
             </button>
             <button 
               onClick={() => document.getElementById('pathways').scrollIntoView({ behavior: 'smooth' })}
               className="bg-slate-950 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 shadow-2xl transition-all active:scale-95"
             >
               Login
             </button>
          </div>
        </div>
      </nav>

      {/* --- 2. THE VISIONARY HERO --- */}
      <section className="pt-48 pb-24 overflow-hidden relative px-6 md:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.04)_0%,transparent_60%)] -z-10" />
        
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <motion.div {...FADE_UP} className="lg:col-span-7">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 text-white rounded-lg text-[9px] font-black uppercase tracking-[0.25em] mb-10 shadow-xl">
              <BadgeCheck size={14} className="text-blue-400" /> Vetted Incubator Hub
            </div> */}
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] uppercase mb-10">
              Talent Meets <br />
              <span className="text-blue-600">Enterprise.</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-12">
              Accelerate your industry presence with the official Crescent Internship Engine. 
              Connecting verified candidates to 100+ top-tier incubated startups.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => navigate('/login/student')}
                className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex justify-center items-center gap-2 active:scale-95"
              >
                Secure Internship <ArrowUpRight size={18} />
              </button>
              <Link 
                to="/login/startup"
                className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex justify-center items-center"
              >
                Hire talent
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 hidden lg:block"
          >
             <div className="relative p-4 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner group">
                <img 
                  src="https://illustrations.popsy.co/white/remote-work.svg" 
                  alt="System Illustration" 
                  className="w-full transition-transform duration-700 group-hover:scale-[1.02] group-hover:-rotate-1"
                />
                <div className="absolute top-8 right-8 bg-white border border-slate-200 p-4 rounded-3xl shadow-xl flex items-center gap-3">
                   <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Star fill="currentColor" size={16} /></div>
                   <p className="text-[10px] font-black uppercase text-slate-400 leading-tight tracking-widest">CIIC <br /><span className="text-slate-900">Verified companies</span></p>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* --- 3. DYNAMIC ANALYTICS STRIP --- */}
      <section id="stats" className="bg-[#020617] py-20 px-8">
        <div className="max-w-[1500px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center border-x border-white/5">
          <StatBox label="Live Applications" value="1,402" />
          <StatBox label="Vetted Partnerships" value="142" />
          <StatBox label="Talent Pool" value="6,800+" />
          <StatBox label="Certificates Issued" value="1.2K" />
        </div>
      </section>

      {/* --- 4. PATHWAY SELECTION --- */}
      <section id="pathways" className="py-32 px-6 bg-slate-50/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-24">
            <h2 className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4">GET STARTED</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter uppercase leading-none">Access The Portal</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1400px] mx-auto">
          <ModuleCard 
            icon={GraduationCap} title="STUDENTS" 
            desc="Explore high-growth tracks, maintain your professional profile and claim verified industry opportunities."
            btn="Student Login" link="/login/student" color="blue"
          />
          <ModuleCard 
            icon={Building2} title="Founders" 
            desc="Publish roles, monitor applicants and secure top crescentian's talent with zero overhead."
            btn="Startup Login" link="/login/startup" color="indigo"
          />
          <ModuleCard 
            icon={ShieldCheck} title="Admin" 
            desc="Maintain institutional integrity, oversight recruitment stats and regulate startups."
            btn="Admin Login" link="/login/admin" color="slate"
          />
        </div>
      </section>

      {/* --- 5. IMPACT & MILESTONES (NEW REPLACED SECTION) --- */}
      <section id="milestones" className="py-32 px-8 bg-white overflow-hidden relative">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
                <div className="space-y-4">
                    <h2 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] border-l-4 border-blue-600 pl-4 py-1">Recent Milestones</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter leading-none uppercase">Success Recorded <br /> in Every Batch.</h3>
                </div>

                <div className="grid gap-6">
                    <MilestoneItem date="Jan 2025" title="Spring Enrollment Launch" body="Surpassed 6000 student enrollments with an automated matching rate of 88%." />
                    <MilestoneItem date="Dec 2024" title="Strategic Funding Circle" body="Incubated startups collectively raised ₹25Cr+, increasing high-stipend internship capacity." />
                    <MilestoneItem date="Oct 2024" title="Excellence Recognition" body="Ranked in top innovation hubs for institutional recruitment frameworks." />
                </div>
            </div>

            <div className="relative bg-slate-950 p-10 md:p-20 rounded-[4rem] text-white shadow-[0_20px_60px_rgba(37,99,235,0.1)]">
                <Globe className="absolute top-0 right-0 p-12 text-blue-600 opacity-5" size={340} strokeWidth={1}/>
                <Star className="text-blue-500 mb-8" size={48} fill="currentColor" />
                <p className="text-2xl md:text-3xl font-bold leading-relaxed mb-12 italic uppercase italic-off tracking-tight">
                  "The CIIC Portal transformed how our startup sources talent. We went from posting a role to a verified hire within 48 hours."
                </p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-10">
                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-900 font-black italic italic-off">FN</div>
                   <div>
                     <p className="text-xs font-black uppercase tracking-widest text-white">Farhan Tech</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Founder @ CEO</p>
                   </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 6. REDESIGNED PROFESSIONAL FOOTER --- */}
    <footer className="border-t border-slate-100 bg-[#FBFBFE] py-24 px-8 overflow-hidden relative">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 relative z-10">
        
        {/* Brand Section */}
        <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Rocket className="text-blue-600" size={32} />
                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">CIIC</h4>
                </div>
                <p className="text-sm text-slate-500 font-bold leading-relaxed max-w-sm">
                    Providing a high-density professional environment for the next generation of engineers and entrepreneurs at Crescent University.
                </p>
            </div>
            <div className="flex items-center gap-3">
                <SocialCircle icon={Linkedin} href="https://www.linkedin.com/company/ciicofficial" />
                <SocialCircle icon={Instagram} href="https://www.instagram.com/ciicupdates" />
                <SocialCircle icon={Twitter} href="https://x.com/ciicupdates" />
            </div>
        </div>

        {/* Location Section - Fills the "Empty" space professionally */}
        <div className="lg:col-span-4 space-y-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Headquarters</p>
            <div className="space-y-4">
                <div className="space-y-1">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Crescent University Campus</p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase leading-loose tracking-wider">
                        GST Road, Vandalur, Chennai <br />
                        Tamil Nadu, India - 600048
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operations: Mon - Sat / 09:00 - 18:00</p>
                </div>
            </div>
        </div>

        {/* Action Card */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-[2.5rem] p-8 text-center flex flex-col justify-center gap-4 shadow-sm">
            <p className="text-sm font-black text-slate-900 uppercase leading-tight">Need assistance <br /> in registration?</p>
            <a href="mailto:support@ciic.res.in" className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Support Desk</a>
        </div>
    </div>

    {/* Bottom Bar */}
    <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p>© 2025 Crescent Innovation & Incubation Council</p>
            <div className="hidden md:block w-px h-3 bg-slate-200"></div>
            <p className="text-slate-300">ISO 9001:2015 Certified</p>
        </div>
        <p className="flex items-center gap-2 text-blue-600/60">
            <span className="w-1 h-1 rounded-full bg-blue-600"></span>
            Professional Deployment Mode
        </p>
    </div>
</footer>
    </div>
  );
};

/* --- SHARED MODULAR BLOCKS --- */

const StatBox = ({ label, value }) => (
  <div className="space-y-2 border-r last:border-0 border-white/5 py-4">
    <h4 className="text-3xl md:text-5xl font-black text-white italic-off tracking-tighter">{value}</h4>
    <p className="text-[9px] font-bold text-blue-500/60 uppercase tracking-[0.2em] italic-off">{label}</p>
  </div>
);

const ModuleCard = ({ icon: Icon, title, highlight, desc, btn, link, color }) => {
    const navigate = useNavigate();
    const colors = { blue: "hover:border-blue-500 group-hover:text-blue-600", indigo: "hover:border-indigo-600 group-hover:text-indigo-600", slate: "hover:border-slate-900 group-hover:text-slate-900" };
    return (
        <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[3rem] text-center flex flex-col h-full group hover:shadow-2xl transition-all duration-500 overflow-hidden relative border-b-8 border-b-slate-100">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:bg-blue-600 group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-slate-100">
               <Icon size={24} />
            </div>
            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2 leading-none">{highlight}</p>
            <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tight italic-off mb-6 leading-none">{title}</h4>
            <p className="text-sm text-slate-400 font-bold leading-relaxed mb-10 flex-grow uppercase italic-off px-4">{desc}</p>
            <button 
                onClick={() => navigate(link)}
                className="w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-md active:scale-95"
            >
                {btn}
            </button>
        </div>
    );
};

const MilestoneItem = ({ date, title, body }) => (
    <div className="flex gap-6 items-start group">
        <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded uppercase tracking-widest w-28 text-center shrink-0 border border-slate-100 shadow-sm">{date}</div>
        <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{title}</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{body}</p>
        </div>
    </div>
);

const SocialCircle = ({ icon: Icon, href = "#" }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ y: -4, scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 
               hover:text-blue-600 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 
               transition-colors duration-300 group cursor-pointer"
  >
    <Icon size={18} className="group-hover:rotate-[8deg] transition-transform duration-300" />
  </motion.a>
);

export default LandingPage;