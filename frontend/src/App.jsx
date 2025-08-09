import React, { useContext } from "react";
import { Routes, Route, Navigate, Router } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AuthContext from "./context/AuthContext";

import PostRide from "./components/rides/PostRide";
import MyRides from "./components/rides/MyRides";
import RideDetails from "./components/rides/RideDetails";
import DriverDashboard from "./components/driver/DriverDashboard";
import AvailableRides from "./components/driver/AvailableRides";
import DriverRides from "./components/driver/DriverRides";

// General PrivateRoute to check for login status
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

// Role-specific route for Drivers
const DriverRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  console.log(user.role);
  return user.role === "driver" ? children : <Navigate to="/unauthorized" />;
};

// Role-specific route for Passengers
const PassengerRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return user.role === "passenger" ? children : <Navigate to="/unauthorized" />;
};

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
  {/* Public Routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/unauthorized" element={
      <div className="text-center mt-5">
          <h2>Unauthorized Access</h2>
          <p>You do not have permission to view this page.</p>
      </div>
  } />


  {/* --- Role Specific Routes --- */}

  {/* Passenger Routes */}
  <Route path="/my-rides" element={<PassengerRoute><MyRides /></PassengerRoute>} />
  <Route path="/post-ride" element={<PassengerRoute><PostRide /></PassengerRoute>} />
  <Route path="/rides/:rideId" element={<PassengerRoute><RideDetails /></PassengerRoute>} />

  {/* Driver Routes */}
  <Route path="/driver/dashboard" element={<DriverRoute><DriverDashboard /></DriverRoute>} />
  <Route path="/driver/rides/available" element={<DriverRoute><AvailableRides /></DriverRoute>} />
  <Route path="/driver/my-rides" element={<DriverRoute><DriverRides /></DriverRoute>} />

  {/* --- The crucial post-login redirector --- */}
  <Route 
    path="/" 
    element={
      <PrivateRoute>
        <HomeRedirect />
      </PrivateRoute>
    } 
  />
</Routes>
      </main>
    </>
  );
}

// A helper component to redirect users based on role after login
const HomeRedirect = () => {
  const { user } = useContext(AuthContext);
  if (user.role === "passenger") return <Navigate to="/my-rides" />;
  if (user.role === "driver") return <Navigate to="/driver/dashboard" />;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" />;
  return null;
};

export default App;
