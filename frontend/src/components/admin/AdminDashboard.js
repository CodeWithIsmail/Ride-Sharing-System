import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch users and rides (simplified for now)
      setUsers([]);
      setRides([]);
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Admin Dashboard - Welcome, {user.name}!
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Active Rides</h3>
            <p className="text-3xl font-bold text-green-600">{rides.filter(r => r.status === 'confirmed').length}</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Completed Rides</h3>
            <p className="text-3xl font-bold text-purple-600">{rides.filter(r => r.status === 'completed').length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">User Management</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">User management features will be implemented here.</p>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Manage Users
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ride Monitoring</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Ride monitoring features will be implemented here.</p>
              <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                Monitor Rides
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;