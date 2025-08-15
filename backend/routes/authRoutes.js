const express = require('express');
const router = express.Router();
const {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  deleteUserAddress,
  verifyOtp,
  resendOtp,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/address')
  .post(protect, addUserAddress);

router.delete('/address/:addressId', protect, deleteUserAddress);

module.exports = router;
