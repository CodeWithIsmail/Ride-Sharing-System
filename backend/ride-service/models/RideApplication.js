const mongoose = require('mongoose');

const rideApplicationSchema = new mongoose.Schema({
  rideRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RideRequest',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Compound index to prevent duplicate applications
rideApplicationSchema.index({ rideRequestId: 1, driverId: 1 }, { unique: true });

module.exports = mongoose.model('RideApplication', rideApplicationSchema); 