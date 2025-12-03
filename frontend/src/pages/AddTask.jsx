import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Save } from 'lucide-react';

const AddTask = () => {
  const [formData, setFormData] = useState({
    employee_code: '',
    employee_name: '',
    name: '', 
    task_description: '', 
    assigned_date: new Date().toISOString().split('T')[0],
    key_tasks: '',
    dependency: '',
    estimated_effort_hours: 0,
    status: 'Pending',
    start_date: '',
    completion_date: '',
    blockers: 'None'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/tasks', formData);
      navigate('/admin');
    } catch (err) {
      alert('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Assign New Task (Admin)</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employee Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Employee Code</label>
            <input
              type="text"
              name="employee_code"
              value={formData.employee_code}
              onChange={handleChange}
              placeholder="e.g. EMP001"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Employee Name</label>
            <input
              type="text"
              name="employee_name"
              value={formData.employee_name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Task Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-gray-700 font-medium mb-2">Task Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
             <div>
                <label className="block text-gray-700 font-medium mb-2">Estimated Hours</label>
                <input
                    type="number"
                    name="estimated_effort_hours"
                    value={formData.estimated_effort_hours}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            name="task_description"
            value={formData.task_description}
            onChange={handleChange}
            rows="3"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
            <label className="block text-gray-700 font-medium mb-2">Key Tasks</label>
            <textarea
                name="key_tasks"
                value={formData.key_tasks}
                onChange={handleChange}
                rows="2"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-700 font-medium mb-2">Dependency</label>
                <input
                    type="text"
                    name="dependency"
                    value={formData.dependency}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                />
            </div>
             <div>
                <label className="block text-gray-700 font-medium mb-2">Blockers</label>
                <input
                    type="text"
                    name="blockers"
                    value={formData.blockers}
                    onChange={handleChange}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-gray-700 font-medium mb-2">Assigned Date</label>
                <input
                    type="date"
                    name="assigned_date"
                    value={formData.assigned_date}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>
             <div>
                <label className="block text-gray-700 font-medium mb-2">Completion Date</label>
                <input
                    type="date"
                    name="completion_date"
                    value={formData.completion_date}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving...' : 'Assign Task'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;