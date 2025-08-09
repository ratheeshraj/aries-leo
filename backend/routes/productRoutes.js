const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getNewProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/').get(getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new', getNewProducts);
router.route('/:id').get(getProductById);

// Protected routes
router.route('/').post(protect, admin, createProduct);
router
  .route('/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);


module.exports = router;
