const express = require('express');
const axios = require('axios');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';
const RIDE_SERVICE_URL = process.env.RIDE_SERVICE_URL || 'http://ride-service:3002';

// GET /api/admin/users - Get all users
router.get('/users', [
  auth,
  requireRole(['admin'])
], async (req, res) => {
  try {
    // Fetch users from User Service
    const response = await axios.get(`${USER_SERVICE_URL}/api/users/admin/all`, {
      headers: {
        'Authorization': `Bearer ${req.token}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/users/:userId/deactivate - Deactivate user
router.patch('/users/:userId/deactivate', [
  auth,
  requireRole(['admin'])
], async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Call User Service to deactivate user
    const response = await axios.patch(`${USER_SERVICE_URL}/api/users/admin/${userId}/deactivate`, {}, {
      headers: {
        'Authorization': `Bearer ${req.token}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/rides - Get all rides
router.get('/rides', [
  auth,
  requireRole(['admin'])
], async (req, res) => {
  try {
    const { status } = req.query;
    
    // Fetch rides from Ride Service
    const url = status ? `${RIDE_SERVICE_URL}/api/rides/admin/all?status=${status}` : `${RIDE_SERVICE_URL}/api/rides/admin/all`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${req.token}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Get rides error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;