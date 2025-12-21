import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { Users, Calendar, MapPin, ExternalLink, Loader2 } from 'lucide-react';

const ManageInternships = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const res = await api.get('/startup/internships');
                setInternships(res.data);
            } catch (err) {
                console.error("Failed to fetch internships", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInternships();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-indigo-600 w-10 h-10" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">My Internships</h1>
                <Link 
                    to="/startup/internships/create" 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
                >
                    + Post New Internship
                </Link>
            </div>

            {internships.length === 0 ? (
                <div className="bg-white p-10 rounded-xl text-center border border-dashed border-gray-300">
                    <p className="text-gray-500">You haven't posted any internships yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {internships.map((job) => (
                        <div key={job._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-shadow">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <MapPin size={16} /> {job.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={16} /> {job.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users size={16} /> {job.applicationsCount || 0} Applicants
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0">
                                <Link
                                    to={`/startup/internships/${job._id}/applications`}
                                    className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition"
                                >
                                    View Applications <ExternalLink size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageInternships; // This "default" export fixes your error