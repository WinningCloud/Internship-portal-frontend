import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const CreateInternship = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', roles: '', stipend: '', duration: '', location: 'Remote'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/startup/internship', formData);
      alert('Internship Posted Successfully!');
      navigate('/startup/internships');
    } catch (err) { alert('Error posting internship'); }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Post a New Internship</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input type="text" className="w-full p-2 border rounded-lg" required 
            onChange={(e) => setFormData({...formData, title: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full p-2 border rounded-lg" rows="4" required
            onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Stipend (Monthly)</label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="e.g. 5000 or Unpaid"
              onChange={(e) => setFormData({...formData, stipend: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input type="text" className="w-full p-2 border rounded-lg" placeholder="e.g. 3 Months"
              onChange={(e) => setFormData({...formData, duration: e.target.value})} />
          </div>
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
          Post Internship
        </button>
      </form>
    </div>
  );
};

export default CreateInternship;