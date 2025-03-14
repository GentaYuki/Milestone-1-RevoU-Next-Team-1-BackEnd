const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const { createReviewValidation, updateReviewValidation } = require('../middlewares/reviewValidation');

// Route untuk mendapatkan semua review produk dengan filter dan pagination
router.get('/:productId', reviewController.getAllReviews);

// Route untuk membuat review baru
router.post('/', 
    uploadMiddleware,
    createReviewValidation,
    reviewController.createReview
);

// Route untuk mengupdate review
router.put('/:id',
    uploadMiddleware,
    updateReviewValidation,
    reviewController.updateReview
);

// Route untuk menghapus review
router.delete('/:id', reviewController.deleteReview);

// Route untuk menambah helpful count
router.post('/:id/helpful', reviewController.addHelpfulCount);

module.exports = router;
