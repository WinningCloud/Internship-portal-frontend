import React, { useState, useEffect } from 'react';
import { 
    Bell, Send, Trash2, Clock, Loader2, 
    Inbox, ShieldAlert, Zap, History 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosConfig';

const AdminAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const res = await api.get('/ciic/alerts/alerts');
            setAlerts(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error("Alert sync failure");
        } finally {
            setLoading(false);
        }
    };

    const handleSendAlert = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSending(true);
        try {
            await api.post('/ciic/alerts/create-alert', { message });
            setMessage("");
            fetchAlerts();
        } catch (err) {
            alert("Broadcast protocol failed.");
        } finally {
            setIsSending(false);
        }
    };

    const handleDeleteAlert = async (id) => {
        if (!window.confirm("Confirm deletion of this record?")) return;
        try {
            await api.delete(`/ciic/alerts/delete-alert/${id}`);
            setAlerts(alerts.filter(a => a._id !== id));
        } catch (err) {
            alert("Deletion failed.");
        }
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="animate-spin text-[#F36B7F]" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4">Accessing Secure Logs...</p>
        </div>
    );

    return (
        <div className="bg-white min-h-screen p-6 lg:p-10 font-sans">
            
            {/* --- HEADER --- */}
            <div className="max-w-[1600px] mx-auto mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#F36B7F] animate-pulse" />
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic-none">Send alert messages</h2>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">Alerts are directly visible to all startup accounts once they log in</p>
            </div>

            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* --- LEFT: BROADCAST EDITOR --- */}
                <div className="lg:col-span-5">
                    <div className="sticky top-10 space-y-6">
                        <div className="bg-white border border-[#E7E2DB] rounded-[2.5rem] p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-[#F36B7F]">
                                    <Zap size={20} />
                                </div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Enter Message</h3>
                            </div>

                            <form onSubmit={handleSendAlert} className="space-y-6">
                                <div className="group">
                                    {/* <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest ml-1 leading-none group-focus-within:text-[#F36B7F]">
                                        System Message
                                    </label> */}
                                    <div className="relative">
                                        <Bell className="absolute left-5 top-5 w-5 h-5 text-gray-300 group-focus-within:text-[#F36B7F] transition-colors" />
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Type your administrative alert here..."
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-[#E7E2DB] rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-rose-50 focus:border-[#F36B7F] transition-all min-h-[220px] resize-none placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>

                               <button
    type="submit"
    disabled={isSending || !message.trim()}
    className="w-full flex items-center justify-center gap-4 py-5 bg-black rounded-lg border border-white/10 transition-all hover:bg-zinc-900 hover:border-white/20 active:scale-[0.97] disabled:bg-zinc-950 disabled:border-transparent shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] group"
>
    {isSending ? (
        <Loader2 className="animate-spin w-4 h-4 text-white" />
    ) : (
        <Send className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
    )}
    <span className="text-white text-[10px] font-black uppercase tracking-[0.4em] leading-none">
        Publish Message
    </span>
</button>
                            </form>
                        </div>

                        {/* <div className="p-8 bg-slate-50 border border-dashed border-[#E7E2DB] rounded-[2rem]">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                                Warning: Dispatches sent via this console are transmitted instantly to all registered startup partners. Records cannot be edited once broadcast.
                            </p>
                        </div> */}
                    </div>
                </div>

                {/* --- RIGHT: TRANSMISSION LOGS --- */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <History size={18} className="text-slate-300" />
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Previous Alert Logs</h3>
                        </div>
                        <span className="text-[10px] font-black text-[#F36B7F] bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest">
                            {alerts.length} Records
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-4 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {alerts.length > 0 ? (
                                alerts.map((alert, idx) => (
                                    <motion.div
                                        key={alert._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white border border-[#E7E2DB] rounded-3xl p-6 flex items-start justify-between gap-6 hover:border-[#F36B7F] transition-all group shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-start gap-5 flex-1">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 shrink-0 group-hover:text-[#F36B7F] transition-colors border border-transparent group-hover:border-rose-100">
                                                <ShieldAlert size={24} />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[13px] font-bold text-slate-700 leading-relaxed uppercase tracking-tight">
                                                    {alert.message}
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                        <Clock size={12} className="text-slate-300" />
                                                        {new Date(alert.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </div>
                                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                        {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteAlert(alert._id)}
                                            className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="h-96 bg-slate-50 rounded-[3rem] border-2 border-dashed border-[#E7E2DB] flex flex-col items-center justify-center text-center p-10">
                                    <Inbox size={48} className="text-slate-200 mb-4" />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-loose">
                                        System buffers empty.<br /> No broadcast logs detected.
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAlerts;