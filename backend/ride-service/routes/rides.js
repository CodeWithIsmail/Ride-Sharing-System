const express = require('express');
const { body, validationResult } = require('express-validator');
const RideRequest = require('../models/RideRequest');
const RideApplication = require('../models/RideApplication');
const { auth, requireRole } = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';

// Helper function to get user details
const getUserDetails = async (userId, authToken) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};

// POST /api/rides - Passenger posts a new ride request
router.post('/', [
  auth,
  requireRole(['passenger']),
  body('pickupLocation').trim().notEmpty(),
  body('dropoffLocation').trim().notEmpty(),
  body('targetTime').isISO8601(),
  body('desiredFare').isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pickupLocation, dropoffLocation, targetTime, desiredFare } = req.body;

    const rideRequest = new RideRequest({
      passengerId: req.user.userId,
      pickupLocation,
      dropoffLocation,
      targetTime: new Date(targetTime),
      desiredFare
    });

    await rideRequest.save();

    res.status(201).json({
      rideRequestId: rideRequest._id,
      pickupLocation: rideRequest.pickupLocation,
      dropoffLocation: rideRequest.dropoffLocation,
      targetTime: rideRequest.targetTime,
      desiredFare: rideRequest.desiredFare
    });
  } catch (error) {
    console.error('Create ride request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/rides - Drivers browse available ride requests
router.get('/', [
  auth,
  requireRole(['driver'])
], async (req, res) => {
  try {
    const { status = 'posted' } = req.query;
    
    const rideRequests = await RideRequest.find({ status })
      .sort({ createdAt: -1 });

    const rides = await Promise.all(
      rideRequests.map(async (ride) => {
        const passengerDetails = await getUserDetails(ride.passengerId, req.token);
        return {
          rideRequestId: ride._id,
          pickupLocation: ride.pickupLocation,
          dropoffLocation: ride.dropoffLocation,
          targetTime: ride.targetTime,
          desiredFare: ride.desiredFare,
          passengerId: ride.passengerId,
          passengerName: passengerDetails?.name || 'Unknown'
        };
      })
    );

    res.json(rides);
  } catch (error) {
    console.error('Get rides error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/rides/:rideRequestId/apply - Driver applies to a ride request
router.post('/:rideRequestId/apply', [
  auth,
  requireRole(['driver'])
], async (req, res) => {
  try {
    const { rideRequestId } = req.params;

    // Check if ride request exists and is available
    const rideRequest = await RideRequest.findById(rideRequestId);
    if (!rideRequest) {
      return res.status(404).json({ error: 'Ride request not found' });
    }

    if (rideRequest.status !== 'posted') {
      return res.status(400).json({ error: 'Ride request is not available for applications' });
    }

    // Check if driver already applied
    const existingApplication = await RideApplication.findOne({
      rideRequestId,
      driverId: req.user.userId
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this ride' });
    }

    const application = new RideApplication({
      rideRequestId,
      driverId: req.user.userId
    });

    await application.save();

    res.status(201).json({
      applicationId: application._id,
      rideRequestId: application.rideRequestId,
      driverId: application.driverId
    });
  } catch (error) {
    console.error('Apply to ride error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/rides/:rideRequestId/applications - Passenger views driver applications
router.get('/:rideRequestId/applications', [
  auth,
  requireRole(['passenger'])
], async (req, res) => {
  try {
    const { rideRequestId } = req.params;

    // Check if ride request belongs to the passenger
    const rideRequest = await RideRequest.findById(rideRequestId);
    if (!rideRequest) {
      return res.status(404).json({ error: 'Ride request not found' });
    }

    if (rideRequest.passengerId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const applications = await RideApplication.find({ rideRequestId });

    const applicationsWithDetails = await Promise.all(
      applications.map(async (app) => {
        const driverDetails = await getUserDetails(app.driverId, req.token);
        return {
          applicationId: app._id,
          driverId: app.driverId,
          driverName: driverDetails?.name || 'Unknown',
          driverPhone: driverDetails?.phone || 'Unknown',
          appliedAt: app.appliedAt
        };
      })
    );

    res.json(applicationsWithDetails);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/rides/:rideRequestId/select - Passenger selects a driver
router.post('/:rideRequestId/select', [
  auth,
  requireRole(['passenger']),
  body('driverId').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rideRequestId } = req.params;
    const { driverId } = req.body;

    // Check if ride request exists and belongs to passenger
    const rideRequest = await RideRequest.findById(rideRequestId);
    if (!rideRequest) {
      return res.status(404).json({ error: 'Ride request not found' });
    }

    if (rideRequest.passengerId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (rideRequest.status !== 'posted') {
      return res.status(400).json({ error: 'Ride request is not available for selection' });
    }

    // Check if driver applied to this ride
    const application = await RideApplication.findOne({
      rideRequestId,
      driverId
    });

    if (!application) {
      return res.status(400).json({ error: 'Driver has not applied to this ride' });
    }

    // Update ride request
    rideRequest.driverId = driverId;
    rideRequest.status = 'confirmed';
    await rideRequest.save();

    res.json({
      rideRequestId: rideRequest._id,
      driverId: rideRequest.driverId,
      status: rideRequest.status
    });
  } catch (error) {
    console.error('Select driver error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/rides/:rideRequestId/cancel - Cancel a ride
router.post('/:rideRequestId/cancel', [
  auth
], async (req, res) => {
  try {
    const { rideRequestId } = req.params;

    const rideRequest = await RideRequest.findById(rideRequestId);
    if (!rideRequest) {
      return res.status(404).json({ error: 'Ride request not found' });
    }

    // Check if user is authorized to cancel (passenger or selected driver)
    const isPassenger = rideRequest.passengerId.toString() === req.user.userId;
    const isDriver = rideRequest.driverId && rideRequest.driverId.toString() === req.user.userId;

    if (!isPassenger && !isDriver) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (rideRequest.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed ride' });
    }

    rideRequest.status = 'cancelled';
    await rideRequest.save();

    res.json({
      rideRequestId: rideRequest._id,
      status: rideRequest.status
    });
  } catch (error) {
    console.error('Cancel ride error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/rides/:rideRequestId/complete - Driver marks ride as completed
router.post('/:rideRequestId/complete', [
  auth,
  requireRole(['driver'])
], async (req, res) => {
  try {
    const { rideRequestId } = req.params;

    const rideRequest = await RideRequest.findById(rideRequestId);
    if (!rideRequest) {
      return res.status(404).json({ error: 'Ride request not found' });
    }

    if (rideRequest.driverId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (rideRequest.status !== 'confirmed') {
      return res.status(400).json({ error: 'Ride must be confirmed before completion' });
    }

    rideRequest.status = 'completed';
    await rideRequest.save();

    res.json({
      rideRequestId: rideRequest._id,
      status: rideRequest.status
    });
  } catch (error) {
    console.error('Complete ride error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin endpoint to get all rides
router.get('/admin/all', [
  auth,
  requireRole(['admin'])
], async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const rideRequests = await RideRequest.find(query)
      .sort({ createdAt: -1 });

    const rides = await Promise.all(
      rideRequests.map(async (ride) => {
        const passengerDetails = await getUserDetails(ride.passengerId, req.token);
        const driverDetails = ride.driverId ? await getUserDetails(ride.driverId, req.token) : null;
        
        return {
          rideRequestId: ride._id,
          pickupLocation: ride.pickupLocation,
          dropoffLocation: ride.dropoffLocation,
          targetTime: ride.targetTime,
          desiredFare: ride.desiredFare,
          status: ride.status,
          passengerId: ride.passengerId,
          passengerName: passengerDetails?.name || 'Unknown',
          driverId: ride.driverId,
          driverName: driverDetails?.name || null,
          createdAt: ride.createdAt
        };
      })
    );

    res.json(rides);
  } catch (error) {
    console.error('Get all rides error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 