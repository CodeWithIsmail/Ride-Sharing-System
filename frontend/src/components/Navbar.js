import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">Ride Sharing System</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">
                  Welcome, {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <span className="text-gray-500">Please log in</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 