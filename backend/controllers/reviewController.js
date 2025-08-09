const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

// @desc    Get best reviews (top 3 of current month, or fallback to top 3 overall)
// @route   GET /api/reviews/best
// @access  Public
const getBestReviews = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // First, try to get top 3 reviews for the current month
    let reviews = await Review.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(3)
      .populate('product', 'name');

    // If not enough, fallback to top 3 overall
    if (reviews.length < 3) {
      reviews = await Review.find({})
        .sort({ rating: -1, createdAt: -1 })
        .limit(3)
        .populate('product', 'name');
    }

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews: reviews.map((review) => ({
        id: review._id,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        product: review.product ? { id: review.product._id, name: review.product.name } : undefined,
      })),
    });
  } catch (error) {
    console.error("Error fetching best reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch best reviews",
    });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    console.log('Fetching reviews for product:', req.params.productId);
    const reviews = await Review.find({ product: req.params.productId }).sort({
      createdAt: -1,
    });
    console.log('Found reviews:', reviews.length);

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews: reviews.map((review) => ({
        id: review._id,
        user: review.user,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// @desc    Add a review for a product
// @route   POST /api/reviews/:productId
// @access  Private
const addProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  
  try {
    console.log('Adding review for product:', req.params.productId);
    console.log('Review data:', { rating, comment, user: req.user._id });
    // Prevent duplicate review by same user for same product
    const alreadyReviewed = await Review.findOne({
      product: req.params.productId,
      user: req.user._id,
    });
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "Product already reviewed by this user" });
    }
    const review = new Review({
      product: req.params.productId,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });
    await review.save();
    
    // Return the review in the same format as getProductReviews
    res.status(201).json({ 
      message: "Review added", 
      review: {
        id: review._id,
        user: review.user,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add review" });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this review" });
    }

    review.rating = Number(rating) || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();
    res.json({ message: "Review updated", review: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Failed to update review" });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ message: "Review removed" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Failed to delete review" });
  }
};

module.exports = {
  getBestReviews,
  getProductReviews,
  addProductReview,
  updateReview,
  deleteReview,
}; 