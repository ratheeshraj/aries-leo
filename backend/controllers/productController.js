const path = require("path");
const { Storage } = require("@google-cloud/storage");
const { Product, productSchema } = require("../models/productModel");
const {
  getBbifyProductModel,
  getBbifyInventoryModel,
  getBbifyCategoryModel,
  getBbifyDiscountModel,
} = require("../config/db");

const generateSignedUrl = async (urlOrKey) => {
  const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_KEYFILE_PATH,
  });

  let key = urlOrKey;
  const bucket = storage.bucket("creatives-store-data");
  if (key.startsWith("https://storage.googleapis.com/")) {
    const parts = key.split("/");
    key = parts.slice(4).join("/"); // skip https: , '', storage.googleapis.com, bucket-name
  }

  const [url] = await bucket.file(key).getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
  });

  return url;
};

const generateSignedVariants = async (originalKey) => {
  const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_KEYFILE_PATH,
  });

  const bucket = storage.bucket("creatives-store-data");

  const ext = path.extname(originalKey); // .jpg
  const base = originalKey.slice(0, -ext.length);

  const variants = {
    original: originalKey,
    thumb: `${base}-thumb${ext}`,
    medium: `${base}-medium${ext}`,
  };

  const signed = {};

  for (const [key, value] of Object.entries(variants)) {
    const [signedUrl] = await bucket.file(value).getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 48 * 60 * 60 * 1000,
    });
    signed[key] = signedUrl;
  }

  return signed;
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public

const getProducts = async (req, res) => {
  try {
    const ProductBbify = getBbifyProductModel();
    const InventoryBbify = getBbifyInventoryModel();
    const CategoryBbify = getBbifyCategoryModel();
    const DiscountBbify = getBbifyDiscountModel();

    const businessId = "68905add43720ae25de1b80a";

    // Fetch products, inventories, and categories for the specific business
    const [products, inventories, categories, discounts] = await Promise.all([
      ProductBbify.find({ business: businessId, isActive: true, isDeleted: false }).sort({
        createdAt: -1,
      }),
      InventoryBbify.find({ business: businessId, isDeleted: false }),
      CategoryBbify.find({ business: businessId, isActive: true, isDeleted: false }).select("name"),
      DiscountBbify.find({ business: businessId, isActive: true, isDeleted: false }),
    ]);

    // Process images for signed URLs
    // const processedProducts = await Promise.all(
    //   products.map(async (product) => {
    //     const productObj = product.toObject ? product.toObject() : product;
    //     if (productObj.images && Array.isArray(productObj.images)) {
    //       productObj.images = await Promise.all(
    //         productObj.images.map((image) => generateSignedUrl(image))
    //       );
    //     }
    //     return productObj;
    //   })

    const processedProducts = await Promise.all(
      products.map(async (product) => {
        if (Array.isArray(product.images)) {
          product.images = await Promise.all(
            product.images
              .filter((img) => typeof img === "object" && typeof img.original === "string")
              .map((img) => generateSignedVariants(img.original))
          );
        }
        return product;
      })
    );

    res.json({
      products: processedProducts,
      categories,
      inventories,
      discounts,
    });
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// @desc    Fetch featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const ProductBbify = getBbifyProductModel();
    const products = await ProductBbify.find({ featured: true }).limit(6);
    res.json(products);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch new arrivals
// @route   GET /api/products/new
// @access  Public
const getNewProducts = async (req, res) => {
  try {
    const ProductBbify = getBbifyProductModel();
    const products = await ProductBbify.find({ isNew: true }).limit(6);
    res.json(products);
  } catch (error) {
    console.error("Error fetching new products:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const ProductBbify = getBbifyProductModel();
    const InventoryBbify = getBbifyInventoryModel();
    const CategoryBbify = getBbifyCategoryModel();
    const product = await ProductBbify.findById(req.params.id);
    const inventory = await InventoryBbify.find({ product: req.params.id });
    const categories = await CategoryBbify.find({
      _id: product.category,
    }).select("name");

    if (Array.isArray(product.images)) {
      product.images = await Promise.all(
        product.images
          .filter((img) => typeof img === "object" && typeof img.original === "string")
          .map((img) => generateSignedVariants(img.original))
      );
    }

    if (product) {
      res.json({
        data: {
          product,
          inventory,
          categories,
        },
      });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(404).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      category,
      countInStock,
      material,
      colors,
      dimensions,
      featured,
      isNew,
      discountPercentage,
    } = req.body;

    const product = new Product({
      name,
      price,
      user: req.user._id,
      images: images || ["/images/sample.jpg"],
      category,
      countInStock,
      description,
      material,
      colors,
      dimensions,
      featured: featured || false,
      isNew: isNew || false,
      discountPercentage: discountPercentage || 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      category,
      countInStock,
      material,
      colors,
      dimensions,
      featured,
      isNew,
      discountPercentage,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.images = images || product.images;
      product.category = category || product.category;
      product.countInStock = countInStock || product.countInStock;
      product.material = material || product.material;
      product.colors = colors || product.colors;
      product.dimensions = dimensions || product.dimensions;
      product.featured = featured !== undefined ? featured : product.featured;
      product.isNew = isNew !== undefined ? isNew : product.isNew;
      product.discountPercentage = discountPercentage || product.discountPercentage;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(404).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getNewProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
