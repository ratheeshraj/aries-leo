const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    shortDescription: String,
    brand: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategory: String,
    tags: [String],
    productType: String,
    vendor: String,

    requiresShipping: { type: Boolean, default: true },
    shippingClass: String,
    taxable: { type: Boolean, default: true },
    taxClass: String,

    hasVariants: { type: Boolean, default: false },
    images: [
      {
        original: { type: String, required: true },
        thumb: { type: String, required: true },
        medium: { type: String, required: true },
      },
    ],
    videos: [String],

    isActive: { type: Boolean, default: true },
    isVisible: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },

    warranty: String,
    material: String,
    ageGroup: String,
    condition: String,
    originCountry: String,
    manufacturer: String,
    modelNumber: String,

    costPrice: Number,
    retailPrice: Number,
    compareAtPrice: Number,
    salePrice: Number,

    launchDate: String,
    discontinueDate: String,
    customFields: mongoose.Schema.Types.Mixed,

    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = { Product, productSchema };
