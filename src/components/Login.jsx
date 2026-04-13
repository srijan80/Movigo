import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/movie');
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-sm p-6 space-y-4 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-white">
          Welcome to Movigo
        </h2>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              localStorage.setItem('token', 'guest-token');
              navigate('/movie');
            }}
            className="group relative inline-flex items-center justify-center px-6 py-3 w-full text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <span className="relative flex items-center gap-2">
              Continue as Guest 
              <svg 
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;