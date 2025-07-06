import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PassengerDashboard from './components/passenger/PassengerDashboard';
import DriverDashboard from './components/driver/DriverDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/login" />} />
            <Route 
              path="/" 
              element={
                user ? (
                  user.role === 'passenger' ? <PassengerDashboard /> :
                  user.role === 'driver' ? <DriverDashboard /> :
                  user.role === 'admin' ? <AdminDashboard /> :
                  <Navigate to="/login" />
                ) : <Navigate to="/login" />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;