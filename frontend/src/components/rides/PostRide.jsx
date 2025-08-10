import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PostRide = () => {
  const [rideData, setRideData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    targetTime: "",
    desiredFare: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRideData({ ...rideData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const dataToSend = {
        ...rideData,
        targetTime: new Date(rideData.targetTime).toISOString(),
      };

      await axios.post("http://localhost:3002/api/rides", dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Ride request posted successfully! Redirecting...");
      setTimeout(() => navigate("/my-rides"), 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to post ride. Please check your inputs.";
      setMessage(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-8 offset-md-2">
        <h2>Post a New Ride Request</h2>
        <div className="card p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="pickupLocation" className="form-label">
                Pickup Location
              </label>
              <input
                type="text"
                id="pickupLocation"
                name="pickupLocation"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dropoffLocation" className="form-label">
                Dropoff Location
              </label>
              <input
                type="text"
                id="dropoffLocation"
                name="dropoffLocation"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="targetTime" className="form-label">
                Target Pickup Time
              </label>
              <input
                type="datetime-local"
                id="targetTime"
                name="targetTime"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="desiredFare" className="form-label">
                Desired Fare ($)
              </label>
              <input
                type="number"
                id="desiredFare"
                name="desiredFare"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Post Ride"}
            </button>
            {message && (
              <p
                className={`mt-3 alert ${
                  message.includes("successfully")
                    ? "alert-success"
                    : "alert-danger"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostRide;
