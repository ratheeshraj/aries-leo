const express = require('express');
const { AirtableController } = require('../controllers/airTableController');

const router = express.Router();
const airtableController = new AirtableController();

// Existing routes
router.get("/getBlogs", (req, res) => {
  airtableController.getBlogs(req, res);
});

router.get("/getTeamMembers", (req, res) => {
  airtableController.getTeamMembers(req, res);
});

module.exports = router;
