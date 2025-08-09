// src/components/driver/DriverDashboard.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const DriverDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Welcome, {user?.name}!</h1>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Find Your Next Ride</h5>
              <p className="card-text">
                Browse passenger requests and apply for rides that suit your
                schedule.
              </p>
              <Link to="/driver/rides/available" className="btn btn-primary">
                Browse Available Rides
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Manage Your Rides</h5>
              <p className="card-text">
                Track the status of your applications and manage your confirmed
                and completed rides.
              </p>
              <Link to="/driver/my-rides" className="btn btn-secondary">
                Go to My Rides
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
