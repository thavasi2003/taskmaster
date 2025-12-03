import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Info, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/login', { username, password });
      const data = res.data;
      
      login(data.token, data.user);
      
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      console.error(err);
      let errorMessage = 'Login failed.';
      
      if (err.response) {
        // Server responded with a status code (e.g., 401, 404, 500)
        errorMessage = err.response.data?.message || `Server Error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response (Network Error)
        errorMessage = 'Cannot connect to server. Is the backend running on port 5000?';
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 -mt-16">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-blue-600">
        {/* <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Task Manager</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Enter your credentials to access the portal</p>
        
        Demo Credentials Box
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6 text-sm text-blue-800">
          <div className="flex items-center gap-2 mb-2 font-semibold">
            <Info className="w-4 h-4" />
            <span>Default Credentials:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="font-bold">Admin:</p>
              <p>User: <code className="bg-blue-100 px-1 rounded">admin</code></p>
              <p>Pass: <code className="bg-blue-100 px-1 rounded">admin@123</code></p>
            </div>
            <div>
              <p className="font-bold">Employee:</p>
              <p>User: <code className="bg-blue-100 px-1 rounded">employee1</code></p>
              <p>Pass: <code className="bg-blue-100 px-1 rounded">123456</code></p>
            </div>
          </div>
        </div> */}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Login Failed</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-2.5 px-4 rounded-lg transition duration-200 
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;