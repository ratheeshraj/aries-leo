const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/orderModel");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency || "INR",
      receipt: receipt,
      notes: notes,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send({
        message: "Error creating Razorpay order",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: error.message || "Error creating Razorpay order" });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Update the order
    const order = await Order.findById(orderId);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.razorpayOrderId = razorpayOrderId;
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;

      const updatedOrder = await order.save();

      res.json({
        success: true,
        message: "Payment verified successfully",
        order: updatedOrder,
      });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ message: error.message || "Error verifying payment" });
  }
};

// @desc    Get Razorpay key
// @route   GET /api/payments/get-razorpay-key
// @access  Public
const getRazorpayKey = async (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey,
};
