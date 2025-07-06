import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [availableRides, setAvailableRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailableRides();
  }, []);

  const fetchAvailableRides = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3002/api/rides?status=posted', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableRides(response.data);
    } catch (error) {
      setError('Failed to fetch available rides');
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyToRide = async (rideId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3002/api/rides/${rideId}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh the list
      fetchAvailableRides();
      alert('Application submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to apply to ride');
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
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              Available Rides
            </h3>
            <p className="text-green-700 mb-4">
              Browse and apply to ride requests from passengers.
            </p>
            <button 
              onClick={fetchAvailableRides}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Refresh Rides
            </button>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              My Applications
            </h3>
            <p className="text-blue-700 mb-4">
              Track your ride applications and confirmed rides.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              View Applications
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Available Ride Requests
          </h3>
          {availableRides.length === 0 ? (
            <p className="text-gray-500">No available ride requests at the moment.</p>
          ) : (
            <div className="space-y-4">
              {availableRides.map((ride) => (
                <div key={ride.rideRequestId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {ride.pickupLocation} → {ride.dropoffLocation}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Passenger: {ride.passengerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Fare: ${ride.desiredFare} | Time: {new Date(ride.targetTime).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => applyToRide(ride.rideRequestId)}
                      className="ml-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Apply
                    </button>
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

export default DriverDashboard; 