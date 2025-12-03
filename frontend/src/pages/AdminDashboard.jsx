import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Trash2, Search, Filter } from 'lucide-react';

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
      if (searchCode === '') {
        setFilteredTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (searchCode.trim() === '') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(t => 
        (t.employee_code && t.employee_code.toLowerCase().includes(searchCode.toLowerCase())) || 
        (t.employee_name && t.employee_name.toLowerCase().includes(searchCode.toLowerCase()))
      ));
    }
  }, [searchCode, tasks]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    const previousTasks = [...tasks];
    const previousFiltered = [...filteredTasks];

    // Optimistic update
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    setFilteredTasks(prev => prev.filter(t => t.id !== id));

    try {
      await api.delete(`/tasks/${parseInt(id, 10)}`);
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
      setTasks(previousTasks);
      setFilteredTasks(previousFiltered);
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'In Progress' : currentStatus === 'In Progress' ? 'Completed' : 'Pending';
    
    const updatedTasks = tasks.map(t => t.id === id ? {...t, status: newStatus} : t);
    setTasks(updatedTasks);

    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
    } catch (err) {
      alert('Failed to update status');
      fetchTasks();
    }
  };

  if (loading) return <div className="text-center mt-10">Loading tasks...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center space-x-4 border border-gray-200">
        <Filter className="text-gray-400 w-5 h-5" />
        <div className="relative flex-1 max-w-md">
          <input 
            type="text" 
            placeholder="Filter by Employee Code or Name..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Task Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Details
              </th>
               <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Blockers
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
               <tr>
                 <td colSpan="7" className="text-center py-5 text-gray-500">No tasks found matching your criteria.</td>
               </tr>
            ) : (
            filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{task.employee_name}</span>
                    <span className="text-gray-500 text-xs bg-gray-100 px-1 rounded w-fit">#{task.employee_code}</span>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 font-medium whitespace-no-wrap">{task.name}</p>
                  <p className="text-gray-500 text-xs">Est: {task.estimated_effort_hours}h</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm max-w-xs">
                   <div className="text-xs text-gray-500 mb-1">Desc: {task.task_description}</div>
                   <div className="text-xs text-blue-500">Key: {task.key_tasks}</div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex flex-col text-xs space-y-1">
                    <span className="text-gray-600">Start: {task.start_date ? task.start_date.split('T')[0] : '-'}</span>
                    <span className="text-gray-600">End: {task.completion_date ? task.completion_date.split('T')[0] : '-'}</span>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                   {task.blockers && task.blockers !== 'None' ? (
                     <span className="text-red-500 text-xs font-bold">{task.blockers}</span>
                   ) : <span className="text-green-500 text-xs">None</span>}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span
                    onClick={() => handleStatusUpdate(task.id, task.status)}
                    className={`cursor-pointer relative inline-block px-3 py-1 font-semibold leading-tight rounded-full transition select-none
                      ${task.status === 'Completed' ? 'text-green-900 bg-green-200' : 
                        task.status === 'In Progress' ? 'text-orange-900 bg-orange-200' : 'text-red-900 bg-red-200'}`}
                  >
                    <span className="relative text-xs">{task.status}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                  <button
                    onClick={(e) => handleDelete(task.id, e)}
                    className="text-red-600 hover:text-red-900 hover:bg-red-100 p-2 rounded transition"
                    title="Delete Task"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;