import React from 'react';
import { Calendar, Download, FileSpreadsheet } from 'lucide-react';

const Reports = () => {
    return (
        <div className="space-y-6 animate-fade-in bg-[#F6F2ED] p-20 min-h-screen">
            <div className="bg-white p-20 rounded-3xl shadow-sm border border-[#F36B7F] max-w-5xl mx-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Generate Reports
                </h2>

                <p className="text-gray-500 mb-8 border-b border-[#E7E2DB] pb-4">
                    Select the parameters below to generate detailed CSV / Excel reports.
                </p>

                <div className="space-y-6">
                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                From Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-2 bg-[#F6F2ED]
                                               border border-[#E7E2DB] rounded-lg text-sm
                                               focus:ring-2 focus:ring-[#FADADD]
                                               focus:border-[#F36B7F]
                                               outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                To Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-2 bg-[#F6F2ED]
                                               border border-[#E7E2DB] rounded-lg text-sm
                                               focus:ring-2 focus:ring-[#FADADD]
                                               focus:border-[#F36B7F]
                                               outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Startup
                            </label>
                            <select
                                className="w-full px-4 py-2 bg-[#F6F2ED]
                                           border border-[#E7E2DB] rounded-lg text-sm
                                           outline-none focus:border-[#F36B7F]
                                           cursor-pointer"
                            >
                                <option value="">All Startups</option>
                                <option value="1">TechNova Solutions</option>
                                <option value="2">GreenEarth AI</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Department
                            </label>
                            <select
                                className="w-full px-4 py-2 bg-[#F6F2ED]
                                           border border-[#E7E2DB] rounded-lg text-sm
                                           outline-none focus:border-[#F36B7F]
                                           cursor-pointer"
                            >
                                <option value="">All Departments</option>
                                <option value="cse">CSE</option>
                                <option value="it">IT</option>
                            </select>
                        </div>
                    </div>

                    {/* Report Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Report Type
                        </label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="reportType"
                                    defaultChecked
                                    className="w-4 h-4 text-[#F36B7F] focus:ring-[#FADADD]"
                                />
                                <span className="text-sm text-gray-600">
                                    Summary Report
                                </span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="reportType"
                                    className="w-4 h-4 text-[#F36B7F] focus:ring-[#FADADD]"
                                />
                                <span className="text-sm text-gray-600">
                                    Detailed Report
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-4">
                        <button
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                                       bg-[#F36B7F] text-white rounded-lg font-medium
                                       hover:shadow-lg hover:shadow-[#FADADD]
                                       transition-all"
                        >
                            <Download className="w-5 h-5" />
                            Download CSV
                        </button>

                        <button
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                                       bg-[#F2B8C6] text-gray-800 rounded-lg font-medium
                                       hover:bg-[#F36B7F] hover:text-white
                                       hover:shadow-lg hover:shadow-[#FADADD]
                                       transition-all"
                        >
                            <FileSpreadsheet className="w-5 h-5" />
                            Download Excel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
