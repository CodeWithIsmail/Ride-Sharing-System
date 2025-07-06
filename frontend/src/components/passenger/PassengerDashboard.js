import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const PassengerDashboard = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3002/api/rides', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRides(response.data);
    } catch (error) {
      setError('Failed to fetch rides');
      console.error('Error fetching rides:', error);
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Welcome, {user.name}!
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Post a New Ride
            </h3>
            <p className="text-blue-700 mb-4">
              Need a ride? Post your request and let drivers know where you want to go.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Post Ride Request
            </button>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              My Ride Requests
            </h3>
            <p className="text-green-700 mb-4">
              View and manage your posted ride requests.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
              View My Rides
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          {rides.length === 0 ? (
            <p className="text-gray-500">No ride requests found.</p>
          ) : (
            <div className="space-y-4">
              {rides.map((ride) => (
                <div key={ride.rideRequestId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {ride.pickupLocation} → {ride.dropoffLocation}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Fare: ${ride.desiredFare} | Time: {new Date(ride.targetTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: <span className="capitalize">{ride.status}</span>
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {ride.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard; 