const mongoose = require('mongoose');

// Order status enum
const OrderStatus = ['Open', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        salePrice: { type: Number, default: 0 },
        discountPercentage: { type: Number, default: 0 },
        inventory: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Inventory',
        },
        orderStatus: {
          type: String,
          enum: OrderStatus,
          default: 'Open',
        },
      },
    ],
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Razorpay',
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    couponApplied: {
      type: Boolean,
      default: false,
    },
    couponCode:{  
      type: String,
      default: '',  
    },
    couponUsageTracked: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
    collection: 'orders',
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
