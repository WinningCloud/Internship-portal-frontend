import React, { useEffect, useState } from "react";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

import ciicLogo from "../../assets/ciiclogo.png";
import crescentLogo from "../../assets/crescentlogo.png";



const images = [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998",
];

const AdminLogin = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden">

            {/* 🔁 BACKGROUND CAROUSEL */}
            {images.map((img, index) => (
                <img
                    key={index}
                    src={img}
                    alt="background"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                />
            ))}

            {/* 🎨 COLOR OVERLAYS */}
            <div className="absolute inset-0 bg-[#F6F2ED]/30"></div>
            <div className="absolute inset-0 bg-[#F6F2ED]/60"></div>

            {/* 🏷️ TOP-LEFT LOGO */}
            <img
                src={ciicLogo}
                alt="CIIC Logo"
                className="absolute top-6 left-6 z-20 w-24 md:w-32 object-contain"
            />

            {/* 🏷️ TOP-RIGHT LOGO */}
            <img
                src={crescentLogo}
                alt="Crescent Logo"
                className="absolute top-6 right-6 z-20 w-24 md:w-32 object-contain"
            />

            {/* 📦 CENTERED LOGIN CARD */}
            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="bg-white w-full max-w-xl min-h-[560px] rounded-2xl shadow-2xl overflow-hidden">

                    {/* HEADER */}
                    <div className="bg-[#F36B7F] p-10 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Internship Portal
                            </h2>
                            <p className="text-white/90 text-sm">
                                Admin Login
                            </p>
                        </div>
                    </div>

                    {/* FORM */}
                    <div className="p-10">
                        <form className="space-y-6">

                            {/* EMAIL */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        className="w-full pl-10 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F36B7F]"
                                        placeholder="admin@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative mt-1">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="password"
                                        className="w-full pl-10 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F36B7F]"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {/* BUTTON */}
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center py-3 rounded-xl text-white font-semibold bg-[#F36B7F] hover:bg-[#f2556b] transition-all duration-300"
                            >
                                Sign in to Dashboard
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </button>
                        </form>

                        {/* FOOTER */}
                        <p className="mt-8 text-center text-xs text-gray-400">
                            © 2024 Internship Portal
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
