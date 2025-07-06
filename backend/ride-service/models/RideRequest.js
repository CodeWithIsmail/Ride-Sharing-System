const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema({
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupLocation: {
    type: String,
    required: true,
    trim: true
  },
  dropoffLocation: {
    type: String,
    required: true,
    trim: true
  },
  targetTime: {
    type: Date,
    required: true
  },
  desiredFare: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['posted', 'confirmed', 'completed', 'cancelled'],
    default: 'posted'
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

// Indexes for efficient queries
rideRequestSchema.index({ status: 1 });
rideRequestSchema.index({ passengerId: 1 });
rideRequestSchema.index({ driverId: 1 });
rideRequestSchema.index({ targetTime: 1 });

module.exports = mongoose.model('RideRequest', rideRequestSchema);