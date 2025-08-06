const { getBbifyCategoryModel } = require("../config/db");

// @desc    Get all silk collections
// @route   GET /api/categories/silk-collections
// @access  Public
const getSilkCollections = async (req, res) => {
  try {
    const CategoryBbify = getBbifyCategoryModel();
    const businessId = "68905add43720ae25de1b80a";
    const silkCollections = await CategoryBbify.find({
      business: businessId,
      isDeleted: false,
      isActive:true
    }).select("name description");
    res.json(silkCollections);
  } catch (error) {
    console.error("Error in getSilkCollections:", error);
    res.status(500).json({ message: "Failed to fetch silk collections" });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getAllCategories = async (req, res) => {
  try {
    const CategoryBbify = getBbifyCategoryModel();
    const businessId = "68905add43720ae25de1b80a";
    const categories = await CategoryBbify.find({
      business: businessId,
      isActive: true,
      isDeleted: false,
    }).select("name description");
    res.json(categories);
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

module.exports = {
  getSilkCollections,
  getAllCategories,
};
