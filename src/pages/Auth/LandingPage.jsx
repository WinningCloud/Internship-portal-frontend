import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import ciscLogo from '/ciscLogo.jpg';
import { 
  Rocket, GraduationCap, Building2, ShieldCheck, 
  ArrowRight, BadgeCheck, Star, ArrowUpRight, 
  ChevronRight, Sparkles
} from 'lucide-react';
import LandingPageFooter from './LandingPageFooter';

// // --- VISIBLE THREE.JS BACKGROUND ---
// const ThreeDBackground = () => {
//   const mountRef = useRef(null);

//   useEffect(() => {
//     let frameId;
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
//     // Antialias for smoothness
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     mountRef.current.appendChild(renderer.domElement);

//     // 1. DYNAMIC PARTICLES (The Constellation)
//     const particlesCount = 400; // Fewer but larger/brighter
//     const particlesGeo = new THREE.BufferGeometry();
//     const posArray = new Float32Array(particlesCount * 3);
    
//     for (let i = 0; i < particlesCount * 3; i++) {
//       posArray[i] = (Math.random() - 0.5) * 8;
//     }
//     particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

//     const particlesMaterial = new THREE.PointsMaterial({
//       size: 0.015,
//       color: '#3b82f6', // Bright Blue
//       transparent: true,
//       opacity: 0.6,
//     });

//     const starField = new THREE.Points(particlesGeo, particlesMaterial);
//     scene.add(starField);

//     // 2. GEOMETRIC SHARDS (Floating 3D Objects)
//     const group = new THREE.Group();
//     const geometry = new THREE.IcosahedronGeometry(0.2, 0); // Geometric Shard
//     const material = new THREE.MeshPhongMaterial({
//       color: '#2563eb',
//       wireframe: true,
//       transparent: true,
//       opacity: 0.2
//     });

//     for (let i = 0; i < 15; i++) {
//       const shard = new THREE.Mesh(geometry, material);
//       shard.position.set(
//         (Math.random() - 0.5) * 6,
//         (Math.random() - 0.5) * 6,
//         (Math.random() - 0.5) * 4
//       );
//       shard.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
//       group.add(shard);
//     }
//     scene.add(group);

//     // 3. LIGHTING (Crucial for 3D visibility)
//     const light = new THREE.DirectionalLight(0xffffff, 1);
//     light.position.set(1, 1, 2);
//     scene.add(light);
//     scene.add(new THREE.AmbientLight(0xffffff, 0.5));

//     camera.position.z = 3;

//     let mouseX = 0;
//     let mouseY = 0;
//     const handleMouseMove = (e) => {
//       mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
//       mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
//     };
//     window.addEventListener('mousemove', handleMouseMove);

//     const animate = () => {
//       frameId = requestAnimationFrame(animate);
      
//       // Auto rotations
//       starField.rotation.y += 0.001;
//       group.rotation.x += 0.002;
//       group.rotation.y += 0.001;

//       // Mouse Lag Effect
//       starField.position.x += (mouseX - starField.position.x) * 0.05;
//       starField.position.y += (-mouseY - starField.position.y) * 0.05;
//       group.position.x += (mouseX - group.position.x) * 0.02;

//       renderer.render(scene, camera);
//     };

//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//     window.addEventListener('resize', handleResize);

//     animate();

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       window.removeEventListener('mousemove', handleMouseMove);
//       cancelAnimationFrame(frameId);
//       if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
//     };
//   }, []);

//   return (
//     <div className="fixed inset-0 -z-10 bg-[#FBFBFE]">
//       {/* The 3D Canvas */}
//       <div ref={mountRef} className="absolute inset-0" />
      
