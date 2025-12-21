import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { FileText, CheckCircle } from 'lucide-react';

const ViewApplications = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get(`/startup/internship/${id}/applications`);
        setApplications(res.data);
      } catch (err) { console.error(err); }
    };
    fetchApps();
  }, [id]);

  const handleCertificateUpload = async (appId, file) => {
    const formData = new FormData();
    formData.append('certificate', file);

    try {
      await api.post(`/startup/application/${appId}/certificate`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Certificate Issued Successfully!');
    } catch (err) { alert('Upload failed'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Applications for this Role</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Student Name</th>
              <th className="p-4">Resume</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{app.studentName}</td>
                <td className="p-4 text-blue-600 underline">
                  <a href={app.resumeUrl} target="_blank" rel="noreferrer">View Resume</a>
                </td>
                <td className="p-4">
                  <label className="cursor-pointer bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm border border-emerald-200 hover:bg-emerald-100 transition">
                    Upload Certificate
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handleCertificateUpload(app._id, e.target.files[0])}
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplications;