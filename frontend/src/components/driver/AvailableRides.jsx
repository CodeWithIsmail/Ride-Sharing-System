// src/components/driver/AvailableRides.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const AvailableRides = () => {
    const { user } = useContext(AuthContext);
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user || !user.userId) {
            setLoading(false);
            return;
        }

        const fetchAndProcessRides = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                
                // Step 1: Get all available rides.
                const postedRidesResponse = await axios.get('http://localhost:3002/api/rides?status=posted', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const postedRides = postedRidesResponse.data;

                // Step 2: For each ride, check if the current driver has applied.
                // We use Promise.all to run all these checks concurrently for better performance.
                const processedRides = await Promise.all(
                    postedRides.map(async (ride) => {
                        try {
                            const applicationsResponse = await axios.get(`http://localhost:3002/api/rides/${ride.rideRequestId}/applications`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            
                            // Step 3: Check if the driver's ID is in the list of applicants.
                            const hasApplied = applicationsResponse.data.some(
                                (app) => app.driverId === user.userId
                            );
                            
                            // Return a new object with the 'hasApplied' status.
                            return { ...ride, hasApplied };

                        } catch (error) {
                            console.error("Error fetching applications:", error);
                            // If fetching applications fails (e.g., 404 for a ride with no applications),
                            // we can safely assume the current driver has not applied.
                            return { ...ride, hasApplied: false };
                        }
                    })
                );

                // Step 4: Set the final, augmented list into state.
                setRides(processedRides);

            } catch (err) {
                console.error("Failed to fetch or process rides:", err);
                setMessage('Could not load available rides.');
            } finally {
                setLoading(false);
            }
        };

        fetchAndProcessRides();
    }, [user]);

    const handleApply = async (rideId) => {
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3002/api/rides/${rideId}/apply`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(`Successfully applied for the ride!`);

            // Update the UI immediately for instant feedback, without a full reload.
            setRides(currentRides =>
                currentRides.map(ride =>
                    ride.rideRequestId === rideId ? { ...ride, hasApplied: true } : ride
                )
            );
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to apply.');
            console.error(err);
        }
    };

    if (loading) return <p className="text-center mt-5">Processing available rides...</p>;

    return (
        <div className="container mt-5">
            <h2>Available Ride Requests</h2>
            {message && <div className="alert alert-info mt-3">{message}</div>}
            <div className="list-group mt-3">
                {rides.length > 0 ? rides.map((ride) => (
                    <div key={ride.rideRequestId} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="mb-1">{ride.pickupLocation} to {ride.dropoffLocation}</h5>
                            <p className="mb-1">Passenger: {ride.passengerName}</p>
                            <p className="mb-1">Fare: <strong>${ride.desiredFare}</strong></p>
                            <small>Requested Time: {new Date(ride.targetTime).toLocaleString()}</small>
                        </div>
                        <button
                            className={`btn ${ride.hasApplied ? 'btn-secondary' : 'btn-success'}`}
                            onClick={() => handleApply(ride.rideRequestId)}
                            disabled={ride.hasApplied}
                        >
                            {ride.hasApplied ? 'Applied' : 'Apply'}
                        </button>
                    </div>
                )) : (
                    <div className="text-center p-4 border rounded mt-3">
                        <p className="mb-0">No new ride requests at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvailableRides;