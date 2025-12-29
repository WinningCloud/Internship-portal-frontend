import React from 'react';
import { User, Lock, Bell, Save } from 'lucide-react';

const Settings = () => {
    return (
        <div className="space-y-6 animate-fade-in bg-[#F6F2ED] p-8 min-h-screen">

            {/* Profile Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E7E2DB] overflow-hidden">
                <div className="p-6 border-b border-[#E7E2DB] flex items-center gap-3">
                    <User className="w-5 h-5 text-[#F36B7F]" />
                    <h3 className="font-bold text-gray-800">Profile Information</h3>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                defaultValue="Admin User"
                                className="w-full px-4 py-2 bg-[#fffff]
                                           border border-[#E7E2DB] rounded-lg
                                           focus:ring-2 focus:ring-[#FADADD]
                                           focus:border-[#F36B7F]
                                           outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                defaultValue="admin@ciic.edu"
                                className="w-full px-4 py-2 bg-[#fffff]
                                           border border-[#E7E2DB] rounded-lg
                                           focus:ring-2 focus:ring-[#FADADD]
                                           focus:border-[#F36B7F]
                                           outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                defaultValue="+91 98765 43210"
                                className="w-full px-4 py-2 bg-[#fffff]
                                           border border-[#E7E2DB] rounded-lg
                                           focus:ring-2 focus:ring-[#FADADD]
                                           focus:border-[#F36B7F]
                                           outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Role
                            </label>
                            <input
                                type="text"
                                defaultValue="Super Admin"
                                disabled
                                className="w-full px-4 py-2 bg-[#fffff]
                                           border border-[#E7E2DB] rounded-lg
                                           text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="pt-2 text-right">
                        <button
                            className="flex items-center gap-2 ml-auto px-6 py-2
                                       bg-[#F36B7F] text-white rounded-lg
                                       hover:shadow-lg hover:shadow-[#FADADD]
                                       transition-all"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Password Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E7E2DB] overflow-hidden">
                <div className="p-6 border-b border-[#E7E2DB] flex items-center gap-3">
                    <Lock className="w-5 h-5 text-[#F36B7F]" />
                    <h3 className="font-bold text-gray-800">Change Password</h3>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Current Password', 'New Password', 'Confirm Password'].map((label) => (
                            <div key={label}>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {label}
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 bg-[#fffff]
                                               border border-[#E7E2DB] rounded-lg
                                               focus:ring-2 focus:ring-[#FADADD]
                                               focus:border-[#F36B7F]
                                               outline-none transition-all"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 text-right">
                        <button
                            className="px-6 py-2 border border-[#E7E2DB]
                                       text-gray-700 rounded-lg
                                       hover:bg-[#FADADD]
                                       transition-colors"
                        >
                            Update Password
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E7E2DB] overflow-hidden">
                <div className="p-6 border-b border-[#E7E2DB] flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#F36B7F]" />
                    <h3 className="font-bold text-gray-800">Notification Preferences</h3>
                </div>

                <div className="p-6 space-y-4">
                    {[
                        {
                            title: 'Email Notifications',
                            desc: 'Receive emails about new startup applications.'
                        },
                        {
                            title: 'New Internship Alerts',
                            desc: 'Get notified when a startup posts a new internship.'
                        }
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="flex items-center justify-between p-3
                                       bg-[#fffff] rounded-lg"
                        >
                            <div>
                                <h4 className="text-sm font-medium text-gray-800">
                                    {item.title}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    {item.desc}
                                </p>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div
                                    className="w-11 h-6 bg-[#E7E2DB] rounded-full peer
                                               peer-checked:bg-[#F36B7F]
                                               after:content-['']
                                               after:absolute after:top-[2px] after:left-[2px]
                                               after:bg-white after:rounded-full
                                               after:h-5 after:w-5 after:transition-all
                                               peer-checked:after:translate-x-full"
                                />
                            </label>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Settings;
