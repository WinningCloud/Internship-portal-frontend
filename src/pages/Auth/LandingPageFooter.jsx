import React from 'react';
import { Rocket, Linkedin, Instagram, Twitter, Mail } from 'lucide-react';
import ciscLogo from '/ciscLogo.jpg';   
const SocialCircle = ({ icon: Icon, href }) => (
  <a 
    href={href} 
    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-all duration-300"
  >
    <Icon size={14} />
  </a>
);

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 bg-[#FBFBFE] py-20 px-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20 relative z-10">
        
        {/* Brand Section */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className=" p-1.5 rounded-lg">
               <img src={ciscLogo} alt="CISC Logo" className="w-12 h-12 object-contain" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">CISC</h4>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Innovate Today, Lead Tomorrow.</p>
              <p className="text-sm text-slate-500 font-bold leading-relaxed max-w-sm">
                Empowering the next generation of student entrepreneurs at Crescent University to transform ideas into impactful startup solutions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SocialCircle icon={Linkedin} href="#" />
            <SocialCircle icon={Instagram} href="#" />
            <SocialCircle icon={Twitter} href="#" />
          </div>
        </div>

        {/* Info Section */}
        <div className="lg:col-span-4 space-y-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pt-20">Hub Location</p>
          <div className="space-y-4">
            <div className="space-y-1 ">
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Crescent University Campus</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase leading-loose tracking-wider">
                GST Road, Vandalur, Chennai <br />
                Tamil Nadu, India - 600048
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> */}
              {/* <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status: Applications Open</p> */}
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-[2rem] p-8 text-center flex flex-col justify-center gap-4 shadow-sm hover:border-blue-200 transition-colors group">
          <p className="text-xs font-black text-slate-900 uppercase leading-tight tracking-wider">Ready to build <br /> your startup?</p>
          <a href="mailto:cisc@crescent.education" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
            <Mail size={12} />
            Join the Club
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <p>© 2025 Crescent Innovation and Startup Club</p>
          <div className="hidden md:block w-px h-3 bg-slate-200"></div>
          <p className="text-slate-300">Design Thinking • Innovation • Strategy</p>
        </div>
        {/* <p className="flex items-center gap-2 text-blue-600/60">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          E-Cell Ecosystem
        </p> */}
      </div>
    </footer>
  );
};

export default Footer;