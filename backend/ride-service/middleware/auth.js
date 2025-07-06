const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify token with User Service
    const response = await axios.get(`${USER_SERVICE_URL}/api/users/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    req.user = response.data;
    req.token = token;
    next();
  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication service unavailable.' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

module.exports = { auth, requireRole }; 