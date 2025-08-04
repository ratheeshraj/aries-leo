const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getBestReviews,
  getProductReviews,
  addProductReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const Subscriber = require("../models/subscriberModel");

// Subscribe to newsletter
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }
  try {
    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already subscribed.' });
    }
    const subscriber = new Subscriber({ email });
    await subscriber.save();
    res.status(201).json({ message: 'Subscribed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get best reviews (top 3 of current month, or fallback to top 3 overall)
router.get("/best", getBestReviews);

// Get all reviews for a product
router.get("/:productId", getProductReviews);

// Add a review for a product
router.post("/:productId", protect, addProductReview);

// Update a review
router.put("/:id", protect, updateReview);

// Delete a review
router.delete("/:id", protect, deleteReview);

module.exports = router;
