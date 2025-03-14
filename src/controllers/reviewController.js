const Review = require('../models/reviewModel');
const Product = require('../models/productModel');
const imagekit = require('../config/imagekit');
const { validationResult } = require('express-validator');

// Controller untuk review
const reviewController = {
    // Get semua review untuk produk tertentu
    getAllReviews: async (req, res) => {
        try {
            const { productId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const sort = req.query.sort || 'newest';
            const rating = parseInt(req.query.rating);

            // Buat query base
            let query = { product_id: productId };
            if (rating) {
                query.rating = rating;
            }

            // Buat sort options
            let sortOptions = {};
            switch (sort) {
                case 'most_helpful':
                    sortOptions = { helpful_count: -1 };
                    break;
                case 'newest':
                default:
                    sortOptions = { created_at: -1 };
            }

            // Hitung total documents untuk pagination
            const total = await Review.countDocuments(query);

            // Get reviews dengan pagination
            const reviews = await Review.find(query)
                .sort(sortOptions)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('user_id', 'name')
                .lean();

            res.json({
                success: true,
                data: {
                    reviews,
                    pagination: {
                        current_page: page,
                        total_pages: Math.ceil(total / limit),
                        total_reviews: total
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error mengambil review',
                error: error.message
            });
        }
    },

    // Tambah review baru
    createReview: async (req, res) => {
        try {
            // Validasi input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validasi error',
                    errors: errors.array()
                });
            }

            const { product_id, user_id, rating, review_text, user_measurements } = req.body;

            // Upload gambar ke ImageKit jika ada
            let imageUrls = [];
            if (req.files && req.files.length > 0) {
                const uploadPromises = req.files.map(file => {
                    return imagekit.upload({
                        file: file.buffer.toString('base64'),
                        fileName: `review-${Date.now()}-${file.originalname}`,
                        folder: '/reviews'
                    });
                });

                const uploadedFiles = await Promise.all(uploadPromises);
                imageUrls = uploadedFiles.map(file => file.url);
            }

            // Buat review baru
            const review = new Review({
                product_id,
                user_id,
                rating,
                review_text,
                images: imageUrls,
                user_measurements
            });

            await review.save();

            // Update product review count
            await Product.findByIdAndUpdate(product_id, {
                $inc: { review_count: 1 },
                $push: { reviews: review._id }
            });

            res.status(201).json({
                success: true,
                message: 'Review berhasil dibuat',
                data: review
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error membuat review',
                error: error.message
            });
        }
    },

    // Edit review
    updateReview: async (req, res) => {
        try {
            const { id } = req.params;
            const { rating, review_text } = req.body;

            // Cek apakah review ada
            const review = await Review.findById(id);
            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: 'Review tidak ditemukan'
                });
            }

            // Update gambar jika ada file baru
            let imageUrls = [...review.images]; // Pertahankan gambar lama
            if (req.files && req.files.length > 0) {
                const uploadPromises = req.files.map(file => {
                    return imagekit.upload({
                        file: file.buffer.toString('base64'),
                        fileName: `review-${Date.now()}-${file.originalname}`,
                        folder: '/reviews'
                    });
                });

                const uploadedFiles = await Promise.all(uploadPromises);
                imageUrls = uploadedFiles.map(file => file.url);
            }

            // Update review
            review.rating = rating || review.rating;
            review.review_text = review_text || review.review_text;
            review.images = imageUrls;

            await review.save();

            res.json({
                success: true,
                message: 'Review berhasil diupdate',
                data: review
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error mengupdate review',
                error: error.message
            });
        }
    },

    // Hapus review
    deleteReview: async (req, res) => {
        try {
            const { id } = req.params;

            // Cek apakah review ada
            const review = await Review.findById(id);
            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: 'Review tidak ditemukan'
                });
            }

            // Hapus gambar dari ImageKit
            if (review.images && review.images.length > 0) {
                // Extract fileId dari URL ImageKit
                const deletePromises = review.images.map(imageUrl => {
                    const fileId = imageUrl.split('/').pop().split('.')[0];
                    return imagekit.deleteFile(fileId);
                });

                await Promise.all(deletePromises);
            }

            // Update product review count
            await Product.findByIdAndUpdate(review.product_id, {
                $inc: { review_count: -1 },
                $pull: { reviews: review._id }
            });

            // Hapus review
            await review.deleteOne();

            res.json({
                success: true,
                message: 'Review berhasil dihapus'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error menghapus review',
                error: error.message
            });
        }
    },

    // Tambah helpful count
    addHelpfulCount: async (req, res) => {
        try {
            const { id } = req.params;
            const { user_id } = req.body;

            const review = await Review.findById(id);
            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: 'Review tidak ditemukan'
                });
            }

            // Increment helpful count
            review.helpful_count += 1;
            await review.save();

            res.json({
                success: true,
                message: 'Helpful count berhasil ditambahkan',
                data: {
                    helpful_count: review.helpful_count
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error menambah helpful count',
                error: error.message
            });
        }
    }
};

module.exports = reviewController;
