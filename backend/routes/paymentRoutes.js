const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/get-razorpay-key', getRazorpayKey);

// Protected routes
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyRazorpayPayment);

module.exports = router;