//       {/* Subtle Blue Gradient to ground the scene */}
//       <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 via-transparent to-white pointer-events-none" />
//     </div>
//   );
// };

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* <ThreeDBackground /> */}
      
      {/* --- NAV BAR --- */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3 group">
                {/* <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-500 shadow-lg shadow-slate-200"> */}
                  <img src={ciscLogo} alt="CISC Logo" className="w-9 h-9 object-contain" />
                {/* </div> */}
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tighter uppercase leading-none">CISC <span className="text-blue-600">Portal</span></span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Startup & Innovation Hub</span>
                </div>
              </Link>
              
              <div className="hidden md:flex items-center gap-6">
                {['Impact', 'Pathways', 'Milestones'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/login/admin')} className="hidden sm:block px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                Admin
              </button>
              <button 
                onClick={() => document.getElementById('pathways').scrollIntoView({ behavior: 'smooth' })}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-blue-500/10 transition-all active:scale-95"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest mb-8">
                <Sparkles size={12} /> Innovate Today, Lead Tomorrow
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.85] uppercase mb-8">
                Build the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Future.</span>
              </h1>
              <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-10">
                The official **Crescent Innovation and Startup Club** engine. Connecting ambitious builders to elite startup opportunities.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button onClick={() => navigate('/login/student')} className="group w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                  Find Internships <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate('/login/startup')} className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center">
                  Hire Builders
                </button>
              </div>
            </motion.div>

            <motion.div style={{ y: y1 }} className="relative hidden lg:block">
              <div className="relative z-10 bg-white/40 backdrop-blur-3xl border border-white/60 p-2 rounded-[3rem] shadow-2xl">
                <img src="https://illustrations.popsy.co/white/product-launch.svg" alt="Launch Illustration" className="w-full h-auto drop-shadow-2xl" />
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-6 -right-6 bg-white border border-slate-100 p-6 rounded-3xl shadow-xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <BadgeCheck size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">CISC Verified</p>
                    <p className="text-sm font-bold text-slate-900 uppercase">Top Talent</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section id="impact" className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[2.5rem] p-12 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.2)_0%,transparent_50%)]"></div>
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatItem value="2.5k+" label="Active Builders" />
              <StatItem value="150+" label="Partner Startups" />
              <StatItem value="85%" label="Placement Rate" />
              <StatItem value="₹40Cr+" label="Founder Funding" />
            </div>
          </div>
        </div>
      </section>

      {/* --- PATHWAY SELECTION --- */}
      <section id="pathways" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">Ecosystem Access</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Pick Your Journey</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BentoCard icon={GraduationCap} title="Students" desc="Access high-growth startup roles and build your professional proof-of-work." btn="Student Portal" onClick={() => navigate('/login/student')} theme="blue" />
            <BentoCard icon={Building2} title="Founders" desc="Scale your team with vetted talent from Crescent's most innovative minds." btn="Founder Portal" onClick={() => navigate('/login/startup')} theme="dark" />
            <BentoCard icon={ShieldCheck} title="Moderators" desc="Oversee the ecosystem, verify listings, and ensure institutional excellence." btn="Admin Access" onClick={() => navigate('/login/admin')} theme="white" />
          </div>
        </div>
      </section>

      {/* --- MILESTONES --- */}
      <section id="milestones" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-20">
          <div className="lg:col-span-5 space-y-8">
            <div className="w-16 h-1 bg-blue-600"></div>
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Driving <br /> Innovation.</h3>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              CISC is an accelerator for your career. We track every success to build a legacy of student entrepreneurship.
            </p>
            <div className="pt-4 flex items-center gap-4">
                <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => <img key={i} className="w-10 h-10 rounded-full border-2 border-white" src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" />)}
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined by 400+ builders</p>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <MilestoneRow date="2025 Q1" title="Global Networking" desc="Connected CISC members with mentors from Silicon Valley." />
            <MilestoneRow date="2024 Q4" title="Incubation Drive" desc="12 student startups received pre-seed support from CIIC." />
            <MilestoneRow date="2024 Q3" title="Portal Launch" desc="Centralized the internship process for the entire university." />
          </div>
        </div>
      </section>

      <LandingPageFooter />
    </div>
  );
};

/* --- SHARED COMPONENTS --- */

const StatItem = ({ value, label }) => (
  <div>
    <h4 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">{value}</h4>
    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">{label}</p>
  </div>
);

const BentoCard = ({ icon: Icon, title, desc, btn, onClick, theme }) => {
  const themes = {
    blue: "bg-blue-600 text-white shadow-blue-200",
    dark: "bg-slate-900 text-white shadow-slate-200",
    white: "bg-white text-slate-900 border border-slate-100 shadow-xl"
  };
  return (
    <motion.div whileHover={{ y: -10 }} className={`${themes[theme]} p-10 rounded-[2.5rem] flex flex-col h-full shadow-2xl group transition-all`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-10 ${theme === 'white' ? 'bg-slate-900 text-white' : 'bg-white/20 text-white'}`}>
        <Icon size={28} />
      </div>
      <h4 className="text-2xl font-black uppercase tracking-tight mb-4">{title}</h4>
      <p className={`text-sm font-medium leading-relaxed mb-12 ${theme === 'white' ? 'text-slate-500' : 'opacity-80'}`}>{desc}</p>
      <button onClick={onClick} className={`mt-auto w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 ${theme === 'white' ? 'bg-slate-900 text-white hover:bg-blue-600' : 'bg-white text-slate-900 hover:bg-slate-100'}`}>
        {btn} <ChevronRight size={14} />
      </button>
    </motion.div>
  );
};

const MilestoneRow = ({ date, title, desc }) => (
  <div className="group flex items-center gap-8 p-6 rounded-3xl hover:bg-white transition-all duration-300 border border-transparent hover:border-slate-100">
    <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-lg uppercase tracking-widest whitespace-nowrap">{date}</div>
    <div>
      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{title}</h4>
      <p className="text-xs font-bold text-slate-400 uppercase mt-1">{desc}</p>
    </div>
    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight className="text-slate-300" size={20} /></div>
  </div>
);

export default LandingPage;