import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, PlusCircle, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-slate-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="w-6 h-6 text-blue-400" />
          <span className="text-xl font-bold hidden sm:inline">TaskMaster</span>
          <span className="ml-2 sm:ml-4 text-xs bg-slate-700 px-2 py-1 rounded text-gray-300 uppercase tracking-wide">
            {user.role}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {user.role === 'admin' && (
            <>
              <Link to="/admin" className="hover:text-blue-300 transition text-sm sm:text-base">Dashboard</Link>
              <Link to="/add-employee" className="flex items-center space-x-1 hover:text-blue-300 transition text-sm sm:text-base">
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">New Employee</span>
              </Link>
              <Link to="/add-task" className="flex items-center space-x-1 hover:text-blue-300 transition text-sm sm:text-base">
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">New Task</span>
              </Link>
            </>
          )}

          {user.role === 'employee' && (
             <Link to="/employee" className="hover:text-blue-300 transition">My Tasks</Link>
          )}

          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded transition text-sm"
          >
             <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;