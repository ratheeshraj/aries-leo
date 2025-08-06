const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
} = require("../controllers/contactController");

// Submit a contact form (public)
router.post("/", submitContactForm);

// Get all contact submissions (admin only)
router.get("/", protect, getAllContacts);

// Get a single contact submission by ID (admin only)
router.get("/:id", protect, getContactById);

// Update contact status (admin only)
router.put("/:id", protect, updateContactStatus);

// Delete a contact submission (admin only)
router.delete("/:id", protect, deleteContact);

module.exports = router; 