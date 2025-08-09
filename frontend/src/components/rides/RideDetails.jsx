// src/components/rides/RideDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const RideDetails = () => {
    const { rideId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // The ride data passed from the MyRides page
    const ride = location.state?.ride; 

    const [applications, setApplications] = useState([]);
    const [isRidePosted, setIsRidePosted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // If the user navigates here directly, the ride object won't exist.
        if (!ride) {
            setLoading(false);
            return;
        }

        const checkApplications = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                // We attempt to fetch applications for the ride.
                const response = await axios.get(`http://localhost:3002/api/rides/${rideId}/applications`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // If the API call succeeds, the ride is 'posted' and we have applications.
                setApplications(response.data);
                setIsRidePosted(true);

            } catch (err) {
                // If the API call fails (e.g., 404), it means the ride is no longer posted.
                // This is expected for 'confirmed' or 'completed' rides.
                console.log("Could not fetch applications, ride is likely confirmed or completed.", err.response?.data);
                setIsRidePosted(false);
            } finally {
                setLoading(false);
            }
        };

        checkApplications();
    }, [ride, rideId]);

    const handleSelectDriver = async (driverId) => {
        setMessage('Confirming driver...');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3002/api/rides/${rideId}/select`, { driverId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Driver selected successfully! This ride is now confirmed.');
            // After selection, the application list is no longer relevant for this view.
            setIsRidePosted(false); 
        } catch (err) {
            setMessage('Failed to select driver. Please try again.');
            console.error(err);
        }
    };

    // Handle the case where a user might land on this page without ride data
    if (!ride) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    <strong>Error:</strong> No ride data found. Please go back to the "My Rides" list and click on a ride to see its details.
                </div>
                <button onClick={() => navigate('/my-rides')} className="btn btn-secondary">Back to My Rides</button>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header">
                    <h3>Ride Details</h3>
                </div>
                <div className="card-body">
                    <h5 className="card-title">{ride.pickupLocation} to {ride.dropoffLocation}</h5>
                    <p className="card-text"><strong>Fare:</strong> ${ride.desiredFare}</p>
                    <p className="card-text"><strong>Time:</strong> {new Date(ride.targetTime).toLocaleString()}</p>
                    <p className="text-muted">Status: <strong>{isRidePosted ? 'Awaiting Driver Selection' : 'Driver Confirmed or Completed'}</strong></p>
                </div>
            </div>

            {message && <div className="alert alert-info mt-3">{message}</div>}

            {loading ? <p className="mt-3">Loading applications...</p> : (
                isRidePosted && (
                    <div className="card mt-4">
                        <div className="card-header"><h4>Driver Applications</h4></div>
                        <div className="card-body">
                            {applications.length > 0 ? (
                                <ul className="list-group">
                                    {applications.map(app => (
                                        <li key={app.applicationId} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Driver:</strong> {app.driverName} <br/>
                                                <strong>Contact:</strong> {app.driverPhone}
                                            </div>
                                            <button onClick={() => handleSelectDriver(app.driverId)} className="btn btn-sm btn-success" disabled={!!message}>
                                                Select & Confirm
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (<p>No drivers have applied for this ride yet.</p>)}
                        </div>
                    </div>
                )
            )}
            
            <button onClick={() => navigate('/my-rides')} className="btn btn-secondary mt-4">Back to My Rides</button>
        </div>
    );
};

export default RideDetails;