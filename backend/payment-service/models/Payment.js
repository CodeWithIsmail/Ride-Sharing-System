const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  rideRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RideRequest',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    default: 'cash',
    enum: ['cash']
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  receiptSentAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

// Indexes for efficient queries
paymentSchema.index({ rideRequestId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Payment', paymentSchema); 