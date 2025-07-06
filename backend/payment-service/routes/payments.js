const express = require('express');
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST /api/payments/:rideRequestId - Record cash payment
router.post('/:rideRequestId', [
  auth,
  body('amount').isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rideRequestId } = req.params;
    const { amount } = req.body;

    const payment = new Payment({
      rideRequestId,
      amount,
      status: 'completed'
    });

    await payment.save();

    res.status(201).json({
      paymentId: payment._id,
      rideRequestId: payment.rideRequestId,
      amount: payment.amount,
      status: payment.status
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/payments/:paymentId/receipt - Generate receipt
router.post('/:paymentId/receipt', auth, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    payment.receiptSentAt = new Date();
    await payment.save();

    res.json({
      paymentId: payment._id,
      receiptSentAt: payment.receiptSentAt
    });
  } catch (error) {
    console.error('Generate receipt error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 