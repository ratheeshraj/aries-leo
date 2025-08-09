const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    sku: { type: String, required: true },
    barcode: String,

    stockQuantity: { type: Number, default: 0 },
    lowStockThreshold: Number,
    trackInventory: { type: Boolean, default: true },
    status: { type: String, enum: ['inStock', 'outOfStock'] },

    costPrice: Number,
    retailPrice: Number,
    salePrice: Number,
    compareAtPrice: Number,

    weight: Number,
    weightUnit: { type: String, enum: ['kg', 'g', 'lb', 'oz'] },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, enum: ['cm', 'm', 'in'] },
    },

    color: String,
    size: String,

    shippingWeight: Number,

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = { Inventory, inventorySchema }; 