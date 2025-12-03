import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { UserPlus, Save } from 'lucide-react';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    employee_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', formData);
      alert('Employee Added Successfully! You can now share these credentials with them.');
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-6 border-t-4 border-green-600">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <UserPlus className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Add New Employee</h2>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Username (for Login)</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="e.g. sarah_j"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="text" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="e.g. secret123"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Employee Code</label>
          <input
            type="text"
            name="employee_code"
            value={formData.employee_code}
            onChange={handleChange}
            placeholder="e.g. EMP005"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">This code is used to track their tasks. Creating a new user with an existing code will allow them to login with new credentials.</p>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Creating...' : 'Create Employee'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;