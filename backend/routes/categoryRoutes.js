const express = require('express');
const router = express.Router();
const {
  getSilkCollections,
  getAllCategories
} = require('../controllers/categoryController');

router.route('/silk-collections').get(getSilkCollections);
router.route('/').get(getAllCategories);

module.exports = router;
