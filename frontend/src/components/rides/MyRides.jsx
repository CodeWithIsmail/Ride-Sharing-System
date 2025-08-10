import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const MyRides = () => {
    const { user } = useContext(AuthContext);
    const [postedRides, setPostedRides] = useState([]);
    const [confirmedRides, setConfirmedRides] = useState([]);
    const [completedRides, setCompletedRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAndCategorizeRides = useCallback(async () => {
        if (!user || !user.userId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [postedResponse, confirmedResponse, completedResponse] = await Promise.all([
                axios.get('http://localhost:3002/api/rides?status=posted', { headers }),
                axios.get('http://localhost:3002/api/rides?status=confirmed', { headers }),
                axios.get('http://localhost:3002/api/rides?status=completed', { headers })
            ]);

            const myPosted = postedResponse.data.filter(ride => ride.passengerId === user.userId);
            const myConfirmed = confirmedResponse.data.filter(ride => ride.passengerId === user.userId);
            const myCompleted = completedResponse.data.filter(ride => ride.passengerId === user.userId);

            setPostedRides(myPosted);
            setConfirmedRides(myConfirmed);
            setCompletedRides(myCompleted);
            
        } catch (err) {
            console.error("Failed to fetch rides:", err);
            setError("Could not load your ride history. Please try refreshing the page.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchAndCategorizeRides();
    }, [fetchAndCategorizeRides]);

    if (loading) return <p className="text-center mt-5">Loading your ride history...</p>;
    if (error) return <p className="text-center mt-5 alert alert-danger">{error}</p>;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Ride History</h2>
                <Link to="/post-ride" className="btn btn-primary">Post a New Ride</Link>
            </div>

            {/* Section 1: Posted Rides */}
            <div className="card mb-4">
                <div className="card-header"><h4>Posted (Awaiting Driver Selection)</h4></div>
                <div className="card-body">
                    {postedRides.length > 0 ? (
                        <div className="list-group">
                            {postedRides.map(ride => (
                                <div key={ride.rideRequestId} className="list-group-item">
                                    <h5 className="mb-1">{ride.pickupLocation} to {ride.dropoffLocation}</h5>
                                    <p className="mb-1"><strong>Fare:</strong> ${ride.desiredFare}</p>
                                    <small className="text-muted">Requested for: {new Date(ride.targetTime).toLocaleString()}</small>
                                    <hr />
                                    <Link 
                                        to={`/rides/${ride.rideRequestId}`} 
                                        state={{ ride: ride }}
                                        className="btn btn-sm btn-info"
                                    >
                                        View Applications & Select Driver
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : <p>You have no posted rides awaiting a driver.</p>}
                </div>
            </div>

            {/* Section 2: Confirmed Rides */}
            <div className="card mb-4">
                <div className="card-header"><h4>Confirmed (Driver Selected, Ride Upcoming)</h4></div>
                <div className="card-body">
                    {confirmedRides.length > 0 ? (
                        <div className="list-group">
                            {confirmedRides.map(ride => (
                                <div key={ride.rideRequestId} className="list-group-item">
                                    <h5 className="mb-1">{ride.pickupLocation} to {ride.dropoffLocation}</h5>
                                    <p className="mb-1"><strong>Fare:</strong> ${ride.desiredFare}</p>
                                    {ride.driverName && <p className="mb-1"><strong>Driver:</strong> {ride.driverName}</p>}
                                    <small className="text-muted">Scheduled for: {new Date(ride.targetTime).toLocaleString()}</small>
                                </div>
                            ))}
                        </div>
                    ) : <p>You have no upcoming confirmed rides.</p>}
                </div>
            </div>

            {/* Section 3: Completed Rides */}
            <div className="card">
                <div className="card-header"><h4>Completed</h4></div>
                <div className="card-body">
                    {completedRides.length > 0 ? (
                        <div className="list-group">
                            {completedRides.map(ride => (
                                <div key={ride.rideRequestId} className="list-group-item bg-light">
                                    <h5 className="mb-1">{ride.pickupLocation} to {ride.dropoffLocation}</h5>
                                    <p className="mb-1"><strong>Fare:</strong> ${ride.desiredFare}</p>
                                    {ride.driverName && <p className="mb-1"><strong>Driver:</strong> {ride.driverName}</p>}
                                    <small className="text-muted">Completed on: {new Date(ride.targetTime).toLocaleString()}</small>
                                </div>
                            ))}
                        </div>
                    ) : <p>You have not completed any rides yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default MyRides;