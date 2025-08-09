/* eslint-disable no-unused-vars */
// src/components/driver/DriverRides.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const DriverRides = () => {
    const { user } = useContext(AuthContext);
    const [pendingRides, setPendingRides] = useState([]);
    const [confirmedRides, setConfirmedRides] = useState([]);
    const [completedRides, setCompletedRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchMyRides = async () => {
        if (!user || !user.userId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [allRidesResponse, postedRidesResponse] = await Promise.all([
                axios.get("http://localhost:3002/api/rides", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("http://localhost:3002/api/rides?status=posted", { headers: { Authorization: `Bearer ${token}` } })
            ]);
            
            const allRides = allRidesResponse.data;
            const postedRides = postedRidesResponse.data;

            // --- Correctly categorize all rides ---
            const myConfirmed = allRides.filter(ride => ride.driverId === user.userId && ride.status === 'confirmed');
            const myCompleted = allRides.filter(ride => ride.driverId === user.userId && ride.status === 'completed');
            setConfirmedRides(myConfirmed);
            setCompletedRides(myCompleted);

            const applicationChecks = postedRides.map(async (ride) => {
                try {
                    const appsResponse = await axios.get(`http://localhost:3002/api/rides/${ride.rideRequestId}/applications`, { headers: { Authorization: `Bearer ${token}` } });
                    const hasApplied = appsResponse.data.some(app => app.driverId === user.userId);
                    return hasApplied ? ride : null;
                } catch (error) {
                    return null;
                }
            });
            const myPendingApplications = (await Promise.all(applicationChecks)).filter(Boolean);
            setPendingRides(myPendingApplications);

        } catch (err) {
            console.error(err);
            setMessage("Could not fetch your rides.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRides();
    }, [user]);

    const handleComplete = async (rideId) => {
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3002/api/rides/${rideId}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage("Ride marked as complete! The list will refresh.");
            // Refresh the lists to move the ride from "Confirmed" to "Completed"
            setTimeout(fetchMyRides, 1500); 
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to complete ride.');
        }
    };

    if (loading) return <p className="text-center mt-5">Loading your rides data...</p>;

    return (
        <div className="container mt-5">
            <h2>My Rides Management</h2>
            {message && <div className="alert alert-info mt-3">{message}</div>}

            {/* PENDING APPLICATIONS SECTION */}
            <div className="card mt-4">
                <div className="card-header"><h4>My Applications</h4></div>
                <div className="card-body">
                    {pendingRides.length > 0 ? (
                        <ul className="list-group">
                            {pendingRides.map((ride) => (
                                <li key={ride.rideRequestId} className="list-group-item">
                                    <h5 className="mb-1">{ride.pickupLocation} to {ride.dropoffLocation}</h5>
                                    <p className="mb-1"><strong>Fare:</strong> ${ride.desiredFare}</p>
                                    <p className="mb-1"><strong>Passenger:</strong> {ride.passengerName}</p>
                                    <small className="text-muted">Requested for: {new Date(ride.targetTime).toLocaleString()}</small>
                                </li>
                            ))}
                        </ul>
                    ) : <p>You have no applications.</p>}
                </div>
            </div>

            {/* CONFIRMED RIDES SECTION */}
            {/* <div className="card mt-4">
                <div className="card-header"><h4>Confirmed Rides (Your Jobs)</h4></div>
                <div className="card-body">
                    {confirmedRides.length > 0 ? (
                        <ul className="list-group">
                            {confirmedRides.map((ride) => (
                                <li key={ride.rideRequestId} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-1">{ride.pickupLocation} to {ride.dropoffLocation}</h5>
                                        <p className="mb-1"><strong>Fare:</strong> ${ride.desiredFare}</p>
                                        <p className="mb-1"><strong>Passenger:</strong> {ride.passengerName}</p>
                                        <small className="text-muted">Scheduled for: {new Date(ride.targetTime).toLocaleString()}</small>
                                    </div>
                                    <button className="btn btn-primary" onClick={() => handleComplete(ride.rideRequestId)}>Mark as Completed</button>
                                </li>
                            ))}
                        </ul>
                    ) : <p>You have no confirmed rides scheduled.</p>}
                </div>
            </div> */}

            {/* COMPLETED RIDES SECTION */}
            {/* <div className="card mt-5">
                <div className="card-header"><h4>Ride History (Completed)</h4></div>
                <div className="card-body">
                    {completedRides.length > 0 ? (
                        <ul className="list-group">
                            {completedRides.map((ride) => (
                                <li key={ride.rideRequestId} className="list-group-item bg-light">
                                    <h5 className="mb-1">{ride.pickupLocation} to {ride.dropoffLocation}</h5>
                                    <p className="mb-1"><strong>Fare:</strong> ${ride.desiredFare}</p>
                                    <p className="mb-1"><strong>Passenger:</strong> {ride.passengerName}</p>
                                    <small className="text-muted">Completed on: {new Date(ride.targetTime).toLocaleString()}</small>
                                </li>
                            ))}
                        </ul>
                    ) : <p>You have not completed any rides yet.</p>}
                </div>
            </div> */}
        </div>
    );
};

export default DriverRides;