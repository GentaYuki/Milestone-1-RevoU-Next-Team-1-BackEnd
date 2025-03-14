const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route untuk mendapatkan detail produk beserta review
router.get('/:id', productController.getProductDetail);

module.exports = router;
