import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api"; 

const RideApplications = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDriverDetails = useCallback(async (driverId) => {
    try {
      const response = await api.get(`/users/${driverId}`);
      return response.data; 
    } catch (error) {
      console.error(`Failed to fetch details for driver ${driverId}`, error);
      return { name: "Unknown Driver", phone: "N/A" }; 
    }
  }, []); 
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const appResponse = await axios.get(
          `http://localhost:3002/api/rides/${rideId}/applications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const enrichedApplications = await Promise.all(
          appResponse.data.map(async (app) => {
            const driverInfo = await fetchDriverDetails(app.driverId);
            return {
              ...app, 
              driverInfo, 
            };
          })
        );

        setApplications(enrichedApplications);
      } catch (err) {
        console.error("Failed to fetch ride applications:", err);
        setMessage("Could not load applications for this ride.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [rideId, fetchDriverDetails]); 
  const handleSelectDriver = async (driverId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3002/api/rides/${rideId}/select`,
        { driverId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Driver selected successfully! Your ride is confirmed.");
      setTimeout(() => navigate("/my-rides"), 2500);
    } catch (err) {
      setMessage("Failed to select driver. Please try again.");
      console.error(err);
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading driver applications...</p>;
  }

  return (
    <div className="container mt-5">
      <h2>Driver Applications</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {applications.length > 0 ? (
        <ul className="list-group">
          {applications.map((app) => (
            <li
              key={app._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>Driver:</strong> {app.driverInfo.name} <br />
                <strong>Contact:</strong> {app.driverInfo.phone}
              </div>
              <button
                onClick={() => handleSelectDriver(app.driverId)}
                className="btn btn-primary"
                disabled={!!message} 
              >
                Select Driver
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No drivers have applied for this ride yet.</p>
      )}
    </div>
  );
};

export default RideApplications;
