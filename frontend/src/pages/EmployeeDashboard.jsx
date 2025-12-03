import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Clock, PlayCircle, CheckCircle, Plus, X, Calendar, AlertTriangle } from 'lucide-react';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newTask, setNewTask] = useState({
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

  const fetchTasks = async () => {
    if (!user?.employee_code) return;
    try {
      const res = await api.get(`/tasks/${user.employee_code}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      alert('Status update failed');
      fetchTasks();
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await api.post('/tasks', {
        ...newTask,
        employee_code: user.employee_code,
        employee_name: user.username,
      });
      
      setNewTask({
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
      setShowAddForm(false);
      fetchTasks();
    } catch (err) {
      alert('Failed to create task');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading your tasks...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          <p className="text-gray-500">Welcome back, {user?.username}.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition text-white font-medium
            ${showAddForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {showAddForm ? <><X className="w-4 h-4"/> <span>Cancel</span></> : <><Plus className="w-4 h-4"/> <span>Add New Task</span></>}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border border-gray-200 p-6 rounded-lg mb-8 shadow-lg animate-fade-in">
          <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Create New Task</h3>
          <form onSubmit={handleCreateTask} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Task Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  value={newTask.name}
                  onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700">Estimated Effort (Hours)</label>
                 <input
                  type="number"
                  className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  value={newTask.estimated_effort_hours}
                  onChange={(e) => setNewTask({...newTask, estimated_effort_hours: Number(e.target.value)})}
                 />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Task Description</label>
              <textarea
                required
                rows="2"
                className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                value={newTask.task_description}
                onChange={(e) => setNewTask({...newTask, task_description: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Key Tasks (Sub-tasks)</label>
              <textarea
                rows="2"
                placeholder="List key deliverables..."
                className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                value={newTask.key_tasks}
                onChange={(e) => setNewTask({...newTask, key_tasks: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Dependency</label>
                <input
                  type="text"
                  className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  value={newTask.dependency}
                  onChange={(e) => setNewTask({...newTask, dependency: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Blockers</label>
                <input
                  type="text"
                  className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  value={newTask.blockers}
                  onChange={(e) => setNewTask({...newTask, blockers: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Assigned Date</label>
                <input
                  type="date"
                  className="mt-1 w-full p-2 border rounded"
                  value={newTask.assigned_date}
                  onChange={(e) => setNewTask({...newTask, assigned_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  className="mt-1 w-full p-2 border rounded"
                  value={newTask.start_date}
                  onChange={(e) => setNewTask({...newTask, start_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Completion Date</label>
                <input
                  type="date"
                  className="mt-1 w-full p-2 border rounded"
                  value={newTask.completion_date}
                  onChange={(e) => setNewTask({...newTask, completion_date: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">
              Submit Task
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{task.name}</h3>
                <p className="text-sm text-gray-500">Effort: {task.estimated_effort_hours} hrs</p>
              </div>
              <span className={`mt-2 md:mt-0 px-3 py-1 text-xs font-bold rounded-full uppercase
                 ${task.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                   task.status === 'In Progress' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                {task.status}
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                    <p className="font-semibold text-gray-700">Description:</p>
                    <p className="text-gray-600">{task.task_description}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-700">Key Tasks:</p>
                    <p className="text-gray-600">{task.key_tasks || 'None'}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded mb-4">
                <div>
                    <span className="block font-bold">Assigned:</span> {task.assigned_date ? task.assigned_date.split('T')[0] : '-'}
                </div>
                <div>
                     <span className="block font-bold">Start:</span> {task.start_date ? task.start_date.split('T')[0] : '-'}
                </div>
                <div>
                     <span className="block font-bold">Completion:</span> {task.completion_date ? task.completion_date.split('T')[0] : '-'}
                </div>
                <div>
                     <span className="block font-bold text-red-400">Blockers:</span> {task.blockers}
                </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
               <button 
                 onClick={() => updateStatus(task.id, 'Pending')}
                 className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600"
               >
                 <Clock className="w-4 h-4" /> <span>Pending</span>
               </button>
               <button 
                 onClick={() => updateStatus(task.id, 'In Progress')}
                 className="flex items-center space-x-1 text-sm text-gray-500 hover:text-orange-600"
               >
                 <PlayCircle className="w-4 h-4" /> <span>Start</span>
               </button>
               <button 
                 onClick={() => updateStatus(task.id, 'Completed')}
                 className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-600"
               >
                 <CheckCircle className="w-4 h-4" /> <span>Complete</span>
               </button>
            </div>
          </div>
        ))}
      </div>
      
      {tasks.length === 0 && !showAddForm && (
        <div className="text-center text-gray-500 mt-10">
          <p>No tasks assigned to you yet.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;