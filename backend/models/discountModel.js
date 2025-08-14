const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
      sparse: true, // Allows for unique index on null values
      index: true,
    },
    type: {
      type: String,
      enum: Object.values({
        ACTIVE: "active",
        INACTIVE: "inactive",
        EXPIRED: "expired",
      }),
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    minPurchaseAmount: {
      type: Number,
      min: 0,
    },
    maxDiscountAmount: {
      type: Number,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values({
        ACTIVE: "active",
        INACTIVE: "inactive",
        EXPIRED: "expired",
      }),
      default: "active",
    },
    usageLimit: {
      type: Number,
      min: 0,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: { type: Date, default: null },
    isAuto: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Discount = mongoose.model("Discount", discountSchema);

module.exports = { Discount, discountSchema };
